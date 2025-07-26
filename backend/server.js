const express = require("express"); // Express framework for Node.js
const bodyParser = require("body-parser"); // Middleware for handling request bodies
const path = require("path");
const db = require("./config/db"); // Connection to database
const port = process.env.PORT || 3001; // Port number for the server to listen on

require('dotenv').config(); // Load environment variables from .env file

// Import the route handlers for mentors and students
const mentorRoutes = require("./routes/mentorRoutes");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/build')));

// Route handlers for the mentor and student routes
app.use("/mentors", mentorRoutes);
app.use("/students", studentRoutes);

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database URL: ${process.env.DATABASE_URL ? 'SET' : 'NOT SET'}`);
});
