from rest_framework import serializers
from .models import User, Document, VerificationRequest, Admin, DocumentType, Notification
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
import hashlib
from datetime import datetime

class UserSerializer(serializers.Serializer):
    """Serializer for User model"""
    id = serializers.UUIDField(read_only=True)
    username = serializers.CharField(max_length=150, required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(max_length=30, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=30, required=False, allow_blank=True)
    phone_number = serializers.CharField(max_length=15, required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    is_verified = serializers.BooleanField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        # Hash password
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone_number=validated_data.get('phone_number', ''),
            address=validated_data.get('address', ''),
            date_of_birth=validated_data.get('date_of_birth'),
            password_hash=password_hash,  # Store hashed password
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        user.save()
        return user

class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            # Hash the provided password
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            # Find user by email
            try:
                user = User.objects.get(email=email)
                if user.password_hash != password_hash:
                    raise serializers.ValidationError('Invalid credentials')
                if not user.is_active:
                    raise serializers.ValidationError('User account is disabled')
                attrs['user'] = user
            except User.DoesNotExist:
                raise serializers.ValidationError('Invalid credentials')
        else:
            raise serializers.ValidationError('Must include email and password')
        
        return attrs

class UserProfileSerializer(serializers.Serializer):
    """Serializer for user profile (read-only)"""
    id = serializers.UUIDField(read_only=True)
    username = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    phone_number = serializers.CharField(read_only=True)
    address = serializers.CharField(read_only=True)
    date_of_birth = serializers.DateField(read_only=True)
    is_verified = serializers.BooleanField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

class DocumentSerializer(serializers.ModelSerializer):
    """Serializer for Document model"""
    user = UserProfileSerializer(read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = [
            'id', 'user', 'title', 'description', 'file', 'file_url',
            'file_type', 'file_size', 'upload_time', 'status',
            'verification_date', 'admin_comment', 'rejection_reason',
            'expiry_date'
        ]
        read_only_fields = ['id', 'user', 'upload_time', 'verification_date']
    
    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
        return None
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class DocumentUploadSerializer(serializers.ModelSerializer):
    """Serializer for document upload"""
    class Meta:
        model = Document
        fields = ['title', 'description', 'file', 'expiry_date']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        # Set file metadata
        file_obj = validated_data['file']
        validated_data['file_type'] = file_obj.content_type
        validated_data['file_size'] = file_obj.size
        return super().create(validated_data)

class VerificationRequestSerializer(serializers.ModelSerializer):
    """Serializer for VerificationRequest model"""
    user = UserProfileSerializer(read_only=True)
    document = DocumentSerializer(read_only=True)
    document_id = serializers.UUIDField(write_only=True)
    
    class Meta:
        model = VerificationRequest
        fields = [
            'id', 'user', 'document', 'document_id', 'request_type',
            'status', 'priority', 'submitted_at', 'processed_at',
            'admin_notes'
        ]
        read_only_fields = ['id', 'user', 'submitted_at', 'processed_at']
    
    def create(self, validated_data):
        document_id = validated_data.pop('document_id')
        try:
            document = Document.objects.get(id=document_id, user=self.context['request'].user)
            validated_data['document'] = document
            validated_data['user'] = self.context['request'].user
            return super().create(validated_data)
        except Document.DoesNotExist:
            raise serializers.ValidationError("Document not found")

class AdminSerializer(serializers.ModelSerializer):
    """Serializer for Admin model"""
    user = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = Admin
        fields = ['id', 'user', 'department', 'role', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']

class DocumentTypeSerializer(serializers.ModelSerializer):
    """Serializer for DocumentType model"""
    class Meta:
        model = DocumentType
        fields = ['id', 'name', 'description', 'required_fields', 'verification_duration', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']

class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model"""
    user = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'user', 'title', 'message', 'notification_type', 'is_read', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

class DocumentVerificationSerializer(serializers.Serializer):
    """Serializer for document verification by admin"""
    status = serializers.ChoiceField(choices=Document._meta.get_field('status').choices)
    admin_comment = serializers.CharField(required=False, allow_blank=True)
    rejection_reason = serializers.CharField(required=False, allow_blank=True)
    verification_date = serializers.DateTimeField(required=False)

class BulkDocumentVerificationSerializer(serializers.Serializer):
    """Serializer for bulk document verification"""
    document_ids = serializers.ListField(
        child=serializers.UUIDField(),
        min_length=1
    )
    status = serializers.ChoiceField(choices=Document._meta.get_field('status').choices)
    admin_comment = serializers.CharField(required=False, allow_blank=True)

class DocumentSearchSerializer(serializers.Serializer):
    """Serializer for document search"""
    query = serializers.CharField(required=False, allow_blank=True)
    status = serializers.ChoiceField(choices=Document._meta.get_field('status').choices, required=False)
    date_from = serializers.DateField(required=False)
    date_to = serializers.DateField(required=False)
    user_id = serializers.UUIDField(required=False)

class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change"""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match")
        return attrs

class PasswordResetSerializer(serializers.Serializer):
    """Serializer for password reset request"""
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer for password reset confirmation"""
    token = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    new_password_confirm = serializers.CharField()
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
