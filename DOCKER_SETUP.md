# Digital Document Verification Portal - Docker Setup

This document provides comprehensive instructions for running the Digital Document Verification Portal using Docker Compose.

## Architecture Overview

The application consists of four main services:

1. **MongoDB** - Database server
2. **Mongo Express** - Database administration UI
3. **Backend** - Django REST API server
4. **Frontend** - React.js application

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)
- At least 4GB of available RAM
- Ports 3000, 8000, 27017, and 8081 available

## Quick Start

### Windows
```bash
# Run the setup script
setup-docker.bat
```

### Linux/macOS
```bash
# Make the script executable
chmod +x setup-docker.sh

# Run the setup script
./setup-docker.sh
```

### Manual Setup
```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## Service Details

### MongoDB (Port 27017)
- **Image**: mongo:7.0
- **Purpose**: Primary database for the application
- **Credentials**: 
  - Username: `admin`
  - Password: `password123`
  - Database: `befisc_db`

### Mongo Express (Port 8081)
- **Image**: mongo-express:latest
- **Purpose**: Web-based MongoDB administration interface
- **URL**: http://localhost:8081
- **Credentials**:
  - Username: `admin`
  - Password: `password123`

### Backend API (Port 8000)
- **Image**: Custom Django application
- **Purpose**: REST API server
- **URL**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/

### Frontend (Port 3000)
- **Image**: Custom React application
- **Purpose**: User interface
- **URL**: http://localhost:3000

## Docker Compose Configuration

The `docker-compose.yml` file defines all services and their relationships:

```yaml
version: '3.8'

services:
  mongodb:          # Database server
  mongo-express:    # Database admin UI
  backend:          # Django API server
  frontend:         # React application

volumes:
  mongodb_data:     # Persistent MongoDB data

networks:
  befisc_network:   # Internal network for service communication
```

## Environment Variables

### Backend Environment
- `DEBUG=1` - Enable Django debug mode
- `DJANGO_SETTINGS_MODULE=befisc.settings` - Django settings module

### Frontend Environment
- `REACT_APP_API_URL=http://localhost:8000/api` - Backend API URL
- `REACT_APP_ENV=production` - Environment mode

## Data Persistence

- **MongoDB Data**: Stored in Docker volume `mongodb_data`
- **Application Code**: Mounted as volumes for development
- **Static Files**: Generated during container build

## Common Commands

### Start Services
```bash
# Start all services in background
docker-compose up -d

# Start with build (rebuild images)
docker-compose up --build -d

# Start specific service
docker-compose up -d mongodb
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete all data)
docker-compose down -v
```

### View Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Access Containers
```bash
# Access backend container
docker-compose exec backend bash

# Access frontend container
docker-compose exec frontend sh

# Access MongoDB container
docker-compose exec mongodb mongosh
```

### Restart Services
```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

## Development Workflow

### Backend Development
1. Code changes are automatically reflected (volume mounted)
2. Django development server auto-reloads
3. Database migrations: `docker-compose exec backend python manage.py migrate`

### Frontend Development
1. For development, use `npm start` locally instead of Docker
2. For production testing, use Docker container
3. Code changes require container rebuild

## Troubleshooting

### Port Conflicts
If ports are already in use:
```bash
# Check what's using the ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000
netstat -tulpn | grep :27017
netstat -tulpn | grep :8081

# Stop conflicting services or change ports in docker-compose.yml
```

### Container Issues
```bash
# Check container status
docker-compose ps

# Check container logs
docker-compose logs [service-name]

# Restart problematic container
docker-compose restart [service-name]

# Rebuild specific service
docker-compose up --build -d [service-name]
```

### Database Issues
```bash
# Reset database (WARNING: Deletes all data)
docker-compose down -v
docker-compose up -d

# Access MongoDB directly
docker-compose exec mongodb mongosh
```

### Memory Issues
If containers are running out of memory:
```bash
# Check resource usage
docker stats

# Increase Docker Desktop memory limit
# Docker Desktop > Settings > Resources > Memory
```

## Production Deployment

### Environment Variables
Create `.env` file for production:
```env
# Database
MONGO_INITDB_ROOT_USERNAME=your_admin_username
MONGO_INITDB_ROOT_PASSWORD=your_secure_password

# Backend
DEBUG=0
SECRET_KEY=your_secret_key

# Frontend
REACT_APP_API_URL=https://your-api-domain.com/api
```

### Security Considerations
1. Change default passwords
2. Use environment variables for secrets
3. Enable HTTPS in production
4. Configure proper CORS settings
5. Use production database settings

### Scaling
```bash
# Scale frontend instances
docker-compose up --scale frontend=3 -d

# Use load balancer for multiple frontend instances
```

## Monitoring

### Health Checks
```bash
# Check if services are responding
curl http://localhost:3000  # Frontend
curl http://localhost:8000/api/  # Backend API
curl http://localhost:8081  # Mongo Express
```

### Resource Monitoring
```bash
# Monitor resource usage
docker stats

# Monitor specific container
docker stats befisc_backend
```

## Backup and Restore

### Database Backup
```bash
# Create backup
docker-compose exec mongodb mongodump --out /backup

# Copy backup from container
docker cp befisc_mongodb:/backup ./mongodb_backup
```

### Database Restore
```bash
# Copy backup to container
docker cp ./mongodb_backup befisc_mongodb:/backup

# Restore database
docker-compose exec mongodb mongorestore /backup
```

## Cleanup

### Remove Everything
```bash
# Stop and remove containers, networks, volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Clean up unused resources
docker system prune -a
```

## Support

For issues and questions:
1. Check container logs: `docker-compose logs -f`
2. Verify all services are running: `docker-compose ps`
3. Check resource usage: `docker stats`
4. Review this documentation
5. Contact the development team

## Service URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/
- **Mongo Express**: http://localhost:8081
- **MongoDB**: localhost:27017
