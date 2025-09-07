# Digital Document Verification Portal - Frontend

A modern React.js frontend for the Digital Document Verification Portal. This application provides a comprehensive interface for users to upload, manage, and track document verification status, as well as administrative tools for document review and user management.

## Features

### User Features
- **Authentication**: Secure login and registration with JWT tokens
- **Document Management**: Upload, view, and manage documents
- **Real-time Status Tracking**: Monitor document verification progress
- **Profile Management**: Update personal information and change passwords
- **Notifications**: Stay updated with verification status changes
- **Dashboard**: Overview of document statistics and recent activity

### Admin Features
- **Admin Dashboard**: Comprehensive analytics and system overview
- **Document Review**: Verify or reject submitted documents
- **User Management**: Manage user accounts and verification status
- **Bulk Operations**: Process multiple documents simultaneously
- **Advanced Filtering**: Search and filter documents by various criteria

## Technology Stack

- **React 18**: Modern React with hooks and functional components
- **React Router 6**: Client-side routing
- **Axios**: HTTP client for API communication
- **React Icons**: Comprehensive icon library
- **Recharts**: Data visualization for admin dashboard
- **React Dropzone**: File upload with drag-and-drop support
- **React Toastify**: Toast notifications
- **Date-fns**: Date manipulation and formatting

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend API running on `http://localhost:8000`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your API URL if different from `http://localhost:8000/api`

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm eject`: Eject from Create React App

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── FileUpload.js   # File upload with drag-and-drop
│   ├── LoadingSpinner.js # Loading indicator
│   └── Navbar.js       # Navigation component
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication context
├── pages/              # Page components
│   ├── Login.js        # User login
│   ├── Register.js     # User registration
│   ├── Dashboard.js    # User dashboard
│   ├── Documents.js    # Document management
│   ├── DocumentUpload.js # Document upload form
│   ├── DocumentDetail.js # Document details view
│   ├── Profile.js      # User profile management
│   ├── Notifications.js # Notifications center
│   ├── AdminDashboard.js # Admin dashboard
│   ├── AdminDocuments.js # Admin document management
│   └── AdminUsers.js   # Admin user management
├── services/           # API services
│   └── api.js         # API client configuration
├── App.js             # Main app component
├── index.js           # App entry point
└── index.css          # Global styles
```

## API Integration

The frontend communicates with the Django REST API backend through the following services:

- **Authentication API**: Login, registration, profile management
- **Documents API**: Upload, retrieve, update, delete documents
- **Admin API**: Administrative operations and analytics
- **Notifications API**: User notifications management

### Authentication Flow

1. User logs in with email/password
2. Backend returns JWT access and refresh tokens
3. Access token is stored in localStorage
4. Token is automatically included in API requests
5. Token refresh happens automatically when access token expires

## Key Features

### File Upload
- Drag-and-drop file upload interface
- Support for PDF, DOC, DOCX, JPG, PNG, TXT files
- File size validation (max 10MB)
- File type validation
- Upload progress indication

### Document Management
- List view with pagination and filtering
- Search functionality
- Status-based filtering
- Bulk operations for admins
- Real-time status updates

### Admin Dashboard
- Document statistics and analytics
- User management interface
- Bulk document verification
- Advanced filtering and search
- Data visualization with charts

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interface
- Optimized for all screen sizes

## Styling

The application uses custom CSS with a modern design system:

- **Color Palette**: Blue primary, semantic colors for status
- **Typography**: Inter font family
- **Spacing**: Consistent spacing scale
- **Components**: Reusable component styles
- **Responsive**: Mobile-first responsive design

## State Management

- **React Context**: Global authentication state
- **Local State**: Component-level state with hooks
- **API State**: Managed through custom hooks and services

## Error Handling

- **Form Validation**: Client-side validation with error messages
- **API Errors**: Centralized error handling with toast notifications
- **Network Errors**: Graceful handling of network issues
- **Loading States**: Loading indicators for better UX

## Security

- **JWT Tokens**: Secure authentication with automatic refresh
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Handled by Django backend

## Performance

- **Code Splitting**: Lazy loading of components
- **Optimized Images**: Proper image optimization
- **Efficient Rendering**: React best practices
- **Caching**: API response caching where appropriate

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the documentation
- Review the API documentation
- Contact the development team

## Deployment

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Environment Variables

Set the following environment variables for production:

- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_ENV`: Environment (production)

### Deployment Options

- **Static Hosting**: Deploy to Netlify, Vercel, or similar
- **CDN**: Use a CDN for better performance
- **Docker**: Containerize the application
- **Nginx**: Serve with Nginx for production

## Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Check if backend is running
   - Verify API URL in environment variables
   - Check CORS settings

2. **Authentication Issues**
   - Clear localStorage and try again
   - Check token expiration
   - Verify backend authentication setup

3. **File Upload Issues**
   - Check file size limits
   - Verify file type support
   - Check network connectivity

### Debug Mode

Enable debug mode by setting `REACT_APP_ENV=development` in your environment variables.
