@echo off
echo Production Deployment Check
echo ===========================
echo.

echo 1. Checking if the app is responding...
curl -s https://mentorship-dashboard-yrv4.onrender.com/health
echo.
echo.

echo 2. Checking API routes...
echo Testing /mentors endpoint:
curl -s https://mentorship-dashboard-yrv4.onrender.com/mentors
echo.
echo.

echo 3. Checking if React app loads...
echo Testing main page:
curl -s -I https://mentorship-dashboard-yrv4.onrender.com/
echo.
echo.

echo 4. Database Connection Test
echo ==========================
echo.
echo To check the database connection, you need to:
echo 1. Go to your Render dashboard: https://dashboard.render.com
echo 2. Click on your mentorship-dashboard service
echo 3. Go to the "Logs" tab
echo 4. Look for these messages:
echo    - "Using DATABASE_URL for connection"
echo    - "Database connection initialized"
echo    - "Connected to database server successfully"
echo    - "Mentor routes mounted successfully"
echo    - "Student routes mounted successfully"
echo.
echo If you see database connection errors, check:
echo - DATABASE_URL format is correct
echo - FreeSQL database is active
echo - Password is correct
echo.
pause