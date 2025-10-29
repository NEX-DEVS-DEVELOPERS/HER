# Database Setup and API Implementation

This document provides the complete setup instructions and implementation details for connecting the entertainment content management system to Neon PostgreSQL database.

## 1. Database Setup Script

### Node.js Setup Script (setup-db.js)

```javascript
// setup-db.js - Database initialization script
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

// Database connection
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...');
    
    // Read and execute schema
    const schemaPath = path.join(process.cwd(), 'database/schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Creating tables and relationships...');
    await sql`${schemaSQL}`;
    
    // Read and execute data insertion
    const dataPath = path.join(process.cwd(), 'database/data.sql');
    const dataSQL = fs.readFileSync(dataPath, 'utf8');
    
    console.log('📊 Inserting sample data...');
    await sql`${dataSQL}`;
    
    console.log('✅ Database setup completed successfully!');
    console.log('🎬 Entertainment CMS is ready to use!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}

export default setupDatabase;
```

### Package.json Dependencies

```json
{
  "dependencies": {
    "@neondatabase/serverless": "^1.0.2",
    "drizzle-orm": "^0.29.0",
    "dotenv": "^17.2.3",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "express": "^5.1.0",
    "express-validator": "^7.0.1",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/multer": "^1.4.11",
    "nodemon": "^3.1.10"
  }
}
```

### Environment Configuration (.env)

```env
# Database Configuration
DATABASE_URL="postgresql://neondb_owner:npg_4nMCSgDZl2hk@ep-nameless-feather-a8q3pxnu-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3001
NODE_ENV="development"

# File Upload Configuration
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE="10485760" # 10MB
```

## 2. Database Connection Utility

### Database Connection Module (lib/db.js)

```javascript
// lib/db.js - Database connection utility
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';
import 'dotenv/config';

// Create database connection
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

// Database health check
export async function checkDatabaseConnection() {
  try {
    await sql`SELECT 1`;
    return { success: true, message: 'Database connection successful' };
  } catch (error) {
    return { success: false, message: `Database connection failed: ${error.message}` };
  }
}

// Transaction helper
export async function withTransaction(callback) {
  try {
    const result = await db.transaction(callback);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default db;
```

### Database Schema Definition (lib/schema.js)

