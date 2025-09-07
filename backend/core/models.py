from mongoengine import Document, EmbeddedDocument, fields
from django.contrib.auth.models import AbstractUser
import uuid
from datetime import datetime

class User(Document):
    """Custom User model for the application"""
    id = fields.UUIDField(primary_key=True, default=uuid.uuid4)
    username = fields.StringField(required=True, unique=True)
    email = fields.EmailField(required=True, unique=True)
    password_hash = fields.StringField(required=True)
    first_name = fields.StringField(max_length=30, blank=True)
    last_name = fields.StringField(max_length=30, blank=True)
    phone_number = fields.StringField(max_length=15, blank=True)
    address = fields.StringField(blank=True)
    date_of_birth = fields.DateField(blank=True)
    is_verified = fields.BooleanField(default=False)
    is_active = fields.BooleanField(default=True)
    is_staff = fields.BooleanField(default=False)
    is_superuser = fields.BooleanField(default=False)
    created_at = fields.DateTimeField(default=datetime.utcnow)
    updated_at = fields.DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'users',
        'indexes': ['email', 'username']
    }
    
    def __str__(self):
        return self.email

class Document(Document):
    """Document model for storing uploaded documents"""
    id = fields.UUIDField(primary_key=True, default=uuid.uuid4)
    user = fields.ReferenceField(User, required=True)
    title = fields.StringField(max_length=255, required=True)
    description = fields.StringField(blank=True)
    file_path = fields.StringField(required=True)  # Store file path instead of FileField
    file_type = fields.StringField(max_length=50, blank=True)
    file_size = fields.LongField(blank=True)
    upload_time = fields.DateTimeField(default=datetime.utcnow)
    status = fields.StringField(
        max_length=20,
        choices=[
            ('PENDING', 'Pending'),
            ('UNDER_REVIEW', 'Under Review'),
            ('VERIFIED', 'Verified'),
            ('REJECTED', 'Rejected'),
            ('EXPIRED', 'Expired')
        ],
        default='PENDING'
    )
    verification_date = fields.DateTimeField(blank=True)
    admin_comment = fields.StringField(blank=True)
    rejection_reason = fields.StringField(blank=True)
    expiry_date = fields.DateField(blank=True)
    
    meta = {
        'collection': 'documents',
        'indexes': ['user', 'status', '-upload_time']
    }
    
    def __str__(self):
        return f"{self.title} - {self.user.email}"

class VerificationRequest(Document):
    """Model for tracking verification requests"""
    id = fields.UUIDField(primary_key=True, default=uuid.uuid4)
    user = fields.ReferenceField(User, required=True)
    document = fields.ReferenceField(Document, required=True)
    request_type = fields.StringField(
        max_length=50,
        choices=[
            ('INITIAL', 'Initial Verification'),
            ('RENEWAL', 'Renewal'),
            ('APPEAL', 'Appeal'),
            ('UPDATE', 'Update')
        ],
        default='INITIAL'
    )
    status = fields.StringField(
        max_length=20,
        choices=[
            ('PENDING', 'Pending'),
            ('IN_PROGRESS', 'In Progress'),
            ('COMPLETED', 'Completed'),
            ('CANCELLED', 'Cancelled')
        ],
        default='PENDING'
    )
    priority = fields.StringField(
        max_length=20,
        choices=[
            ('LOW', 'Low'),
            ('MEDIUM', 'Medium'),
            ('HIGH', 'High'),
            ('URGENT', 'Urgent')
        ],
        default='MEDIUM'
    )
    submitted_at = fields.DateTimeField(default=datetime.utcnow)
    processed_at = fields.DateTimeField(blank=True)
    admin_notes = fields.StringField(blank=True)
    
    meta = {
        'collection': 'verification_requests',
        'indexes': ['user', 'document', 'status', '-submitted_at']
    }
    
    def __str__(self):
        return f"Verification Request - {self.document.title}"

class Admin(Document):
    """Admin model for managing verifications"""
    id = fields.UUIDField(primary_key=True, default=uuid.uuid4)
    user = fields.ReferenceField(User, required=True, unique=True)
    department = fields.StringField(max_length=100, blank=True)
    role = fields.StringField(
        max_length=50,
        choices=[
            ('VERIFIER', 'Document Verifier'),
            ('SUPERVISOR', 'Supervisor'),
            ('ADMIN', 'Administrator')
        ],
        default='VERIFIER'
    )
    is_active = fields.BooleanField(default=True)
    created_at = fields.DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'admins',
        'indexes': ['user', 'role']
    }
    
    def __str__(self):
        return f"{self.user.email} - {self.role}"

class DocumentType(Document):
    """Model for different types of documents"""
    id = fields.UUIDField(primary_key=True, default=uuid.uuid4)
    name = fields.StringField(max_length=100, required=True, unique=True)
    description = fields.StringField(blank=True)
    required_fields = fields.ListField(fields.StringField(), default=list)
    verification_duration = fields.IntField(default=30)  # Verification duration in days
    is_active = fields.BooleanField(default=True)
    created_at = fields.DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'document_types',
        'indexes': ['name', 'is_active']
    }
    
    def __str__(self):
        return self.name

class Notification(Document):
    """Model for user notifications"""
    id = fields.UUIDField(primary_key=True, default=uuid.uuid4)
    user = fields.ReferenceField(User, required=True)
    title = fields.StringField(max_length=255, required=True)
    message = fields.StringField(required=True)
    notification_type = fields.StringField(
        max_length=50,
        choices=[
            ('VERIFICATION_UPDATE', 'Verification Update'),
            ('DOCUMENT_EXPIRY', 'Document Expiry'),
            ('SYSTEM', 'System Notification'),
            ('ADMIN', 'Admin Message')
        ],
        default='SYSTEM'
    )
    is_read = fields.BooleanField(default=False)
    created_at = fields.DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'notifications',
        'indexes': ['user', 'is_read', '-created_at']
    }
    
    def __str__(self):
        return f"{self.title} - {self.user.email}"
