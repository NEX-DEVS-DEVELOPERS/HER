// setup-db.js - Database initialization script
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

// Database connection
const sql = neon(process.env.DATABASE_URL);

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...');
    
    // Read and execute schema
    const schemaPath = path.join(process.cwd(), 'schema.sql');
    console.log('📁 Reading schema from:', schemaPath);
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Creating tables and relationships...');
    
    // Split schema SQL by semicolons and execute each statement
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}`);
        await sql.unsafe(statement);
      }
    }
    
    // Read and execute data insertion
    const dataPath = path.join(process.cwd(), 'data.sql');
    console.log('📁 Reading data from:', dataPath);
    const dataSQL = fs.readFileSync(dataPath, 'utf8');
    
    console.log('📊 Inserting sample data...');
    
    // Split data SQL by semicolons and execute each statement
    const dataStatements = dataSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`📝 Found ${dataStatements.length} data statements to execute`);
    
    for (let i = 0; i < dataStatements.length; i++) {
      const statement = dataStatements[i];
      if (statement.trim()) {
        console.log(`⚡ Executing data statement ${i + 1}/${dataStatements.length}`);
        await sql.unsafe(statement);
      }
    }
    
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