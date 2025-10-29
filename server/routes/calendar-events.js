// routes/calendar-events.js - Calendar Events API routes
import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, authorizeRole } from '../lib/auth.js';
import { db } from '../lib/db.js';
import { calendarEvents } from '../lib/schema.js';
import { eq, and, or, like, desc, asc, gte, lte } from 'drizzle-orm';

const router = express.Router();

// GET /calendar-events
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, eventType, status, sortBy = 'eventDate', sortOrder = 'asc' } = req.query;

    let whereConditions = [];
    
    if (eventType) {
      whereConditions.push(eq(calendarEvents.eventType, eventType));
    }
    
    if (status) {
      whereConditions.push(eq(calendarEvents.status, status));
    }
    
    if (startDate) {
      whereConditions.push(gte(calendarEvents.eventDate, new Date(startDate)));
    }
    
    if (endDate) {
      whereConditions.push(lte(calendarEvents.eventDate, new Date(endDate)));
    }

    const orderBy = sortOrder === 'asc' ? asc(calendarEvents[sortBy]) : desc(calendarEvents[sortBy]);

    const eventsData = await db.select({
      id: calendarEvents.id,
      title: calendarEvents.title,
      description: calendarEvents.description,
      eventDate: calendarEvents.eventDate,
      location: calendarEvents.location,
      eventType: calendarEvents.eventType,
      status: calendarEvents.status,
      createdAt: calendarEvents.createdAt,
      updatedAt: calendarEvents.updatedAt
    })
    .from(calendarEvents)
    .where(and(...whereConditions))
    .orderBy(orderBy);

    res.json({
      success: true,
      data: eventsData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /calendar-events/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [event] = await db.select({
      id: calendarEvents.id,
      title: calendarEvents.title,
      description: calendarEvents.description,
      eventDate: calendarEvents.eventDate,
      location: calendarEvents.location,
      eventType: calendarEvents.eventType,
      status: calendarEvents.status,
      createdAt: calendarEvents.createdAt,
      updatedAt: calendarEvents.updatedAt
    })
    .from(calendarEvents)
    .where(eq(calendarEvents.id, id))
    .limit(1);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Calendar event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /calendar-events
router.post('/', 
  authenticateToken,
  authorizeRole('admin', 'super_admin'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('eventDate').notEmpty().withMessage('Event date is required'),
    body('eventType').notEmpty().withMessage('Event type is required'),
    body('status').optional().isIn(['scheduled', 'cancelled', 'completed', 'postponed']).withMessage('Invalid status')
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

      const { title, description, eventDate, location, eventType, status } = req.body;

      // Create calendar event
      const [newEvent] = await db.insert(calendarEvents)
        .values({
          title,
          description,
          eventDate: new Date(eventDate),
          location,
          eventType,
          status
        })
        .returning();

      res.status(201).json({
        success: true,
        data: newEvent,
        message: 'Calendar event created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// PUT /calendar-events/:id
router.put('/:id', 
  authenticateToken,
  authorizeRole('admin', 'super_admin'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Convert eventDate to Date object if provided
      if (updateData.eventDate) {
        updateData.eventDate = new Date(updateData.eventDate);
      }

      const [updatedEvent] = await db.update(calendarEvents)
        .set(updateData)
        .where(eq(calendarEvents.id, id))
        .returning();

      if (!updatedEvent) {
        return res.status(404).json({
          success: false,
          error: 'Calendar event not found'
        });
      }

      res.json({
        success: true,
        data: updatedEvent,
        message: 'Calendar event updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// DELETE /calendar-events/:id
router.delete('/:id', 
  authenticateToken,
  authorizeRole('admin', 'super_admin'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const [deletedEvent] = await db.delete(calendarEvents)
        .where(eq(calendarEvents.id, id))
        .returning();

      if (!deletedEvent) {
        return res.status(404).json({
          success: false,
          error: 'Calendar event not found'
        });
      }

      res.json({
        success: true,
        message: 'Calendar event deleted successfully'
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