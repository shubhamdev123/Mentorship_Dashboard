@echo off
echo Production Debugging Script
echo ===========================
echo.

echo Current Status Check:
echo ---------------------
echo.

echo 1. Testing basic connectivity...
curl -s -I https://mentorship-dashboard-yrv4.onrender.com/
echo.

echo 2. Testing health endpoint (should return JSON)...
curl -s https://mentorship-dashboard-yrv4.onrender.com/health
echo.

echo 3. Testing API status endpoint...
curl -s https://mentorship-dashboard-yrv4.onrender.com/api-status
echo.

echo 4. Testing database connection endpoint...
curl -s https://mentorship-dashboard-yrv4.onrender.com/test-db
echo.

echo.
echo ==========================================
echo MANUAL STEPS TO CHECK DEPLOYMENT STATUS:
echo ==========================================
echo.
echo 1. Go to Render Dashboard:
echo    https://dashboard.render.com
echo.
echo 2. Click on your mentorship-dashboard service
echo.
echo 3. Check the "Events" tab for deployment status
echo    - Look for "Build successful" or "Deploy successful"
echo    - If failed, check the error messages
echo.
echo 4. Check the "Logs" tab for runtime errors
echo    Look for these messages:
echo    ✓ "Environment variables loaded from .env file"
echo    ✓ "Using DATABASE_URL for connection"
echo    ✓ "Database connection initialized"
echo    ✓ "Connected to database server successfully"
echo    ✓ "Mentor routes mounted successfully"
echo    ✓ "Student routes mounted successfully"
echo    ✓ "Server running on port 3001"
echo.
echo 5. If you see errors, common issues are:
echo    - Database connection failed (check DATABASE_URL)
echo    - Route loading failed (check file paths)
echo    - Build failed (check dependencies)
echo.
echo 6. To force a redeploy:
echo    - Go to your service in Render
echo    - Click "Manual Deploy"
echo    - Select "Clear build cache & deploy"
echo.
pause