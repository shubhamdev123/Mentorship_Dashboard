const express = require("express"); // Express framework for Node.js
const bodyParser = require("body-parser"); // Middleware for handling request bodies
const path = require("path");
const port = process.env.PORT || 3001; // Port number for the server to listen on

require('dotenv').config(); // Load environment variables from .env file

// Import the route handlers for mentors and students with error handling
let mentorRoutes, studentRoutes, seedRoutes;

try {
  mentorRoutes = require("./routes/mentorRoutes");
  studentRoutes = require("./routes/studentRoutes");
  seedRoutes = require("./routes/seedRoutes");
} catch (error) {
  console.error('Error loading routes:', error);
  // Create fallback routes
  mentorRoutes = express.Router();
  studentRoutes = express.Router();
  seedRoutes = express.Router();
  
  // Add fallback endpoints
  mentorRoutes.get('*', (req, res) => res.status(500).json({ error: 'Mentor routes not available' }));
  studentRoutes.get('*', (req, res) => res.status(500).json({ error: 'Student routes not available' }));
  seedRoutes.get('*', (req, res) => res.status(500).json({ error: 'Seed routes not available' }));
}

const app = express();

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/build')));

// Route handlers for the mentor and student routes
app.use("/mentors", mentorRoutes);
app.use("/students", studentRoutes);
app.use("/seed", seedRoutes);

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
