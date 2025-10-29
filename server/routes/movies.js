// routes/movies.js - Movies API routes
import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, authorizeRole } from '../lib/auth.js';
import { db } from '../lib/db.js';
import { movies, movieGenres, genres } from '../lib/schema.js';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

const router = express.Router();

// GET /movies
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, genre, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    
    if (status) {
      whereConditions.push(eq(movies.status, status));
    }
    
    if (search) {
      whereConditions.push(
        or(
          like(movies.title, `%${search}%`),
          like(movies.description, `%${search}%`)
        )
      );
    }

    const orderBy = sortOrder === 'asc' ? asc(movies[sortBy]) : desc(movies[sortBy]);

    const [moviesData, totalCount] = await Promise.all([
      db.select({
        id: movies.id,
        title: movies.title,
        releaseDate: movies.releaseDate,
        duration: movies.duration,
        director: movies.director,
        description: movies.description,
        rating: movies.rating,
        posterUrl: movies.posterUrl,
        status: movies.status,
        createdAt: movies.createdAt,
        updatedAt: movies.updatedAt
      })
      .from(movies)
      .where(and(...whereConditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
      
      db.select({ count: movies.id })
        .from(movies)
        .where(and(...whereConditions))
    ]);

    // Get genres for each movie
    const moviesWithGenres = await Promise.all(
      moviesData.map(async (movie) => {
        const genreData = await db.select({
          name: genres.name
        })
        .from(movieGenres)
        .innerJoin(genres, eq(movieGenres.genreId, genres.id))
        .where(eq(movieGenres.movieId, movie.id));

        return {
          ...movie,
          genres: genreData.map(g => g.name)
        };
      })
    );

    res.json({
      success: true,
      data: moviesWithGenres,
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

// GET /movies/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [movie] = await db.select({
      id: movies.id,
      title: movies.title,
      releaseDate: movies.releaseDate,
      duration: movies.duration,
      director: movies.director,
      description: movies.description,
      rating: movies.rating,
      posterUrl: movies.posterUrl,
      status: movies.status,
      createdAt: movies.createdAt,
      updatedAt: movies.updatedAt
    })
    .from(movies)
    .where(eq(movies.id, id))
    .limit(1);

    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }

    // Get genres for this movie
    const genreData = await db.select({
      name: genres.name
    })
    .from(movieGenres)
    .innerJoin(genres, eq(movieGenres.genreId, genres.id))
    .where(eq(movieGenres.movieId, movie.id));

    res.json({
      success: true,
      data: {
        ...movie,
        genres: genreData.map(g => g.name)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /movies
router.post('/', 
  authenticateToken,
  authorizeRole('admin', 'super_admin'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('rating').optional().isFloat({ min: 0, max: 10 }).withMessage('Rating must be between 0 and 10'),
    body('status').optional().isIn(['active', 'inactive', 'coming_soon']).withMessage('Invalid status')
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

      const { title, releaseDate, duration, director, description, rating, posterUrl, status, genres: movieGenres } = req.body;

      // Create movie
      const [newMovie] = await db.insert(movies)
        .values({
          title,
          releaseDate,
          duration,
          director,
          description,
          rating,
          posterUrl,
          status
        })
        .returning();

      // Add genres if provided
      if (movieGenres && movieGenres.length > 0) {
        const genreRecords = await db.select({ id: genres.id })
          .from(genres)
          .where(eq(genres.name, movieGenres[0])); // Simplified for example
        
        if (genreRecords.length > 0) {
          await db.insert(movieGenres)
            .values({
              movieId: newMovie.id,
              genreId: genreRecords[0].id
            });
        }
      }

      res.status(201).json({
        success: true,
        data: newMovie,
        message: 'Movie created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// PUT /movies/:id
router.put('/:id', 
  authenticateToken,
  authorizeRole('admin', 'super_admin'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const [updatedMovie] = await db.update(movies)
        .set(updateData)
        .where(eq(movies.id, id))
        .returning();

      if (!updatedMovie) {
        return res.status(404).json({
          success: false,
          error: 'Movie not found'
        });
      }

      res.json({
        success: true,
        data: updatedMovie,
        message: 'Movie updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// DELETE /movies/:id
router.delete('/:id', 
  authenticateToken,
  authorizeRole('admin', 'super_admin'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const [deletedMovie] = await db.delete(movies)
        .where(eq(movies.id, id))
        .returning();

      if (!deletedMovie) {
        return res.status(404).json({
          success: false,
          error: 'Movie not found'
        });
      }

      res.json({
        success: true,
        message: 'Movie deleted successfully'
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