const express = require('express');
const path = require('path');
const db = require('./backend/config/db');

require('dotenv').config({ path: './backend/.env' });

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client/build')));

// API routes
app.use('/mentors', require('./backend/routes/mentorRoutes'));
app.use('/students', require('./backend/routes/studentRoutes'));

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});