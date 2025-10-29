// routes/tv-series.js - TV Series API routes
import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, authorizeRole } from '../lib/auth.js';
import { db } from '../lib/db.js';
import { tvSeries, tvSeriesGenres, seasons, episodes, genres } from '../lib/schema.js';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

const router = express.Router();

// GET /tv-series
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, genre, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    
    if (status) {
      whereConditions.push(eq(tvSeries.status, status));
    }
    
    if (search) {
      whereConditions.push(
        or(
          like(tvSeries.title, `%${search}%`),
          like(tvSeries.description, `%${search}%`)
        )
      );
    }

    const orderBy = sortOrder === 'asc' ? asc(tvSeries[sortBy]) : desc(tvSeries[sortBy]);

    const [seriesData, totalCount] = await Promise.all([
      db.select({
        id: tvSeries.id,
        title: tvSeries.title,
        totalSeasons: tvSeries.totalSeasons,
        totalEpisodes: tvSeries.totalEpisodes,
        firstAirDate: tvSeries.firstAirDate,
        lastAirDate: tvSeries.lastAirDate,
        description: tvSeries.description,
        rating: tvSeries.rating,
        posterUrl: tvSeries.posterUrl,
        status: tvSeries.status,
        createdAt: tvSeries.createdAt,
        updatedAt: tvSeries.updatedAt
      })
      .from(tvSeries)
      .where(and(...whereConditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
      
      db.select({ count: tvSeries.id })
        .from(tvSeries)
        .where(and(...whereConditions))
    ]);

    // Get genres for each series
    const seriesWithGenres = await Promise.all(
      seriesData.map(async (series) => {
        const genreData = await db.select({
          name: genres.name
        })
        .from(tvSeriesGenres)
        .innerJoin(genres, eq(tvSeriesGenres.genreId, genres.id))
        .where(eq(tvSeriesGenres.seriesId, series.id));

        return {
          ...series,
          genres: genreData.map(g => g.name)
        };
      })
    );

    res.json({
      success: true,
      data: seriesWithGenres,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount[0].count,
        totalPages: Math.ceil(totalCount[0].count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /tv-series/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [series] = await db.select({
      id: tvSeries.id,
      title: tvSeries.title,
      totalSeasons: tvSeries.totalSeasons,
      totalEpisodes: tvSeries.totalEpisodes,
      firstAirDate: tvSeries.firstAirDate,
      lastAirDate: tvSeries.lastAirDate,
      description: tvSeries.description,
      rating: tvSeries.rating,
      posterUrl: tvSeries.posterUrl,
      status: tvSeries.status,
      createdAt: tvSeries.createdAt,
      updatedAt: tvSeries.updatedAt
    })
    .from(tvSeries)
    .where(eq(tvSeries.id, id))
    .limit(1);

    if (!series) {
      return res.status(404).json({
        success: false,
        error: 'TV Series not found'
      });
    }

    // Get genres for this series
    const genreData = await db.select({
      name: genres.name
    })
    .from(tvSeriesGenres)
    .innerJoin(genres, eq(tvSeriesGenres.genreId, genres.id))
    .where(eq(tvSeriesGenres.seriesId, series.id));

    // Get seasons for this series
    const seasonsData = await db.select({
      id: seasons.id,
      seasonNumber: seasons.seasonNumber,
      title: seasons.title,
      episodeCount: seasons.episodeCount,
      releaseDate: seasons.releaseDate,
      description: seasons.description,
      posterUrl: seasons.posterUrl
    })
    .from(seasons)
    .where(eq(seasons.seriesId, series.id))
    .orderBy(asc(seasons.seasonNumber));

    res.json({
      success: true,
      data: {
        ...series,
        genres: genreData.map(g => g.name),
        seasons: seasonsData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /tv-series
router.post('/', 
  authenticateToken,
  authorizeRole('admin', 'super_admin'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('rating').optional().isFloat({ min: 0, max: 10 }).withMessage('Rating must be between 0 and 10'),
    body('status').optional().isIn(['active', 'inactive', 'coming_soon', 'ended']).withMessage('Invalid status')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { title, totalSeasons, totalEpisodes, firstAirDate, lastAirDate, description, rating, posterUrl, status, genres: seriesGenres } = req.body;

      // Create TV series
      const [newSeries] = await db.insert(tvSeries)
        .values({
          title,
          totalSeasons,
          totalEpisodes,
          firstAirDate,
          lastAirDate,
          description,
          rating,
          posterUrl,
          status
        })
        .returning();

      // Add genres if provided
      if (seriesGenres && seriesGenres.length > 0) {
        const genreRecords = await db.select({ id: genres.id })
          .from(genres)
          .where(eq(genres.name, seriesGenres[0])); // Simplified for example
        
        if (genreRecords.length > 0) {
          await db.insert(tvSeriesGenres)
            .values({
              seriesId: newSeries.id,
              genreId: genreRecords[0].id
            });
        }
      }

      res.status(201).json({
        success: true,
        data: newSeries,
        message: 'TV Series created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// PUT /tv-series/:id
router.put('/:id', 
  authenticateToken,
  authorizeRole('admin', 'super_admin'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const [updatedSeries] = await db.update(tvSeries)
        .set(updateData)
        .where(eq(tvSeries.id, id))
        .returning();

      if (!updatedSeries) {
        return res.status(404).json({
          success: false,
          error: 'TV Series not found'
        });
      }

      res.json({
        success: true,
        data: updatedSeries,
        message: 'TV Series updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// DELETE /tv-series/:id
router.delete('/:id', 
  authenticateToken,
  authorizeRole('admin', 'super_admin'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const [deletedSeries] = await db.delete(tvSeries)
        .where(eq(tvSeries.id, id))
        .returning();

      if (!deletedSeries) {
        return res.status(404).json({
          success: false,
          error: 'TV Series not found'
        });
      }

      res.json({
        success: true,
        message: 'TV Series deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// GET /tv-series/:id/seasons
router.get('/:id/seasons', async (req, res) => {
  try {
    const { id } = req.params;

    const seasonsData = await db.select({
      id: seasons.id,
      seasonNumber: seasons.seasonNumber,
      title: seasons.title,
      episodeCount: seasons.episodeCount,
      releaseDate: seasons.releaseDate,
      description: seasons.description,
      posterUrl: seasons.posterUrl
    })
    .from(seasons)
    .where(eq(seasons.seriesId, id))
    .orderBy(asc(seasons.seasonNumber));

    res.json({
      success: true,
      data: seasonsData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /tv-series/:id/seasons
router.post('/:id/seasons', 
  authenticateToken,
  authorizeRole('admin', 'super_admin'),
  [
    body('seasonNumber').notEmpty().withMessage('Season number is required'),
    body('title').optional(),
    body('episodeCount').optional().isInt().withMessage('Episode count must be an integer'),
    body('releaseDate').optional().isDate().withMessage('Invalid release date')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { id } = req.params;
      const { seasonNumber, title, episodeCount, releaseDate, description } = req.body;

      const [newSeason] = await db.insert(seasons)
        .values({
          seriesId: id,
          seasonNumber,
          title,
          episodeCount,
          releaseDate,
          description
        })
        .returning();

      res.status(201).json({
        success: true,
        data: newSeason,
        message: 'Season created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

export default router;