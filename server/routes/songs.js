// routes/songs.js - Songs API routes
import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, authorizeRole } from '../lib/auth.js';
import { db } from '../lib/db.js';
import { songs, songGenres, genres } from '../lib/schema.js';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

const router = express.Router();

// GET /songs
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, artist, genre, album, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    
    if (artist) {
      whereConditions.push(eq(songs.artist, artist));
    }
    
    if (album) {
      whereConditions.push(eq(songs.album, album));
    }
    
    if (search) {
      whereConditions.push(
        or(
          like(songs.title, `%${search}%`),
          like(songs.artist, `%${search}%`)
        )
      );
    }

    const orderBy = sortOrder === 'asc' ? asc(songs[sortBy]) : desc(songs[sortBy]);

    const [songsData, totalCount] = await Promise.all([
      db.select({
        id: songs.id,
        title: songs.title,
        artist: songs.artist,
        album: songs.album,
        duration: songs.duration,
        releaseDate: songs.releaseDate,
        lyrics: songs.lyrics,
        coverArtUrl: songs.coverArtUrl,
        audioUrl: songs.audioUrl,
        status: songs.status,
        createdAt: songs.createdAt,
        updatedAt: songs.updatedAt
      })
      .from(songs)
      .where(and(...whereConditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
      
      db.select({ count: songs.id })
        .from(songs)
        .where(and(...whereConditions))
    ]);

    // Get genres for each song
    const songsWithGenres = await Promise.all(
      songsData.map(async (song) => {
        const genreData = await db.select({
          name: genres.name
        })
        .from(songGenres)
        .innerJoin(genres, eq(songGenres.genreId, genres.id))
        .where(eq(songGenres.songId, song.id));

        return {
          ...song,
          genres: genreData.map(g => g.name)
        };
      })
    );

    res.json({
      success: true,
      data: songsWithGenres,
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

// GET /songs/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [song] = await db.select({
      id: songs.id,
      title: songs.title,
      artist: songs.artist,
      album: songs.album,
      duration: songs.duration,
      releaseDate: songs.releaseDate,
      lyrics: songs.lyrics,
      coverArtUrl: songs.coverArtUrl,
      audioUrl: songs.audioUrl,
      status: songs.status,
      createdAt: songs.createdAt,
      updatedAt: songs.updatedAt
    })
    .from(songs)
    .where(eq(songs.id, id))
    .limit(1);

    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Song not found'
      });
    }

    // Get genres for this song
    const genreData = await db.select({
      name: genres.name
    })
    .from(songGenres)
    .innerJoin(genres, eq(songGenres.genreId, genres.id))
    .where(eq(songGenres.songId, song.id));

    res.json({
      success: true,
      data: {
        ...song,
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

// POST /songs
router.post('/', 
  authenticateToken,
  authorizeRole('admin', 'super_admin'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('artist').notEmpty().withMessage('Artist is required'),
    body('duration').optional().isInt().withMessage('Duration must be an integer'),
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

      const { title, artist, album, duration, releaseDate, lyrics, coverArtUrl, audioUrl, status, genres: songGenres } = req.body;

      // Create song
      const [newSong] = await db.insert(songs)
        .values({
          title,
          artist,
          album,
          duration,
          releaseDate,
          lyrics,
          coverArtUrl,
          audioUrl,
          status
        })
        .returning();

      // Add genres if provided
      if (songGenres && songGenres.length > 0) {
        const genreRecords = await db.select({ id: genres.id })
          .from(genres)
          .where(eq(genres.name, songGenres[0])); // Simplified for example
        
        if (genreRecords.length > 0) {
          await db.insert(songGenres)
            .values({
              songId: newSong.id,
              genreId: genreRecords[0].id
            });
        }
      }

      res.status(201).json({
        success: true,
        data: newSong,
        message: 'Song created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// PUT /songs/:id
router.put('/:id', 
  authenticateToken,
  authorizeRole('admin', 'super_admin'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const [updatedSong] = await db.update(songs)
        .set(updateData)
        .where(eq(songs.id, id))
        .returning();

      if (!updatedSong) {
        return res.status(404).json({
          success: false,
          error: 'Song not found'
        });
      }

      res.json({
        success: true,
        data: updatedSong,
        message: 'Song updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// DELETE /songs/:id
router.delete('/:id', 
  authenticateToken,
  authorizeRole('admin', 'super_admin'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const [deletedSong] = await db.delete(songs)
        .where(eq(songs.id, id))
        .returning();

      if (!deletedSong) {
        return res.status(404).json({
          success: false,
          error: 'Song not found'
        });
      }

      res.json({
        success: true,
        message: 'Song deleted successfully'
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