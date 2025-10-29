# API Endpoints Documentation

This document provides comprehensive API endpoints for the entertainment content management system, including authentication and CRUD operations for all content types.

## API Base URL
```
http://localhost:3001/api/v1
```

## Authentication Endpoints

### POST /auth/login
Login user and return JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@example.com",
    "role": "super_admin"
  },
  "token": "jwt-token-here"
}
```

### POST /auth/register
Register a new user (admin only).

**Request Body:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "admin"
}
```

### GET /auth/profile
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@example.com",
    "role": "super_admin",
    "lastLogin": "2025-10-28T12:00:00Z"
  }
}
```

## Movies Endpoints

### GET /movies
Get all movies with optional filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `genre` (string): Filter by genre
- `status` (string): Filter by status
- `search` (string): Search in title and description

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Inception",
      "releaseDate": "2010-07-16",
      "duration": 148,
      "director": "Christopher Nolan",
      "description": "A thief who steals corporate secrets...",
      "rating": 8.8,
      "posterUrl": "https://example.com/inception.jpg",
      "status": "active",
      "genres": ["Sci-Fi", "Thriller"],
      "createdAt": "2025-10-28T12:00:00Z",
      "updatedAt": "2025-10-28T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 10,
    "totalPages": 1
  }
}
```

### GET /movies/:id
Get a specific movie by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Inception",
    "releaseDate": "2010-07-16",
    "duration": 148,
    "director": "Christopher Nolan",
    "description": "A thief who steals corporate secrets...",
    "rating": 8.8,
    "posterUrl": "https://example.com/inception.jpg",
    "status": "active",
    "genres": ["Sci-Fi", "Thriller"],
    "createdAt": "2025-10-28T12:00:00Z",
    "updatedAt": "2025-10-28T12:00:00Z"
  }
}
```

### POST /movies
Create a new movie (requires authentication).

**Request Body:**
```json
{
  "title": "New Movie",
  "releaseDate": "2025-12-01",
  "duration": 120,
  "director": "Director Name",
  "description": "Movie description",
  "rating": 8.5,
  "posterUrl": "https://example.com/poster.jpg",
  "status": "active",
  "genres": ["Action", "Thriller"]
}
```

### PUT /movies/:id
Update a movie (requires authentication).

**Request Body:**
```json
{
  "title": "Updated Movie Title",
  "rating": 9.0,
  "status": "active"
}
```

### DELETE /movies/:id
Delete a movie (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "Movie deleted successfully"
}
```

## TV Series Endpoints

### GET /tv-series
Get all TV series with filtering and pagination.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Breaking Bad",
      "totalSeasons": 5,
      "totalEpisodes": 62,
      "firstAirDate": "2008-01-20",
      "lastAirDate": "2013-09-29",
      "description": "A high school chemistry teacher...",
      "rating": 9.5,
      "posterUrl": "https://example.com/breakingbad.jpg",
      "status": "ended",
      "genres": ["Drama", "Thriller"],
      "seasons": [
        {
          "id": "uuid",
          "seasonNumber": 1,
          "title": "Season 1",
          "episodeCount": 7,
          "releaseDate": "2008-01-20"
        }
      ]
    }
  ]
}
```

### GET /tv-series/:id
Get a specific TV series by ID with seasons and episodes.

### POST /tv-series
Create a new TV series (requires authentication).

**Request Body:**
```json
{
  "title": "New Series",
  "totalSeasons": 1,
  "totalEpisodes": 10,
  "firstAirDate": "2025-01-01",
  "description": "Series description",
  "rating": 8.5,
  "posterUrl": "https://example.com/poster.jpg",
  "status": "active",
  "genres": ["Drama", "Mystery"]
}
```

### GET /tv-series/:id/seasons
Get all seasons for a specific TV series.

### POST /tv-series/:id/seasons
Add a new season to a TV series (requires authentication).

**Request Body:**
```json
{
  "seasonNumber": 2,
  "title": "Season 2",
  "episodeCount": 10,
  "releaseDate": "2025-06-01",
  "description": "Season 2 description"
}
```

### GET /seasons/:id/episodes
Get all episodes for a specific season.

### POST /seasons/:id/episodes
Add a new episode to a season (requires authentication).

**Request Body:**
```json
{
  "episodeNumber": 1,
  "title": "Episode Title",
  "duration": 45,
  "airDate": "2025-06-01",
  "description": "Episode description"
}
```

## Songs Endpoints

### GET /songs
Get all songs with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `artist` (string): Filter by artist
- `genre` (string): Filter by genre
- `album` (string): Filter by album
- `search` (string): Search in title and artist

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Bohemian Rhapsody",
      "artist": "Queen",
      "album": "A Night at the Opera",
      "duration": 354,
      "releaseDate": "1975-10-31",
      "lyrics": "Is this the real life?...",
      "coverArtUrl": "https://example.com/cover.jpg",
      "audioUrl": "https://example.com/audio.mp3",
      "status": "active",
      "genres": ["Rock"],
      "createdAt": "2025-10-28T12:00:00Z"
    }
  ]
}
```

