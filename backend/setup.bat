@echo off
echo Setting up Digital Document Verification Portal...
echo.

echo Step 1: Starting MongoDB using Docker...
docker-compose up -d mongodb
if %errorlevel% neq 0 (
    echo Error: Failed to start MongoDB. Please ensure Docker Desktop is running.
    echo You can also install MongoDB locally and update the settings.
    pause
    exit /b 1
)

echo Step 2: Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies.
    pause
    exit /b 1
)

echo Step 3: Running Django migrations...
python manage.py makemigrations
python manage.py migrate
if %errorlevel% neq 0 (
    echo Error: Failed to run migrations. Please check MongoDB connection.
    pause
    exit /b 1
)

echo Step 4: Creating superuser...
echo Please create an admin user when prompted:
python manage.py createsuperuser

echo.
echo Setup completed successfully!
echo.
echo To start the server, run: python manage.py runserver
echo.
echo Access the application at: http://localhost:8000
echo Access the admin panel at: http://localhost:8000/admin
echo.
pause
