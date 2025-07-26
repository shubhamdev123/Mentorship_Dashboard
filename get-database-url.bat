@echo off
echo FreeSQL Database URL Generator
echo =============================
echo.
echo Please enter your FreeSQL database credentials:
echo.
set /p DB_HOST=Host (e.g., sql12.freesqldatabase.com): 
set /p DB_NAME=Database Name (e.g., sql12792036): 
set /p DB_USER=Username (e.g., sql12792036): 
set /p DB_PASS=Password: 
echo.
echo Your DATABASE_URL should be:
echo mysql://%DB_USER%:%DB_PASS%@%DB_HOST%:3306/%DB_NAME%
echo.
echo Add this to your Render environment variables as DATABASE_URL
pause