# Digital Document Verification Portal - Setup Instructions

## Prerequisites

1. **Python 3.11+** installed on your system
2. **Docker Desktop** installed and running (for MongoDB)
3. **Git** (if cloning the repository)

## Quick Setup

### Option 1: Using Docker (Recommended)

1. **Start MongoDB using Docker:**
   ```bash
   # Start only MongoDB service
   docker-compose up -d mongodb
   
   # Or start all services (MongoDB + Mongo Express)
   docker-compose up -d
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run Django migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Create a superuser:**
   ```bash
   python manage.py createsuperuser
   ```

5. **Start the development server:**
   ```bash
   python manage.py runserver
   ```

### Option 2: Using Local MongoDB

If you have MongoDB installed locally:

1. **Start MongoDB service** on your system
2. **Update database settings** in `befisc/settings.py`:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'djongo',
           'NAME': 'befisc_db',
           'ENFORCE_SCHEMA': True,
           'CLIENT': {
               'host': 'localhost',  # Change from 'mongodb' to 'localhost'
               'port': 27017,
               'username': 'befisc_user',
               'password': 'befisc_password',
               'authSource': 'befisc_db',
           }
       }
   }
   ```

3. **Create the database and user:**
   ```bash
   # Connect to MongoDB
   mongosh
   
   # Create database and user
   use befisc_db
   db.createUser({
     user: 'befisc_user',
     pwd: 'befisc_password',
     roles: [{ role: 'readWrite', db: 'befisc_db' }]
   })
   ```

4. **Follow steps 2-5 from Option 1**

## Accessing the Application

- **Django Admin:** http://localhost:8000/admin/
- **API Endpoints:** http://localhost:8000/api/
- **Mongo Express (if using Docker):** http://localhost:8081/
  - Username: `admin`
  - Password: `password123`

## API Endpoints

### Authentication
- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login
- `POST /api/users/logout/` - User logout
- `POST /api/token/` - Get JWT token
- `POST /api/token/refresh/` - Refresh JWT token

### Documents
- `GET /api/documents/` - List documents
- `POST /api/documents/` - Upload document
- `GET /api/documents/{id}/` - Get document details
- `POST /api/documents/{id}/verify/` - Verify document (admin only)

### User Management
- `GET /api/profile/` - Get user profile
- `PUT /api/profile/` - Update user profile
- `POST /api/change-password/` - Change password

### Admin Features
- `GET /api/admin-dashboard/` - Admin dashboard
- `POST /api/bulk-verify/` - Bulk verify documents

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `docker ps` (should show mongodb container)
- Check MongoDB logs: `docker logs befisc_mongodb`
- Verify credentials in `befisc/settings.py`

### Django Issues
- Run `python manage.py check` to identify configuration issues
- Check for missing dependencies: `pip install -r requirements.txt`
- Clear Python cache: `find . -name "*.pyc" -delete`

### Port Conflicts
- Change ports in `docker-compose.yml` if 8000 or 27017 are in use
- Update `ALLOWED_HOSTS` in `befisc/settings.py` if accessing from different machines

## Development Notes

- The application uses JWT authentication with token blacklisting
- File uploads are stored in the `media/` directory
- MongoDB collections are automatically created when models are used
- All API endpoints require authentication except registration and login

## Security Considerations

- Change the `SECRET_KEY` in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Configure proper CORS settings for frontend integration
