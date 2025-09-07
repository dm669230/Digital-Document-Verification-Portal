import React, { useState, useEffect } from 'react';
import { notificationsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  FiBell, 
  FiCheck, 
  FiCheckCircle, 
  FiClock, 
  FiAlertTriangle,
  FiInfo,
  FiX
} from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [markingAsRead, setMarkingAsRead] = useState(null);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationsAPI.getNotifications();
      setNotifications(response.data.results || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await notificationsAPI.getUnreadCount();
      setUnreadCount(response.data.unread_count || 0);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      setMarkingAsRead(notificationId);
      await notificationsAPI.markAsRead(notificationId);
      toast.success('Notification marked as read');
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast.error('Failed to mark notification as read');
    } finally {
      setMarkingAsRead(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      toast.success('All notifications marked as read');
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'VERIFICATION_SUCCESS':
        return <FiCheckCircle className="h-5 w-5 text-green-500" />;
      case 'VERIFICATION_REJECTED':
        return <FiX className="h-5 w-5 text-red-500" />;
      case 'DOCUMENT_UPLOADED':
        return <FiInfo className="h-5 w-5 text-blue-500" />;
      case 'DOCUMENT_EXPIRING':
        return <FiAlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <FiBell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'VERIFICATION_SUCCESS':
        return 'border-green-200 bg-green-50';
      case 'VERIFICATION_REJECTED':
        return 'border-red-200 bg-red-50';
      case 'DOCUMENT_UPLOADED':
        return 'border-blue-200 bg-blue-50';
      case 'DOCUMENT_EXPIRING':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading notifications..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FiBell className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="mt-2 text-gray-600">
                Stay updated with your document verification status
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="btn btn-outline"
            >
              <FiCheck className="mr-2 h-4 w-4" />
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* Unread Count */}
      {unreadCount > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <FiBell className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-800 font-medium">
              You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`card border-l-4 ${getNotificationColor(notification.type)} ${
                !notification.is_read ? 'ring-2 ring-blue-100' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-sm font-medium ${
                        !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </h3>
                      <p className={`mt-1 text-sm ${
                        !notification.is_read ? 'text-gray-800' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="text-xs text-gray-500">
                          {formatDate(notification.created_at)}
                        </span>
                        {!notification.is_read && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full text-blue-600 bg-blue-100">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                    {!notification.is_read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={markingAsRead === notification.id}
                        className="ml-4 p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50"
                        title="Mark as read"
                      >
                        {markingAsRead === notification.id ? (
                          <div className="spinner h-4 w-4"></div>
                        ) : (
                          <FiCheck className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <FiBell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              You're all caught up! We'll notify you when there's something new.
            </p>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {notifications.length > 0 && (
        <div className="mt-8 text-center">
          <button className="btn btn-outline">
            Load More Notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
