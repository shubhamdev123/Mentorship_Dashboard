const mysql = require('mysql2');

let connection = null;

try {
  if (process.env.DATABASE_URL) {
    console.log('Using DATABASE_URL for connection');
    connection = mysql.createConnection(process.env.DATABASE_URL);
  } else {
    console.log('Using local database configuration');
    connection = mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Amplifier26#',
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || 'dashboard'
    });
  }

  // Connect to database
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return;
    }
    console.log('Connected to database server successfully');
    
    // Create tables after successful connection
    createTables();
  });

} catch (error) {
  console.error('Error creating database connection:', error);
}

const createTables = () => {
  if (!connection) {
    console.error('No database connection available');
    return;
  }

  console.log('Creating tables...');
  
  // Create mentors table
  connection.query(`CREATE TABLE IF NOT EXISTS mentors (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    PRIMARY KEY (id)
  )`, (err) => {
    if (err) {
      console.error('Error creating mentors table:', err);
    } else {
      console.log('Mentors table created or already exists');
    }
  });

  // Create students table
  connection.query(`CREATE TABLE IF NOT EXISTS students (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    mentor_id INT,
    evaluated_by INT,
    PRIMARY KEY (id),
    FOREIGN KEY (mentor_id) REFERENCES mentors(id),
    FOREIGN KEY (evaluated_by) REFERENCES mentors(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating students table:', err);
    } else {
      console.log('Students table created or already exists');
    }
  });

  // Create student_marks table
  connection.query(`CREATE TABLE IF NOT EXISTS student_marks (
    id INT NOT NULL AUTO_INCREMENT,
    student_id INT NOT NULL,
    idea_marks INT DEFAULT 0,
    execution_marks INT DEFAULT 0,
    presentation_marks INT DEFAULT 0,
    communication_marks INT DEFAULT 0,
    total_marks INT DEFAULT 0,
    PRIMARY KEY (id),
    FOREIGN KEY (student_id) REFERENCES students(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating student_marks table:', err);
    } else {
      console.log('Student marks table created or already exists');
    }
  });
};

module.exports = connection;
