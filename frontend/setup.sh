#!/bin/bash

echo "Setting up Digital Document Verification Portal Frontend..."
echo

echo "Installing dependencies..."
npm install

echo
echo "Creating environment file..."
cat > .env << EOF
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
EOF

echo
echo "Setup complete! You can now run:"
echo "  npm start"
echo
