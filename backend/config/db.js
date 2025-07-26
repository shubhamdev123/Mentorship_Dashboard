const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});



// Initialize database tables

// Create the "mentors" table
pool.query(`
  CREATE TABLE IF NOT EXISTS mentors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL
  )`, (err) => {
    if (err) throw err;
    console.log('Mentors table created');
  });

// Create the "students" table
pool.query(`
  CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    mentor_id INT REFERENCES mentors(id),
    evaluated_by INT REFERENCES mentors(id)
  )`, (err) => {
    if (err) throw err;
    console.log('Students table created');
  });

// Create the "student_marks" table
pool.query(`
  CREATE TABLE IF NOT EXISTS student_marks (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(id),
    idea_marks INT DEFAULT 0,
    execution_marks INT DEFAULT 0,
    presentation_marks INT DEFAULT 0,
    communication_marks INT DEFAULT 0,
    total_marks INT GENERATED ALWAYS AS (idea_marks + execution_marks + presentation_marks + communication_marks) STORED
  )`, (err) => {
    if (err) throw err;
    console.log('Student marks table created');
  });

module.exports = pool;