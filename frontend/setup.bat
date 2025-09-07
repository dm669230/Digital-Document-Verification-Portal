@echo off
echo Setting up Digital Document Verification Portal Frontend...
echo.

echo Installing dependencies...
call npm install

echo.
echo Creating environment file...
echo REACT_APP_API_URL=http://localhost:8000/api > .env
echo REACT_APP_ENV=development >> .env

echo.
echo Setup complete! You can now run:
echo   npm start
echo.
pause