```javascript
// lib/schema.js - Drizzle ORM schema definitions
import { pgTable, uuid, varchar, text, integer, decimal, date, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Utility function for UUID generation
const generateUUID = () => crypto.randomUUID();

// Genres table
export const genres = pgTable('genres', {
  id: uuid('id').primaryKey().default(generateUUID()),
  name: varchar('name', { length: 50 }).unique().notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(generateUUID()),
  username: varchar('username', { length: 50 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).default('admin').notNull(),
  isActive: boolean('is_active').default(true),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Movies table
export const movies = pgTable('movies', {
  id: uuid('id').primaryKey().default(generateUUID()),
  title: varchar('title', { length: 255 }).notNull(),
  releaseDate: date('release_date'),
  duration: integer('duration'),
  director: varchar('director', { length: 255 }),
  description: text('description'),
  rating: decimal('rating', { precision: 3, scale: 1 }),
  posterUrl: varchar('poster_url', { length: 500 }),
  status: varchar('status', { length: 20 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// TV Series table
export const tvSeries = pgTable('tv_series', {
  id: uuid('id').primaryKey().default(generateUUID()),
  title: varchar('title', { length: 255 }).notNull(),
  totalSeasons: integer('total_seasons').default(1),
  totalEpisodes: integer('total_episodes').default(0),
  firstAirDate: date('first_air_date'),
  lastAirDate: date('last_air_date'),
  description: text('description'),
  rating: decimal('rating', { precision: 3, scale: 1 }),
  posterUrl: varchar('poster_url', { length: 500 }),
  status: varchar('status', { length: 20 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Seasons table
export const seasons = pgTable('seasons', {
  id: uuid('id').primaryKey().default(generateUUID()),
  seriesId: uuid('series_id').references(() => tvSeries.id, { onDelete: 'cascade' }),
  seasonNumber: integer('season_number').notNull(),
  title: varchar('title', { length: 255 }),
  episodeCount: integer('episode_count').default(0),
  releaseDate: date('release_date'),
  description: text('description'),
  posterUrl: varchar('poster_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Episodes table
export const episodes = pgTable('episodes', {
  id: uuid('id').primaryKey().default(generateUUID()),
  seasonId: uuid('season_id').references(() => seasons.id, { onDelete: 'cascade' }),
  episodeNumber: integer('episode_number').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  duration: integer('duration'),
  airDate: date('air_date'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Songs table
export const songs = pgTable('songs', {
  id: uuid('id').primaryKey().default(generateUUID()),
  title: varchar('title', { length: 255 }).notNull(),
  artist: varchar('artist', { length: 255 }).notNull(),
  album: varchar('album', { length: 255 }),
  duration: integer('duration'),
  releaseDate: date('release_date'),
  lyrics: text('lyrics'),
  coverArtUrl: varchar('cover_art_url', { length: 500 }),
  audioUrl: varchar('audio_url', { length: 500 }),
  status: varchar('status', { length: 20 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Calendar Events table
export const calendarEvents = pgTable('calendar_events', {
  id: uuid('id').primaryKey().default(generateUUID()),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  eventDate: timestamp('event_date').notNull(),
  location: varchar('location', { length: 255 }),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  status: varchar('status', { length: 20 }).default('scheduled'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Junction tables
export const movieGenres = pgTable('movie_genres', {
  movieId: uuid('movie_id').references(() => movies.id, { onDelete: 'cascade' }),
  genreId: uuid('genre_id').references(() => genres.id, { onDelete: 'cascade' })
});

export const tvSeriesGenres = pgTable('tv_series_genres', {
  seriesId: uuid('series_id').references(() => tvSeries.id, { onDelete: 'cascade' }),
  genreId: uuid('genre_id').references(() => genres.id, { onDelete: 'cascade' })
});

export const songGenres = pgTable('song_genres', {
  songId: uuid('song_id').references(() => songs.id, { onDelete: 'cascade' }),
  genreId: uuid('genre_id').references(() => genres.id, { onDelete: 'cascade' })
});

// Relations
export const genresRelations = relations(genres, ({
  movieGenres: { many: movieGenres },
  tvSeriesGenres: { many: tvSeriesGenres },
  songGenres: { many: songGenres }
}));

export const usersRelations = relations(users, ({}));

export const moviesRelations = relations(movies, ({
  movieGenres: { many: movieGenres }
}));

export const tvSeriesRelations = relations(tvSeries, ({
  tvSeriesGenres: { many: tvSeriesGenres },
  seasons: { many: seasons }
}));

export const seasonsRelations = relations(seasons, ({
  series: { one: tvSeries },
  episodes: { many: episodes }
}));

export const episodesRelations = relations(episodes, ({
  season: { one: seasons }
}));

export const songsRelations = relations(songs, ({
  songGenres: { many: songGenres }
}));

export const calendarEventsRelations = relations(calendarEvents, ({}));

export const movieGenresRelations = relations(movieGenres, ({
  movie: { one: movies },
  genre: { one: genres }
}));

export const tvSeriesGenresRelations = relations(tvSeriesGenres, ({
  series: { one: tvSeries },
  genre: { one: genres }
}));

export const songGenresRelations = relations(songGenres, ({
  song: { one: songs },
  genre: { one: genres }
}));
```

## 3. Authentication Middleware

### Authentication Utilities (lib/auth.js)

```javascript
// lib/auth.js - Authentication utilities
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from './db.js';
import { users } from './schema.js';
import { eq } from 'drizzle-orm';

// Password hashing
export async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Password verification
export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// JWT token generation
export function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
}

// JWT token verification
export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Authentication middleware
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// Role-based authorization middleware
export function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// User authentication
export async function authenticateUser(username, password) {
  try {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!user || !user.isActive) {
      return { success: false, error: 'Invalid credentials' };
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Update last login
    await db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id));

    const token = generateToken(user);
    
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## 4. Setup Instructions

### Step 1: Install Dependencies

```bash
npm install @neondatabase/serverless drizzle-orm dotenv bcrypt jsonwebtoken cors express express-validator multer
npm install -D @types/bcrypt @types/jsonwebtoken @types/multer nodemon
```

### Step 2: Configure Environment

Create a `.env` file with your Neon database connection string and other configuration:

```env
DATABASE_URL="your-neon-database-url"
JWT_SECRET="your-secret-jwt-key"
PORT=3001
NODE_ENV="development"
```

### Step 3: Run Database Setup

```bash
node setup-db.js
```

### Step 4: Start the Server

```bash
npm run dev
```

## 5. Database Migration

For production environments, consider using Drizzle migrations:

```javascript
// migrate.js - Database migration script
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { db } from './lib/db.js';

async function runMigrations() {
  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
```

This setup provides a complete foundation for your entertainment content management system with proper database connection, authentication, and error handling.