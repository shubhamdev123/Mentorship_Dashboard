const mysql = require('mysql2');

let connection;

if (process.env.DATABASE_URL) {
  connection = mysql.createConnection(process.env.DATABASE_URL);
} else {
  connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Amplifier26#',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'dashboard'
  });
}

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database server');
});

const createTables = () => {
  connection.query(`CREATE TABLE IF NOT EXISTS mentors (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, phone VARCHAR(20) NOT NULL, PRIMARY KEY (id))`, (err) => {
    if (err) console.error('Error creating mentors table:', err);
    else console.log('Mentors table created or already exists');
  });

  connection.query(`CREATE TABLE IF NOT EXISTS students (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, phone VARCHAR(20) NOT NULL, mentor_id INT, evaluated_by INT, PRIMARY KEY (id), FOREIGN KEY (mentor_id) REFERENCES mentors(id), FOREIGN KEY (evaluated_by) REFERENCES mentors(id))`, (err) => {
    if (err) console.error('Error creating students table:', err);
    else console.log('Students table created or already exists');
  });

  connection.query(`CREATE TABLE IF NOT EXISTS student_marks (id INT NOT NULL AUTO_INCREMENT, student_id INT NOT NULL, idea_marks INT DEFAULT 0, execution_marks INT DEFAULT 0, presentation_marks INT DEFAULT 0, communication_marks INT DEFAULT 0, total_marks INT DEFAULT 0, PRIMARY KEY (id), FOREIGN KEY (student_id) REFERENCES students(id))`, (err) => {
    if (err) console.error('Error creating student_marks table:', err);
    else console.log('Student marks table created or already exists');
  });
};

setTimeout(createTables, 2000);

module.exports = connection;
