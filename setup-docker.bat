@echo off
echo ========================================
echo Digital Document Verification Portal
echo Docker Setup Script
echo ========================================
echo.

echo Checking if Docker is running...
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running or not installed!
    echo Please install Docker Desktop and start it.
    pause
    exit /b 1
)

echo Docker is running. Proceeding with setup...
echo.

echo Building and starting all services...
echo This may take a few minutes on first run...
echo.

docker-compose up --build -d

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Services are now running:
echo - Frontend:    http://localhost:3000
echo - Backend API: http://localhost:8000
echo - MongoDB:     localhost:27017
echo - Mongo Express: http://localhost:8081
echo.
echo To view logs: docker-compose logs -f
echo To stop:      docker-compose down
echo To restart:   docker-compose restart
echo.
pause
