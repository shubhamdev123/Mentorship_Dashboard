@echo off
echo Redeploying Mentorship Dashboard
echo ================================
echo.

echo 1. Checking current deployment status...
echo.
echo Please go to your Render dashboard:
echo https://dashboard.render.com
echo.
echo 2. Click on your mentorship-dashboard service
echo.
echo 3. Click "Manual Deploy" button
echo.
echo 4. Select "Clear build cache & deploy"
echo.
echo 5. Wait for deployment to complete (2-3 minutes)
echo.
echo 6. Check the logs for these messages:
echo    ✓ "Environment variables loaded from .env file"
echo    ✓ "Using DATABASE_URL for connection"
echo    ✓ "Database connection initialized"
echo    ✓ "Connected to database server successfully"
echo    ✓ "Mentor routes mounted successfully"
echo    ✓ "Student routes mounted successfully"
echo    ✓ "Server running on port 3001"
echo.
echo 7. Test the API endpoints:
echo    - Health: https://mentorship-dashboard-yrv4.onrender.com/health
echo    - Students: https://mentorship-dashboard-yrv4.onrender.com/students/search?q=test
echo    - Mentors: https://mentorship-dashboard-yrv4.onrender.com/mentors/search?q=test
echo.
echo 8. Test the student-select page:
echo    https://mentorship-dashboard-yrv4.onrender.com/student-select
echo.
echo The database has 24 students (16 unassigned) ready to be displayed!
echo.
pause