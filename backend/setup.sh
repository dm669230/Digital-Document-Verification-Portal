#!/bin/bash

echo "Setting up Digital Document Verification Portal..."
echo

echo "Step 1: Starting MongoDB using Docker..."
docker-compose up -d mongodb
if [ $? -ne 0 ]; then
    echo "Error: Failed to start MongoDB. Please ensure Docker is running."
    echo "You can also install MongoDB locally and update the settings."
    exit 1
fi

echo "Step 2: Installing Python dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies."
    exit 1
fi

echo "Step 3: Running Django migrations..."
python manage.py makemigrations
python manage.py migrate
if [ $? -ne 0 ]; then
    echo "Error: Failed to run migrations. Please check MongoDB connection."
    exit 1
fi

echo "Step 4: Creating superuser..."
echo "Please create an admin user when prompted:"
python manage.py createsuperuser

echo
echo "Setup completed successfully!"
echo
echo "To start the server, run: python manage.py runserver"
echo
echo "Access the application at: http://localhost:8000"
echo "Access the admin panel at: http://localhost:8000/admin"
echo
