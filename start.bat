@echo off
echo Starting Mentorship Dashboard...

echo Starting backend server...
start "Backend Server" cmd /k "cd backend && node server.js"

timeout /t 3 /nobreak > nul

echo Starting frontend development server...
start "Frontend Server" cmd /k "cd client && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul