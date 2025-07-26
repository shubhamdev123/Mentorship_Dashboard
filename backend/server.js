const express = require("express"); // Express framework for Node.js
const bodyParser = require("body-parser"); // Middleware for handling request bodies
const path = require("path");
const fs = require('fs');
const port = process.env.PORT || 3001; // Port number for the server to listen on

// Load environment variables from .env file if it exists
try {
  require('dotenv').config();
  console.log('Environment variables loaded from .env file');
} catch (error) {
  console.log('No .env file found, using environment variables from Render');
}

// Initialize database connection
let db;
try {
  db = require("./config/db");
  console.log('Database connection initialized');
} catch (error) {
  console.error('Database connection error:', error);
  db = null;
}

const app = express();

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

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

// API routes - Load before static files to ensure they take precedence
console.log('=== Loading API Routes ===');

// Load mentor routes
let mentorRoutes = null;
try {
  console.log('Loading mentor routes...');
  mentorRoutes = require("./routes/mentorRoutes");
  console.log('✅ Mentor routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading mentor routes:', error.message);
}

// Load student routes
let studentRoutes = null;
try {
  console.log('Loading student routes...');
  studentRoutes = require("./routes/studentRoutes");
  console.log('✅ Student routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading student routes:', error.message);
}

// Mount API routes
if (mentorRoutes && typeof mentorRoutes === 'function') {
  app.use('/mentors', mentorRoutes);
  console.log('✅ Mentor routes mounted at /mentors');
} else {
  console.log('⚠️  Using fallback mentor routes');
  app.get('/mentors', (req, res) => {
    res.json({ message: 'Mentor routes not available' });
  });
}

if (studentRoutes && typeof studentRoutes === 'function') {
  app.use('/students', studentRoutes);
  console.log('✅ Student routes mounted at /students');
} else {
  console.log('⚠️  Using fallback student routes');
  app.get('/students', (req, res) => {
    res.json({ message: 'Student routes not available' });
  });
}

// API status endpoint
app.get('/api-status', (req, res) => {
  res.json({
    status: 'API Routes Status',
    mentorRoutes: mentorRoutes && typeof mentorRoutes === 'function' ? 'Loaded' : 'Failed',
    studentRoutes: studentRoutes && typeof studentRoutes === 'function' ? 'Loaded' : 'Failed',
    database: db ? 'Available' : 'Not Available',
    timestamp: new Date().toISOString()
  });
});

// Basic fallback API endpoints
app.get('/api/students', (req, res) => {
  if (!db) {
    return res.status(500).json({ error: 'Database not available' });
  }
  
  const query = 'SELECT * FROM students ORDER BY id';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query failed', message: err.message });
    } else {
      res.json(results);
    }
  });
});

app.get('/api/mentors', (req, res) => {
  if (!db) {
    return res.status(500).json({ error: 'Database not available' });
  }
  
  const query = 'SELECT * FROM mentors ORDER BY id';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query failed', message: err.message });
    } else {
      res.json(results);
    }
  });
});

console.log('=== API Routes Loading Complete ===');

// Serve static files from React build
const buildPath = path.join(__dirname, '../client/build');
console.log('Build path:', buildPath);
console.log('Build directory exists:', fs.existsSync(buildPath));

if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  console.log('Static files middleware mounted');
} else {
  console.log('Build directory not found, skipping static file serving');
}

// Serve React app for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../client/build/index.html');
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
