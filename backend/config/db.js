const { Pool } = require('pg');

const connection = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'dashboard',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

// Initialize database schema
async function initializeDatabase() {
  try {
    // Create tables
    await connection.query(`
      CREATE TABLE IF NOT EXISTS mentors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL
      )`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        mentor_id INTEGER REFERENCES mentors(id),
        evaluated_by INTEGER REFERENCES mentors(id)
      )`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS student_marks (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL REFERENCES students(id),
        idea_marks INTEGER DEFAULT 0,
        execution_marks INTEGER DEFAULT 0,
        presentation_marks INTEGER DEFAULT 0,
        communication_marks INTEGER DEFAULT 0,
        total_marks INTEGER GENERATED ALWAYS AS (idea_marks + execution_marks + presentation_marks + communication_marks) STORED
      )`);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Initialize database on startup
initializeDatabase();

module.exports = connection;