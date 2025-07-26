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
echo Starting production server...
cd ..\backend
node server.js