// server.js - Express server entry point
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkDatabaseConnection } from './lib/db.js';
import { basicAuth } from './middleware/auth.js';
import 'dotenv/config';

// Import routes
import authRoutes from './routes/auth.js';
import moviesRoutes from './routes/movies.js';
import tvSeriesRoutes from './routes/tv-series.js';
import songsRoutes from './routes/songs.js';
import calendarEventsRoutes from './routes/calendar-events.js';
import genresRoutes from './routes/genres.js';
import uploadRoutes from './routes/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(basicAuth);
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from Vite build
app.use(express.static(path.join(__dirname, '../dist')));

// Health check endpoint
app.get('/health', async (req, res) => {
  const dbStatus = await checkDatabaseConnection();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movies', moviesRoutes);
app.use('/api/v1/tv-series', tvSeriesRoutes);
app.use('/api/v1/songs', songsRoutes);
app.use('/api/v1/calendar-events', calendarEventsRoutes);
app.use('/api/v1/genres', genresRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.details
    });
  }
  
  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized access'
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API route not found'
  });
});

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  
  // Check database connection
  const dbStatus = await checkDatabaseConnection();
  if (dbStatus.success) {
    console.log('✅ Database connected successfully');
  } else {
    console.error('❌ Database connection failed:', dbStatus.message);
  }
});

export default app;