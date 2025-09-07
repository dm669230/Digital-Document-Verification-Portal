from rest_framework import viewsets, status, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Q
from django.utils import timezone
from django.http import JsonResponse
from datetime import timedelta
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import (
    User, Document, VerificationRequest, Admin, DocumentType, Notification
)
from .serializers import (
    UserSerializer, UserLoginSerializer, UserProfileSerializer,
    DocumentSerializer, DocumentUploadSerializer, VerificationRequestSerializer,
    AdminSerializer, DocumentTypeSerializer, NotificationSerializer,
    DocumentVerificationSerializer, BulkDocumentVerificationSerializer,
    DocumentSearchSerializer, PasswordChangeSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for user management"""
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        return User.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserSerializer
        return UserProfileSerializer
    
    @swagger_auto_schema(
        operation_description="Register a new user account",
        operation_summary="User Registration",
        responses={
            201: openapi.Response(
                description="User registered successfully",
                examples={
                    "application/json": {
                        "message": "User registered successfully",
                        "user": {
                            "id": "123e4567-e89b-12d3-a456-426614174000",
                            "email": "user@example.com",
                            "username": "johndoe",
                            "first_name": "John",
                            "last_name": "Doe"
                        },
                        "tokens": {
                            "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
                            "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
                        }
                    }
                }
            ),
            400: openapi.Response(description="Bad request - validation errors")
        }
    )
    @action(detail=False, methods=['post'])
    def register(self, request):
        """User registration endpoint"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # For now, return a simple success response without JWT
            return Response({
                'message': 'User registered successfully',
                'user': UserProfileSerializer(user).data,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        """User login endpoint"""
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            # For now, return a simple success response without JWT
            return Response({
                'message': 'Login successful',
                'user': UserProfileSerializer(user).data,
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        """User logout endpoint"""
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get', 'put', 'patch'])
    def profile(self, request):
        """Get or update user profile"""
        if request.method == 'GET':
            serializer = UserProfileSerializer(request.user)
            return Response(serializer.data)
        elif request.method in ['PUT', 'PATCH']:
            serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """Change user password"""
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if user.check_password(serializer.validated_data['old_password']):
                user.set_password(serializer.validated_data['new_password'])
                user.save()
                return Response({'message': 'Password changed successfully'})
            else:
                return Response({'error': 'Invalid old password'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DocumentViewSet(viewsets.ModelViewSet):
    """ViewSet for document management"""
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Document.objects.all()
        return Document.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return DocumentUploadSerializer
        return DocumentSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_documents(self, request):
        """Get current user's documents"""
        documents = Document.objects.filter(user=request.user)
        serializer = self.get_serializer(documents, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search documents"""
        serializer = DocumentSearchSerializer(data=request.query_params)
        if serializer.is_valid():
            queryset = self.get_queryset()
            
            # Apply filters
            if serializer.validated_data.get('query'):
                query = serializer.validated_data['query']
                queryset = queryset.filter(
                    Q(title__icontains=query) |
                    Q(description__icontains=query) |
                    Q(user__email__icontains=query)
                )
            
            if serializer.validated_data.get('status'):
                queryset = queryset.filter(status=serializer.validated_data['status'])
            
            if serializer.validated_data.get('date_from'):
                queryset = queryset.filter(upload_time__gte=serializer.validated_data['date_from'])
            
            if serializer.validated_data.get('date_to'):
                queryset = queryset.filter(upload_time__lte=serializer.validated_data['date_to'])
            
            if serializer.validated_data.get('user_id'):
                queryset = queryset.filter(user_id=serializer.validated_data['user_id'])
            
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Verify a document (admin only)"""
        if not request.user.is_staff:
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        
        document = self.get_object()
        serializer = DocumentVerificationSerializer(data=request.data)
        
        if serializer.is_valid():
            document.status = serializer.validated_data['status']
            document.admin_comment = serializer.validated_data.get('admin_comment', '')
            document.rejection_reason = serializer.validated_data.get('rejection_reason', '')
            
            if serializer.validated_data['status'] == 'VERIFIED':
                document.verification_date = timezone.now()
            
            document.save()
            
            # Create notification
            Notification.objects.create(
                user=document.user,
                title=f"Document {document.title} {serializer.validated_data['status'].lower()}",
                message=f"Your document '{document.title}' has been {serializer.validated_data['status'].lower()}.",
                notification_type='VERIFICATION_UPDATE'
            )
            
            return Response({'message': 'Document status updated successfully'})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def bulk_verify(self, request):
        """Bulk verify documents (admin only)"""
        if not request.user.is_staff:
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = BulkDocumentVerificationSerializer(data=request.data)
        if serializer.is_valid():
            document_ids = serializer.validated_data['document_ids']
            status = serializer.validated_data['status']
            admin_comment = serializer.validated_data.get('admin_comment', '')
            
            documents = Document.objects.filter(id__in=document_ids)
            updated_count = 0
            
            for document in documents:
                document.status = status
                document.admin_comment = admin_comment
                if status == 'VERIFIED':
                    document.verification_date = timezone.now()
                document.save()
                
                # Create notification
                Notification.objects.create(
                    user=document.user,
                    title=f"Document {document.title} {status.lower()}",
                    message=f"Your document '{document.title}' has been {status.lower()}.",
                    notification_type='VERIFICATION_UPDATE'
                )
                
                updated_count += 1
            
            return Response({
                'message': f'{updated_count} documents updated successfully'
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerificationRequestViewSet(viewsets.ModelViewSet):
    """ViewSet for verification requests"""
    serializer_class = VerificationRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return VerificationRequest.objects.all()
        return VerificationRequest.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def process(self, request, pk=None):
        """Process a verification request (admin only)"""
        if not request.user.is_staff:
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        
        verification_request = self.get_object()
        status = request.data.get('status')
        admin_notes = request.data.get('admin_notes', '')
        
        if status in ['IN_PROGRESS', 'COMPLETED', 'CANCELLED']:
            verification_request.status = status
            verification_request.admin_notes = admin_notes
            if status == 'COMPLETED':
                verification_request.processed_at = timezone.now()
            verification_request.save()
            
            # Create notification
            Notification.objects.create(
                user=verification_request.user,
                title=f"Verification Request {status.lower()}",
                message=f"Your verification request for '{verification_request.document.title}' has been {status.lower()}.",
                notification_type='VERIFICATION_UPDATE'
            )
            
            return Response({'message': 'Verification request updated successfully'})
        
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

class AdminViewSet(viewsets.ModelViewSet):
    """ViewSet for admin management"""
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get admin dashboard statistics"""
        total_documents = Document.objects.count()
        pending_documents = Document.objects.filter(status='PENDING').count()
        verified_documents = Document.objects.filter(status='VERIFIED').count()
        rejected_documents = Document.objects.filter(status='REJECTED').count()
        
        total_users = User.objects.count()
        verified_users = User.objects.filter(is_verified=True).count()
        
        total_requests = VerificationRequest.objects.count()
        pending_requests = VerificationRequest.objects.filter(status='PENDING').count()
        
        # Recent activities
        recent_documents = Document.objects.order_by('-upload_time')[:10]
        recent_requests = VerificationRequest.objects.order_by('-submitted_at')[:10]
        
        return Response({
            'statistics': {
                'total_documents': total_documents,
                'pending_documents': pending_documents,
                'verified_documents': verified_documents,
                'rejected_documents': rejected_documents,
                'total_users': total_users,
                'verified_users': verified_users,
                'total_requests': total_requests,
                'pending_requests': pending_requests,
            },
            'recent_documents': DocumentSerializer(recent_documents, many=True).data,
            'recent_requests': VerificationRequestSerializer(recent_requests, many=True).data,
        })

class DocumentTypeViewSet(viewsets.ModelViewSet):
    """ViewSet for document types"""
    queryset = DocumentType.objects.filter(is_active=True)
    serializer_class = DocumentTypeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for notifications"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'message': 'Notification marked as read'})
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'message': 'All notifications marked as read'})
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications"""
        count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({'unread_count': count})

# Additional API endpoints
class DocumentStatsView(generics.GenericAPIView):
    """Get document statistics for current user"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        total_documents = Document.objects.filter(user=user).count()
        pending_documents = Document.objects.filter(user=user, status='PENDING').count()
        verified_documents = Document.objects.filter(user=user, status='VERIFIED').count()
        rejected_documents = Document.objects.filter(user=user, status='REJECTED').count()
        
        return Response({
            'total_documents': total_documents,
            'pending_documents': pending_documents,
            'verified_documents': verified_documents,
            'rejected_documents': rejected_documents,
        })

class ExpiringDocumentsView(generics.ListAPIView):
    """Get documents expiring soon"""
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        thirty_days_from_now = timezone.now().date() + timedelta(days=30)
        return Document.objects.filter(
            user=user,
            expiry_date__lte=thirty_days_from_now,
            expiry_date__gte=timezone.now().date(),
            status='VERIFIED'
        ).order_by('expiry_date')

# Root view for the homepage
def home_view(request):
    """Simple home view that provides API information"""
    return JsonResponse({
        'message': 'Digital Document Verification Portal API',
        'version': '1.0.0',
        'endpoints': {
            'admin': '/admin/',
            'api': '/api/',
            'authentication': '/api/token/',
            'documentation': '/api/'
        },
        'documentation': {
            'swagger_ui': '/swagger/',
            'redoc': '/redoc/',
            'openapi_json': '/swagger.json',
            'openapi_yaml': '/swagger.yaml'
        },
        'status': 'running'
    })
