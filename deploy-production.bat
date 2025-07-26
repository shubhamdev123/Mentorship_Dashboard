@echo off
echo Deploying Mentorship Dashboard for Production...

echo.
echo Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Root dependency installation failed!
    pause
    exit /b 1
)

echo.
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Backend dependency installation failed!
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo Frontend dependency installation failed!
    pause
    exit /b 1
)

echo.
echo Building React application for production...
call npm run build
if %errorlevel% neq 0 (
    echo React build failed!
    pause
    exit /b 1
)

echo.
echo Production build completed!
echo.
echo To deploy to Render:
echo 1. Push your changes to GitHub
echo 2. Render will automatically deploy from your repository
echo 3. Check the deployment logs in your Render dashboard
echo.
echo Your app will be available at: https://mentorship-dashboard-yrv4.onrender.com
echo.
echo For local testing, use: npm start
echo.
pause