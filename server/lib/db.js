// lib/db.js - Database connection utility
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';
import 'dotenv/config';

// Create database connection
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema, logger: true });

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