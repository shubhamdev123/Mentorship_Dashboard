@echo off
echo Starting Mentorship Dashboard Deployment...

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
echo Building React application...
call npm run build
if %errorlevel% neq 0 (
    echo React build failed!
    pause
    exit /b 1
)

echo.
echo Deployment completed successfully!
echo.
echo To start the application:
echo 1. Make sure MySQL is running
echo 2. Run 'npm run start' to start both frontend and backend
echo.
pause