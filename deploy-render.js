const express = require('express');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env file if it exists
try {
  require('dotenv').config({ path: './backend/.env' });
  console.log('Environment variables loaded from .env file');
} catch (error) {
  console.log('No .env file found, using environment variables from Render');
}

// Initialize database connection
let db;
try {
  db = require('./backend/config/db');
  console.log('Database connection initialized');
} catch (error) {
  console.error('Database connection error:', error);
  db = null;
}

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: db ? 'Connected' : 'Not connected',
    databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    nodeEnv: process.env.NODE_ENV || 'development'
  });
});

// Database test route
app.get('/test-db', (req, res) => {
  if (!db) {
    return res.json({ 
      status: 'ERROR', 
      message: 'Database connection not available',
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET'
    });
  }
  
  db.query('SELECT 1 as test', (err, result) => {
    if (err) {
      res.json({ 
        status: 'ERROR', 
        message: 'Database query failed',
        error: err.message
      });
    } else {
      res.json({ 
        status: 'SUCCESS', 
        message: 'Database connection working',
        result: result
      });
    }
  });
});

// Serve static files from React build
const buildPath = path.join(__dirname, 'client/build');
console.log('Build path:', buildPath);
console.log('Build directory exists:', fs.existsSync(buildPath));

if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  console.log('Static files middleware mounted');
} else {
  console.log('Build directory not found, skipping static file serving');
}

// API routes
try {
  console.log('Loading mentor routes...');
  const fs = require('fs');
  const mentorRoutesPath = './backend/routes/mentorRoutes.js';
  const studentRoutesPath = './backend/routes/studentRoutes.js';
  
  console.log('Checking if mentor routes file exists:', fs.existsSync(mentorRoutesPath));
  console.log('Checking if student routes file exists:', fs.existsSync(studentRoutesPath));
  
  const mentorRoutes = require(mentorRoutesPath);
  console.log('Mentor routes loaded:', typeof mentorRoutes);
  
  console.log('Loading student routes...');
  const studentRoutes = require(studentRoutesPath);
  console.log('Student routes loaded:', typeof studentRoutes);
  
  if (typeof mentorRoutes === 'function') {
    app.use('/mentors', mentorRoutes);
    console.log('Mentor routes mounted successfully');
  } else {
    console.error('Mentor routes is not a valid Express router, type:', typeof mentorRoutes);
    // Add fallback mentor routes
    app.get('/mentors', (req, res) => {
      res.json({ message: 'Mentor routes not properly loaded' });
    });
  }
  
  if (typeof studentRoutes === 'function') {
    app.use('/students', studentRoutes);
    console.log('Student routes mounted successfully');
  } else {
    console.error('Student routes is not a valid Express router, type:', typeof studentRoutes);
    // Add fallback student routes
    app.get('/students', (req, res) => {
      res.json({ message: 'Student routes not properly loaded' });
    });
  }
  
  // Add a route to check if API routes are working
  app.get('/api-status', (req, res) => {
    res.json({
      status: 'API Routes Status',
      mentorRoutes: typeof mentorRoutes === 'function' ? 'Loaded' : 'Failed',
      studentRoutes: typeof studentRoutes === 'function' ? 'Loaded' : 'Failed',
      database: db ? 'Available' : 'Not Available'
    });
  });
  
} catch (error) {
  console.error('Error loading routes:', error);
  // Fallback routes for basic functionality
  app.get('/mentors', (req, res) => {
    res.json({ message: 'Mentor routes not available', error: error.message });
  });
  app.get('/students', (req, res) => {
    res.json({ message: 'Student routes not available', error: error.message });
  });
}

// Serve React app for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'client/build/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.json({ message: 'React app not built yet. Please check the build process.' });
  }
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