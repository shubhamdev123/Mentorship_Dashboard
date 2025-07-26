# Deployment Guide

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MySQL** server running on localhost
3. **Git** (optional)

## Quick Deployment

### Option 1: Automated Deployment
```bash
# Run the deployment script
npm run deploy
```

### Option 2: Manual Deployment
```bash
# Install dependencies
npm install
cd backend && npm install
cd ../client && npm install

# Build React app
cd client && npm run build

# Start the application
npm run start
```

## Production Deployment

```bash
# Run production deployment
deploy-production.bat
```

This will:
- Install all dependencies
- Build the React app for production
- Start the server on port 3001
- Serve the React app from the backend

## Database Setup

The application automatically creates the required database and tables when the backend starts. Make sure MySQL is running with the credentials in `backend/config/db.js`.

## Environment Variables

Ensure the `.env` file exists in the `backend` folder with:
```
EMAIL=your-email@gmail.com
APP_PASS=your-app-password
```

## Access the Application

- **Development**: Frontend (http://localhost:3000) + Backend (http://localhost:3001)
- **Production**: Single server (http://localhost:3001)

## Available Scripts

- `npm run deploy` - Deploy the application
- `npm run start` - Start both servers (development)
- `npm run dev` - Start with concurrently (requires concurrently package)
- `deploy-production.bat` - Production deployment