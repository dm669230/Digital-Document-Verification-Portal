// MongoDB initialization script for befisc project
db = db.getSiblingDB('befisc_db');

// Create a user for the application
db.createUser({
  user: 'befisc_user',
  pwd: 'befisc_password',
  roles: [
    {
      role: 'readWrite',
      db: 'befisc_db'
    }
  ]
});

// Create some initial collections if needed
db.createCollection('users');
db.createCollection('documents');
db.createCollection('verifications');

print('MongoDB initialized successfully for befisc project');
