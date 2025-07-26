@echo off
echo Testing Deployment Locally
echo =========================
echo.

echo 1. Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install root dependencies
    pause
    exit /b 1
)

echo.
echo 2. Installing client dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo Failed to install client dependencies
    pause
    exit /b 1
)

echo.
echo 3. Building client...
call npm run build
if %errorlevel% neq 0 (
    echo Failed to build client
    pause
    exit /b 1
)
cd ..

echo.
echo 4. Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo 5. Testing deployment script...
node deploy-render.js
echo.
echo If you see "Server running on port 3001" above, the deployment script is working correctly.
echo.
pause