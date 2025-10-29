// routes/genres.js - Genres API routes
import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, authorizeRole } from '../lib/auth.js';
import { db } from '../lib/db.js';
import { genres } from '../lib/schema.js';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

const router = express.Router();

// GET /genres
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'name', sortOrder = 'asc' } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    
    if (search) {
      whereConditions.push(
        or(
          like(genres.name, `%${search}%`),
          like(genres.description, `%${search}%`)
        )
      );
    }

    const orderBy = sortOrder === 'asc' ? asc(genres[sortBy]) : desc(genres[sortBy]);

    const [genresData, totalCount] = await Promise.all([
      db.select({
        id: genres.id,
        name: genres.name,
        description: genres.description,
        createdAt: genres.createdAt,
        updatedAt: genres.updatedAt
      })
      .from(genres)
      .where(and(...whereConditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
      
      db.select({ count: genres.id })
        .from(genres)
        .where(and(...whereConditions))
    ]);

    res.json({
      success: true,
      data: genresData,
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

// GET /genres/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [genre] = await db.select({
      id: genres.id,
      name: genres.name,
      description: genres.description,
      createdAt: genres.createdAt,
      updatedAt: genres.updatedAt
    })
    .from(genres)
    .where(eq(genres.id, id))
    .limit(1);

    if (!genre) {
      return res.status(404).json({
        success: false,
        error: 'Genre not found'
      });
    }

    res.json({
      success: true,
      data: genre
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /genres
router.post('/', 
  authenticateToken,
  authorizeRole('admin', 'super_admin'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('name').isLength({ min: 1, max: 50 }).withMessage('Name must be between 1 and 50 characters'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description must not exceed 500 characters')
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

      const { name, description } = req.body;

      // Check if genre already exists
      const existingGenre = await db.select()
        .from(genres)
        .where(eq(genres.name, name))
        .limit(1);

      if (existingGenre.length > 0) {
        return res.status(409).json({
          success: false,
          error: 'Genre already exists'
        });
      }

      // Create new genre
      const [newGenre] = await db.insert(genres)
        .values({
          name,
          description
        })
        .returning();

      res.status(201).json({
        success: true,
        data: newGenre,
        message: 'Genre created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// PUT /genres/:id
router.put('/:id', 
  authenticateToken,
  authorizeRole('admin', 'super_admin'),
  [
    body('name').optional().isLength({ min: 1, max: 50 }).withMessage('Name must be between 1 and 50 characters'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description must not exceed 500 characters')
  ],
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Check if name is being updated and if it already exists
      if (updateData.name) {
        const existingGenre = await db.select()
          .from(genres)
          .where(and(
            eq(genres.name, updateData.name),
            // Exclude current genre from check
            // Note: In a real implementation, you might want to handle this differently
          ))
          .limit(1);

        if (existingGenre.length > 0 && existingGenre[0].id !== id) {
          return res.status(409).json({
            success: false,
            error: 'Genre name already exists'
          });
        }
      }

      const [updatedGenre] = await db.update(genres)
        .set(updateData)
        .where(eq(genres.id, id))
        .returning();

      if (!updatedGenre) {
        return res.status(404).json({
          success: false,
          error: 'Genre not found'
        });
      }

      res.json({
        success: true,
        data: updatedGenre,
        message: 'Genre updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// DELETE /genres/:id
router.delete('/:id', 
  authenticateToken,
  authorizeRole('admin', 'super_admin'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const [deletedGenre] = await db.delete(genres)
        .where(eq(genres.id, id))
        .returning();

      if (!deletedGenre) {
        return res.status(404).json({
          success: false,
          error: 'Genre not found'
        });
      }

      res.json({
        success: true,
        message: 'Genre deleted successfully'
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