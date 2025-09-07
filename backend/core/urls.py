from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from . import views

# Create router for ViewSets
router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'documents', views.DocumentViewSet, basename='document')
router.register(r'verification-requests', views.VerificationRequestViewSet, basename='verification-request')
router.register(r'admins', views.AdminViewSet, basename='admin')
router.register(r'document-types', views.DocumentTypeViewSet, basename='document-type')
router.register(r'notifications', views.NotificationViewSet, basename='notification')

# URL patterns
urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    
    # JWT Token endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Additional API endpoints
    path('document-stats/', views.DocumentStatsView.as_view(), name='document-stats'),
    path('expiring-documents/', views.ExpiringDocumentsView.as_view(), name='expiring-documents'),
    
    # User-specific endpoints (these are also available through the router)
    path('profile/', views.UserViewSet.as_view({'get': 'profile', 'put': 'profile', 'patch': 'profile'}), name='user-profile'),
    path('change-password/', views.UserViewSet.as_view({'post': 'change_password'}), name='change-password'),
    path('my-documents/', views.DocumentViewSet.as_view({'get': 'my_documents'}), name='my-documents'),
    path('document-search/', views.DocumentViewSet.as_view({'get': 'search'}), name='document-search'),
    
    # Admin-specific endpoints
    path('admin-dashboard/', views.AdminViewSet.as_view({'get': 'dashboard'}), name='admin-dashboard'),
    path('bulk-verify/', views.DocumentViewSet.as_view({'post': 'bulk_verify'}), name='bulk-verify'),
    
    # Notification endpoints
    path('mark-notification-read/<uuid:pk>/', views.NotificationViewSet.as_view({'post': 'mark_read'}), name='mark-notification-read'),
    path('mark-all-notifications-read/', views.NotificationViewSet.as_view({'post': 'mark_all_read'}), name='mark-all-notifications-read'),
    path('unread-notifications-count/', views.NotificationViewSet.as_view({'get': 'unread_count'}), name='unread-notifications-count'),
]

# API documentation and testing
# Note: rest_framework.urls is already included in main urls.py
