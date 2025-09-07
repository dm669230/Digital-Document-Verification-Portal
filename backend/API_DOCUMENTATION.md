# Digital Document Verification Portal - API Documentation

## Overview
This document describes the REST API endpoints for the Digital Document Verification Portal. The API provides comprehensive functionality for user management, document upload and verification, and administrative operations.

## Base URL
```
http://localhost:8000/api/
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

## API Endpoints

### 1. User Management

#### User Registration
- **POST** `/users/register/`
- **Description**: Register a new user
- **Request Body**:
```json
{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "secure_password",
    "password_confirm": "secure_password",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+1234567890",
    "address": "123 Main St, City, State",
    "date_of_birth": "1990-01-01"
}
```
- **Response**: User data with JWT tokens

#### User Login
- **POST** `/users/login/`
- **Description**: Authenticate user and get tokens
- **Request Body**:
```json
{
    "email": "john@example.com",
    "password": "secure_password"
}
```
- **Response**: User data with JWT tokens

#### User Logout
- **POST** `/users/logout/`
- **Description**: Logout user and blacklist refresh token
- **Request Body**:
```json
{
    "refresh_token": "your_refresh_token"
}
```

#### Get/Update Profile
- **GET** `/users/profile/` - Get user profile
- **PUT/PATCH** `/users/profile/` - Update user profile
- **Headers**: Authorization required

#### Change Password
- **POST** `/users/change_password/`
- **Description**: Change user password
- **Request Body**:
```json
{
    "old_password": "current_password",
    "new_password": "new_secure_password",
    "new_password_confirm": "new_secure_password"
}
```

### 2. Document Management

#### Upload Document
- **POST** `/documents/`
- **Description**: Upload a new document
- **Request Body**: Form data with file
- **Headers**: Authorization required
- **Fields**:
  - `title`: Document title
  - `description`: Document description
  - `file`: Document file
  - `expiry_date`: Optional expiry date

#### Get Documents
- **GET** `/documents/` - Get all documents (admin) or user's documents
- **GET** `/documents/my_documents/` - Get current user's documents
- **Headers**: Authorization required

#### Get Single Document
- **GET** `/documents/{id}/`
- **Description**: Get document details by ID
- **Headers**: Authorization required

#### Update Document
- **PUT/PATCH** `/documents/{id}/`
- **Description**: Update document information
- **Headers**: Authorization required

#### Delete Document
- **DELETE** `/documents/{id}/`
- **Description**: Delete a document
- **Headers**: Authorization required

#### Search Documents
- **GET** `/documents/search/`
- **Description**: Search documents with filters
- **Query Parameters**:
  - `query`: Search text
  - `status`: Document status filter
  - `date_from`: Start date
  - `date_to`: End date
  - `user_id`: Filter by user ID

#### Document Verification (Admin Only)
- **POST** `/documents/{id}/verify/`
- **Description**: Verify/reject a document
- **Request Body**:
```json
{
    "status": "VERIFIED",
    "admin_comment": "Document verified successfully",
    "rejection_reason": null
}
```

#### Bulk Document Verification (Admin Only)
- **POST** `/documents/bulk_verify/`
- **Description**: Verify multiple documents at once
- **Request Body**:
```json
{
    "document_ids": ["uuid1", "uuid2", "uuid3"],
    "status": "VERIFIED",
    "admin_comment": "Bulk verification completed"
}
```

### 3. Verification Requests

#### Create Verification Request
- **POST** `/verification-requests/`
- **Description**: Create a new verification request
- **Request Body**:
```json
{
    "document_id": "document_uuid",
    "request_type": "INITIAL",
    "priority": "MEDIUM"
}
```

#### Get Verification Requests
- **GET** `/verification-requests/`
- **Description**: Get all verification requests (admin) or user's requests
- **Headers**: Authorization required

#### Process Verification Request (Admin Only)
- **POST** `/verification-requests/{id}/process/`
- **Description**: Update verification request status
- **Request Body**:
```json
{
    "status": "COMPLETED",
    "admin_notes": "Verification completed successfully"
}
```

### 4. Admin Operations

#### Admin Dashboard
- **GET** `/admins/dashboard/`
- **Description**: Get admin dashboard statistics
- **Headers**: Admin authorization required
- **Response**: Statistics and recent activities

#### Admin Management
- **GET** `/admins/` - List all admins
- **POST** `/admins/` - Create new admin
- **PUT/PATCH** `/admins/{id}/` - Update admin
- **DELETE** `/admins/{id}/` - Delete admin

### 5. Document Types

#### Get Document Types
- **GET** `/document-types/`
- **Description**: Get all active document types
- **Headers**: Authorization required

#### Manage Document Types (Admin Only)
- **POST** `/document-types/` - Create new document type
- **PUT/PATCH** `/document-types/{id}/` - Update document type
- **DELETE** `/document-types/{id}/` - Delete document type

### 6. Notifications

#### Get Notifications
- **GET** `/notifications/`
- **Description**: Get user's notifications
- **Headers**: Authorization required

#### Mark Notification as Read
- **POST** `/notifications/{id}/mark_read/`
- **Description**: Mark a notification as read

#### Mark All Notifications as Read
- **POST** `/notifications/mark_all_read/`
- **Description**: Mark all notifications as read

#### Get Unread Count
- **GET** `/notifications/unread_count/`
- **Description**: Get count of unread notifications

### 7. Additional Endpoints

#### Document Statistics
- **GET** `/document-stats/`
- **Description**: Get document statistics for current user
- **Headers**: Authorization required

#### Expiring Documents
- **GET** `/expiring-documents/`
- **Description**: Get documents expiring within 30 days
- **Headers**: Authorization required

### 8. JWT Token Management

#### Get Access Token
- **POST** `/token/`
- **Description**: Get JWT access and refresh tokens
- **Request Body**:
```json
{
    "username": "john@example.com",
    "password": "secure_password"
}
```

#### Refresh Token
- **POST** `/token/refresh/`
- **Description**: Get new access token using refresh token
- **Request Body**:
```json
{
    "refresh": "your_refresh_token"
}
```

#### Verify Token
- **POST** `/token/verify/`
- **Description**: Verify if a token is valid
- **Request Body**:
```json
{
    "token": "your_access_token"
}
```

## Response Formats

### Success Response
```json
{
    "message": "Operation successful",
    "data": {...}
}
```

### Error Response
```json
{
    "error": "Error description",
    "detail": "Detailed error information"
}
```

### Paginated Response
```json
{
    "count": 100,
    "next": "http://localhost:8000/api/documents/?page=3",
    "previous": "http://localhost:8000/api/documents/?page=1",
    "results": [...]
}
```

## Status Codes

- **200**: OK - Request successful
- **201**: Created - Resource created successfully
- **400**: Bad Request - Invalid request data
- **401**: Unauthorized - Authentication required
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource not found
- **500**: Internal Server Error - Server error

## File Upload

### Supported File Types
- PDF documents
- Image files (JPG, PNG, GIF)
- Word documents (DOC, DOCX)
- Text files (TXT)

### File Size Limits
- Maximum file size: 10MB
- Recommended file size: < 5MB

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **Document upload**: 10 requests per hour
- **General API**: 100 requests per minute

## Error Handling

The API returns detailed error messages with appropriate HTTP status codes. Common error scenarios:

1. **Validation Errors**: 400 status with field-specific error messages
2. **Authentication Errors**: 401 status for invalid/missing tokens
3. **Permission Errors**: 403 status for insufficient permissions
4. **Not Found Errors**: 404 status for missing resources

## Testing the API

### Using curl
```bash
# Register a user
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"testpass","password_confirm":"testpass"}'

# Login
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass"}'

# Upload document (with token)
curl -X POST http://localhost:8000/api/documents/ \
  -H "Authorization: Bearer <your_access_token>" \
  -F "title=Test Document" \
  -F "file=@/path/to/document.pdf"
```

### Using Postman
1. Import the API endpoints
2. Set base URL: `http://localhost:8000/api/`
3. Use the Authorization tab to set Bearer token
4. Test each endpoint with appropriate data

## Support

For API support and questions:
- Check the Django admin interface at `/admin/`
- Review server logs for detailed error information
- Contact the development team for technical support
