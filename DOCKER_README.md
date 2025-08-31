# Docker Setup for Befisc Project

This project uses Docker to run MongoDB and Django together. The setup includes:

- **MongoDB 7.0** - Database server
- **Mongo Express** - Web-based MongoDB admin interface
- **Django** - Web application

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (usually comes with Docker Desktop)

## Quick Start

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Stop all services:**
   ```bash
   docker-compose down
   ```

## Services

### MongoDB
- **Port:** 27017
- **Username:** admin
- **Password:** password123
- **Database:** befisc_db
- **Application User:** befisc_user / befisc_password

### Mongo Express (Admin Interface)
- **URL:** http://localhost:8081
- **Username:** admin
- **Password:** password123

### Django Web Application
- **URL:** http://localhost:8000

## Database Connection

The Django application will connect to MongoDB using these settings:

```python
DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'befisc_db',
        'ENFORCE_SCHEMA': True,
        'CLIENT': {
            'host': 'mongodb',
            'port': 27017,
            'username': 'befisc_user',
            'password': 'befisc_password',
            'authSource': 'befisc_db',
        }
    }
}
```

## Useful Commands

### Start only MongoDB:
```bash
docker-compose up -d mongodb
```

### View MongoDB logs:
```bash
docker-compose logs mongodb
```

### Access MongoDB shell:
```bash
docker-compose exec mongodb mongosh -u admin -p password123
```

### Reset database:
```bash
docker-compose down -v
docker-compose up -d
```

### Update Django settings for MongoDB:
After starting MongoDB, update your `befisc/settings.py` to use the MongoDB configuration above.

## Troubleshooting

1. **Port already in use:** Make sure ports 27017, 8000, and 8081 are available
2. **Permission denied:** Run Docker commands with appropriate permissions
3. **Connection refused:** Wait for MongoDB to fully start before starting Django

## Development Workflow

1. Start MongoDB: `docker-compose up -d mongodb`
2. Update Django settings to use MongoDB
3. Run Django migrations: `python manage.py migrate`
4. Start Django: `docker-compose up -d web`
5. Access your application at http://localhost:8000