### GET /songs/:id
Get a specific song by ID.

### POST /songs
Create a new song (requires authentication).

**Request Body:**
```json
{
  "title": "New Song",
  "artist": "Artist Name",
  "album": "Album Name",
  "duration": 240,
  "releaseDate": "2025-01-01",
  "lyrics": "Song lyrics...",
  "coverArtUrl": "https://example.com/cover.jpg",
  "audioUrl": "https://example.com/audio.mp3",
  "status": "active",
  "genres": ["Pop", "Rock"]
}
```

### PUT /songs/:id
Update a song (requires authentication).

### DELETE /songs/:id
Delete a song (requires authentication).

## Calendar Events Endpoints

### GET /calendar-events
Get all calendar events with filtering.

**Query Parameters:**
- `startDate` (date): Filter events from this date
- `endDate` (date): Filter events until this date
- `eventType` (string): Filter by event type
- `status` (string): Filter by status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Movie Night: Inception",
      "description": "Join us for a mind-bending evening...",
      "eventDate": "2025-11-15T19:00:00Z",
      "location": "Home Theater",
      "eventType": "Movie Night",
      "status": "scheduled",
      "createdAt": "2025-10-28T12:00:00Z"
    }
  ]
}
```

### GET /calendar-events/:id
Get a specific calendar event by ID.

### POST /calendar-events
Create a new calendar event (requires authentication).

**Request Body:**
```json
{
  "title": "New Event",
  "description": "Event description",
  "eventDate": "2025-12-01T19:00:00Z",
  "location": "Event Location",
  "eventType": "Movie Night",
  "status": "scheduled"
}
```

### PUT /calendar-events/:id
Update a calendar event (requires authentication).

### DELETE /calendar-events/:id
Delete a calendar event (requires authentication).

## Genres Endpoints

### GET /genres
Get all genres.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Action",
      "description": "High-energy films with physical stunts...",
      "createdAt": "2025-10-28T12:00:00Z"
    }
  ]
}
```

### POST /genres
Create a new genre (requires authentication).

**Request Body:**
```json
{
  "name": "New Genre",
  "description": "Genre description"
}
```

## Users Endpoints (Admin Only)

### GET /users
Get all users (admin only).

### GET /users/:id
Get a specific user by ID (admin only).

### PUT /users/:id
Update a user (admin only).

### DELETE /users/:id
Delete a user (admin only).

## File Upload Endpoints

### POST /upload/poster
Upload movie/TV series poster image.

**Request:** multipart/form-data with file field named "poster"

**Response:**
```json
{
  "success": true,
  "url": "https://example.com/uploads/poster.jpg"
}
```

### POST /upload/cover-art
Upload song cover art.

**Request:** multipart/form-data with file field named "cover"

### POST /upload/audio
Upload audio file for songs.

**Request:** multipart/form-data with file field named "audio"

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Common Error Codes:
- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid input data
- `DUPLICATE_ENTRY` (409): Resource already exists
- `INTERNAL_ERROR` (500): Server error

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- 100 requests per minute per IP address
- 1000 requests per hour per authenticated user

## Pagination

List endpoints support pagination with these parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Response includes pagination metadata:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Search and Filtering

Most list endpoints support search and filtering:
- `search`: Text search in relevant fields
- `status`: Filter by status
- `genre`: Filter by genre
- Date range filters for calendar events

## Sorting

List endpoints support sorting with these parameters:
- `sortBy`: Field to sort by
- `sortOrder`: `asc` or `desc` (default: `desc` for created_at)

Example: `GET /movies?sortBy=title&sortOrder=asc`

## API Implementation Example

Here's how to implement these endpoints using Express.js:

```javascript
// routes/movies.js - Example implementation
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

export default router;
```

This comprehensive API documentation provides all the endpoints needed for a fully functional entertainment content management system.