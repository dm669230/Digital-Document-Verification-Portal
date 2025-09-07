from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Document, VerificationRequest, Admin, DocumentType, Notification
from django.utils import timezone

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """Admin configuration for custom User model"""
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_verified', 'is_staff', 'is_active', 'created_at')
    list_filter = ('is_verified', 'is_staff', 'is_active', 'created_at')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username', 'first_name', 'last_name', 'phone_number', 'address', 'date_of_birth')}),
        ('Permissions', {'fields': ('is_verified', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'created_at', 'updated_at')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'is_staff', 'is_active'),
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    """Admin configuration for Document model"""
    list_display = ('title', 'user', 'status', 'upload_time', 'verification_date', 'expiry_date')
    list_filter = ('status', 'upload_time', 'verification_date', 'expiry_date')
    search_fields = ('title', 'description', 'user__email', 'user__username')
    ordering = ('-upload_time',)
    readonly_fields = ('id', 'upload_time', 'file_type', 'file_size')
    
    fieldsets = (
        ('Basic Information', {'fields': ('id', 'user', 'title', 'description')}),
        ('File Details', {'fields': ('file', 'file_type', 'file_size', 'upload_time')}),
        ('Verification Status', {'fields': ('status', 'verification_date', 'admin_comment', 'rejection_reason')}),
        ('Expiry', {'fields': ('expiry_date',)}),
    )
    
    actions = ['mark_verified', 'mark_rejected', 'mark_expired']
    
    def mark_verified(self, request, queryset):
        updated = queryset.update(status='VERIFIED', verification_date=timezone.now())
        self.message_user(request, f'{updated} documents marked as verified.')
    mark_verified.short_description = "Mark selected documents as verified"
    
    def mark_rejected(self, request, queryset):
        updated = queryset.update(status='REJECTED')
        self.message_user(request, f'{updated} documents marked as rejected.')
    mark_rejected.short_description = "Mark selected documents as rejected"
    
    def mark_expired(self, request, queryset):
        updated = queryset.update(status='EXPIRED')
        self.message_user(request, f'{updated} documents marked as expired.')
    mark_expired.short_description = "Mark selected documents as expired"

@admin.register(VerificationRequest)
class VerificationRequestAdmin(admin.ModelAdmin):
    """Admin configuration for VerificationRequest model"""
    list_display = ('user', 'document', 'request_type', 'status', 'priority', 'submitted_at', 'processed_at')
    list_filter = ('request_type', 'status', 'priority', 'submitted_at', 'processed_at')
    search_fields = ('user__email', 'document__title', 'admin_notes')
    ordering = ('-submitted_at',)
    readonly_fields = ('id', 'submitted_at')
    
    fieldsets = (
        ('Request Information', {'fields': ('id', 'user', 'document', 'request_type', 'priority')}),
        ('Status', {'fields': ('status', 'submitted_at', 'processed_at', 'admin_notes')}),
    )
    
    actions = ['mark_in_progress', 'mark_completed', 'mark_cancelled']
    
    def mark_in_progress(self, request, queryset):
        updated = queryset.update(status='IN_PROGRESS')
        self.message_user(request, f'{updated} requests marked as in progress.')
    mark_in_progress.short_description = "Mark selected requests as in progress"
    
    def mark_completed(self, request, queryset):
        updated = queryset.update(status='COMPLETED', processed_at=timezone.now())
        self.message_user(request, f'{updated} requests marked as completed.')
    mark_completed.short_description = "Mark selected requests as completed"
    
    def mark_cancelled(self, request, queryset):
        updated = queryset.update(status='CANCELLED')
        self.message_user(request, f'{updated} requests marked as cancelled.')
    mark_cancelled.short_description = "Mark selected requests as cancelled"

@admin.register(Admin)
class AdminProfileAdmin(admin.ModelAdmin):
    """Admin configuration for Admin model"""
    list_display = ('user', 'department', 'role', 'is_active', 'created_at')
    list_filter = ('department', 'role', 'is_active', 'created_at')
    search_fields = ('user__email', 'user__username', 'department')
    ordering = ('-created_at',)
    readonly_fields = ('id', 'created_at')
    
    fieldsets = (
        ('Basic Information', {'fields': ('id', 'user')}),
        ('Role Details', {'fields': ('department', 'role', 'is_active')}),
        ('Timestamps', {'fields': ('created_at',)}),
    )

@admin.register(DocumentType)
class DocumentTypeAdmin(admin.ModelAdmin):
    """Admin configuration for DocumentType model"""
    list_display = ('name', 'description', 'verification_duration', 'is_active', 'created_at')
    list_filter = ('is_active', 'verification_duration', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('name',)
    readonly_fields = ('id', 'created_at')
    
    fieldsets = (
        ('Basic Information', {'fields': ('id', 'name', 'description')}),
        ('Configuration', {'fields': ('required_fields', 'verification_duration', 'is_active')}),
        ('Timestamps', {'fields': ('created_at',)}),
    )

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    """Admin configuration for Notification model"""
    list_display = ('user', 'title', 'notification_type', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = ('user__email', 'title', 'message')
    ordering = ('-created_at',)
    readonly_fields = ('id', 'created_at')
    
    fieldsets = (
        ('Basic Information', {'fields': ('id', 'user', 'title', 'message')}),
        ('Status', {'fields': ('notification_type', 'is_read')}),
        ('Timestamps', {'fields': ('created_at',)}),
    )
    
    actions = ['mark_as_read', 'mark_as_unread']
    
    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f'{updated} notifications marked as read.')
    mark_as_read.short_description = "Mark selected notifications as read"
    
    def mark_as_unread(self, request, queryset):
        updated = queryset.update(is_read=False)
        self.message_user(request, f'{updated} notifications marked as unread.')
    mark_as_unread.short_description = "Mark selected notifications as unread"

# Customize admin site
admin.site.site_header = "Digital Document Verification Portal"
admin.site.site_title = "Document Verification Admin"
admin.site.index_title = "Welcome to Document Verification Portal"
