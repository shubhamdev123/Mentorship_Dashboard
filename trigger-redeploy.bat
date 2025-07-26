@echo off
echo ========================================
echo TRIGGER MANUAL REDEPLOY ON RENDER
echo ========================================
echo.

echo Current Status:
echo - Database: ✅ Working (24 students, 4 mentors)
echo - API Routes: ❌ Not working in production
echo - Web App: ❌ Cannot access database data
echo.

echo STEP-BY-STEP REDEPLOY INSTRUCTIONS:
echo ===================================
echo.

echo 1. Open your browser and go to:
echo    https://dashboard.render.com
echo.

echo 2. Sign in to your Render account
echo.

echo 3. Click on your "mentorship-dashboard" service
echo.

echo 4. In the service dashboard, look for the "Manual Deploy" button
echo    (usually in the top right or main actions area)
echo.

echo 5. Click "Manual Deploy"
echo.

echo 6. In the deployment options, select:
echo    ☑ "Clear build cache & deploy"
echo.

echo 7. Click "Deploy latest commit"
echo.

echo 8. Wait for deployment to complete (2-3 minutes)
echo    - Watch the build logs for any errors
echo    - Look for these success messages:
echo      ✓ "Environment variables loaded from .env file"
echo      ✓ "Using DATABASE_URL for connection"
echo      ✓ "Database connection initialized"
echo      ✓ "Mentor routes mounted at /mentors"
echo      ✓ "Student routes mounted at /students"
echo      ✓ "Server running on port 3001"
echo.

echo 9. Once deployment is complete, test these URLs:
echo    - Health: https://mentorship-dashboard-yrv4.onrender.com/health
echo    - Students: https://mentorship-dashboard-yrv4.onrender.com/students/test
echo    - Mentors: https://mentorship-dashboard-yrv4.onrender.com/mentors/test
echo    - Student Select: https://mentorship-dashboard-yrv4.onrender.com/student-select
echo.

echo 10. If the API routes work, you should see:
echo     - JSON responses instead of HTML
echo     - Students data on the student-select page
echo     - 24 students (16 unassigned) available for selection
echo.

echo ========================================
echo IMPORTANT: The database has all the data!
echo The issue is just with API route loading.
echo A redeploy should fix this completely.
echo ========================================
echo.

pause