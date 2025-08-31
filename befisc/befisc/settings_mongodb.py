# MongoDB Database Configuration for Docker
# This file contains the MongoDB database settings for the befisc project

DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'befisc_db',
        'ENFORCE_SCHEMA': True,
        'CLIENT': {
            'host': 'mongodb',  # Docker service name
            'port': 27017,
            'username': 'befisc_user',
            'password': 'befisc_password',
            'authSource': 'befisc_db',
            'authMechanism': 'SCRAM-SHA-1',
        }
    }
}

# Additional MongoDB-specific settings
MONGODB_SETTINGS = {
    'host': 'mongodb://befisc_user:befisc_password@mongodb:27017/befisc_db',
    'connect': False,
}

# Django settings for MongoDB
DJONGO_SETTINGS = {
    'ENFORCE_SCHEMA': True,
    'ENSURE_INDEX_CREATION': True,
}
