// routes/auth.js - Authentication routes
import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateUser, hashPassword } from '../lib/auth.js';
import { db } from '../lib/db.js';
import { users } from '../lib/schema.js';
import { eq } from 'drizzle-orm';

const router = express.Router();

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { username, password } = req.body;
    const result = await authenticateUser(username, password);

    if (result.success) {
      res.json(result);
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /auth/register (admin only)
router.post('/register', 
  async (req, res, next) => {
    try {
      // Check if user is admin (this would be handled by middleware in production)
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        return res.status(401).json({ error: 'Admin access required' });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { username, email, password, role = 'admin' } = req.body;

      // Check if user already exists
      const existingUser = await db.select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      if (existingUser.length > 0) {
        return res.status(409).json({
          success: false,
          error: 'Username already exists'
        });
      }

      const existingEmail = await db.select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingEmail.length > 0) {
        return res.status(409).json({
          success: false,
          error: 'Email already exists'
        });
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create new user
      const [newUser] = await db.insert(users)
        .values({
          username,
          email,
          passwordHash,
          role,
          isActive: true
        })
        .returning();

      res.status(201).json({
        success: true,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        },
        message: 'User created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// GET /auth/profile
router.get('/profile', async (req, res) => {
  try {
    // This would be protected by authentication middleware
    const userId = req.user.id;

    const [user] = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      role: users.role,
      lastLogin: users.lastLogin,
      createdAt: users.createdAt
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;