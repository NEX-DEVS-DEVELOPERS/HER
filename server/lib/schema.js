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

// Relations will be defined when needed
// export const genresRelations = relations(genres, ({
//   movieGenres: { many: movieGenres },
//   tvSeriesGenres: { many: tvSeriesGenres },
//   songGenres: { many: songGenres }
// }));

// export const usersRelations = relations(users, ({}));

// export const moviesRelations = relations(movies, ({
//   movieGenres: { many: movieGenres }
// }));

// export const tvSeriesRelations = relations(tvSeries, ({
//   tvSeriesGenres: { many: tvSeriesGenres },
//   seasons: { many: seasons }
// }));

// export const seasonsRelations = relations(seasons, ({
//   series: { one: tvSeries },
//   episodes: { many: episodes }
// }));

// export const episodesRelations = relations(episodes, ({
//   season: { one: seasons }
// }));

// export const songsRelations = relations(songs, ({
//   songGenres: { many: songGenres }
// }));

// export const calendarEventsRelations = relations(calendarEvents, ({}));

// export const movieGenresRelations = relations(movieGenres, ({
//   movie: { one: movies },
//   genre: { one: genres }
// }));

// export const tvSeriesGenresRelations = relations(tvSeriesGenres, ({
//   series: { one: tvSeries },
//   genre: { one: genres }
// }));

// export const songGenresRelations = relations(songGenres, ({
//   song: { one: songs },
//   genre: { one: genres }
// }));