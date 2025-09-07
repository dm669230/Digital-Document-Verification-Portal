# Digital Document Verification Portal

A comprehensive full-stack application for secure document verification with user management, admin controls, and real-time status tracking.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React.js      │    │   Django REST   │    │   MongoDB       │
│   Frontend      │◄──►│   API Backend   │◄──►│   Database      │
│   (Port 3000)   │    │   (Port 8000)   │    │   (Port 27017)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  Mongo Express  │
                    │  (Port 8081)    │
                    └─────────────────┘
```

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Digital-Document-Verification-Portal
   ```

2. **Run the setup script**
   
   **Windows:**
   ```bash
   setup-docker.bat
   ```
   
   **Linux/macOS:**
   ```bash
   chmod +x setup-docker.sh
   ./setup-docker.sh
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin/
   - Database Admin: http://localhost:8081

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

#### MongoDB Setup
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Or install MongoDB locally
```

## 📁 Project Structure

```
Digital-Document-Verification-Portal/
├── backend/                 # Django REST API
│   ├── befisc/             # Django project settings
│   ├── core/               # Main app with models, views, serializers
│   ├── manage.py           # Django management script
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Backend Docker configuration
│   └── docker-compose.yml  # Backend services
├── frontend/               # React.js application
│   ├── src/                # Source code
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.js          # Main app component
│   ├── public/             # Static assets
│   ├── package.json        # Node.js dependencies
│   └── Dockerfile          # Frontend Docker configuration
├── docker-compose.yml      # Main Docker Compose configuration
├── docker-compose.dev.yml  # Development Docker Compose
├── setup-docker.bat        # Windows setup script
├── setup-docker.sh         # Linux/macOS setup script
└── README.md               # This file
```

## 🛠️ Technology Stack

### Backend
- **Django 3.2.24** - Web framework
- **Django REST Framework 3.14.0** - API framework
- **Djongo 1.3.6** - MongoDB connector
- **PyMongo 3.12.3** - MongoDB driver
- **JWT Authentication** - Secure token-based auth
- **MongoDB 7.0** - NoSQL database

### Frontend
- **React 18** - UI library
- **React Router 6** - Client-side routing
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Recharts** - Data visualization
- **React Dropzone** - File upload
- **React Toastify** - Notifications

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Mongo Express** - Database administration

## 🔧 Features

### User Features
- ✅ **User Registration & Authentication**
- ✅ **Document Upload** (PDF, DOC, DOCX, JPG, PNG, TXT)
- ✅ **Document Management** (View, Edit, Delete)
- ✅ **Real-time Status Tracking**
- ✅ **Profile Management**
- ✅ **Notification System**
- ✅ **Dashboard with Statistics**

### Admin Features
- ✅ **Admin Dashboard** with Analytics
- ✅ **Document Verification** (Approve/Reject)
- ✅ **Bulk Document Processing**
- ✅ **User Management**
- ✅ **Advanced Search & Filtering**
- ✅ **System Statistics**

### Technical Features
- ✅ **JWT Authentication** with auto-refresh
- ✅ **File Upload** with validation
- ✅ **Responsive Design** (Mobile-first)
- ✅ **Error Handling** & Validation
- ✅ **Loading States** & User Feedback
- ✅ **Docker Support** for easy deployment

## 🐳 Docker Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | React.js application |
| Backend | 8000 | Django REST API |
| MongoDB | 27017 | Database server |
| Mongo Express | 8081 | Database admin UI |

## 📊 API Endpoints

### Authentication
- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login
- `POST /api/users/logout/` - User logout
- `GET /api/users/profile/` - Get user profile
- `PATCH /api/users/profile/` - Update profile

### Documents
- `GET /api/documents/` - List documents
- `POST /api/documents/` - Upload document
- `GET /api/documents/{id}/` - Get document details
- `PATCH /api/documents/{id}/` - Update document
- `DELETE /api/documents/{id}/` - Delete document
- `POST /api/documents/{id}/verify/` - Verify document (Admin)

### Admin
- `GET /api/admins/dashboard/` - Admin dashboard
- `GET /api/admins/` - List admins
- `POST /api/documents/bulk_verify/` - Bulk verification

## 🔐 Security Features

- **JWT Authentication** with refresh tokens
- **Role-based Access Control** (User/Admin)
- **File Type Validation** and size limits
- **Input Sanitization** and validation
- **CORS Configuration** for cross-origin requests
- **Secure Password Hashing**

## 🚀 Deployment

### Production Deployment

1. **Environment Variables**
   ```bash
   # Backend
   DEBUG=0
   SECRET_KEY=your_secret_key
   
   # Database
   MONGO_INITDB_ROOT_USERNAME=admin
   MONGO_INITDB_ROOT_PASSWORD=secure_password
   
   # Frontend
   REACT_APP_API_URL=https://your-api-domain.com/api
   ```

2. **Docker Compose**
   ```bash
   docker-compose up --build -d
   ```

3. **SSL/HTTPS** (Recommended)
   - Use reverse proxy (Nginx)
   - Configure SSL certificates
   - Update CORS settings

### Development Deployment

```bash
# Use development compose file
docker-compose -f docker-compose.dev.yml up --build -d
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
python manage.py test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing
```bash
# Test registration
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"testpass","password_confirm":"testpass"}'

# Test login
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass"}'
```

## 📝 Configuration

### Backend Configuration
- Database settings in `backend/befisc/settings.py`
- API endpoints in `backend/core/urls.py`
- Models in `backend/core/models.py`

### Frontend Configuration
- API URL in `frontend/src/services/api.js`
- Environment variables in `.env` files
- Routing in `frontend/src/App.js`

## 🔧 Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check port usage
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :8000
   ```

2. **Docker Issues**
   ```bash
   # Check container status
   docker-compose ps
   
   # View logs
   docker-compose logs -f
   
   # Restart services
   docker-compose restart
   ```

3. **Database Connection**
   ```bash
   # Check MongoDB
   docker-compose exec mongodb mongosh
   
   # Reset database
   docker-compose down -v
   docker-compose up -d
   ```

### Logs and Debugging

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh
```

## 📚 Documentation

- [Backend API Documentation](backend/API_DOCUMENTATION.md)
- [Frontend Documentation](frontend/README.md)
- [Docker Setup Guide](DOCKER_SETUP.md)
- [Backend Setup Instructions](backend/SETUP_INSTRUCTIONS.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the troubleshooting section
- Open an issue on GitHub
- Contact the development team

## 🎯 Roadmap

### Upcoming Features
- [ ] Email notifications
- [ ] Document versioning
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] API rate limiting
- [ ] Document templates
- [ ] Audit logging
- [ ] Multi-language support

---

**Built with ❤️ using Django, React.js, and MongoDB**
