import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { documentsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  FiFileText, 
  FiUpload, 
  FiCheckCircle, 
  FiClock, 
  FiXCircle,
  FiAlertTriangle,
  FiTrendingUp,
  FiUsers
} from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDocuments: 0,
    verifiedDocuments: 0,
    pendingDocuments: 0,
    rejectedDocuments: 0,
    expiringDocuments: 0
  });
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [expiringDocuments, setExpiringDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load document statistics
      const statsResponse = await documentsAPI.getDocumentStats();
      setStats(statsResponse.data);

      // Load recent documents
      const recentResponse = await documentsAPI.getMyDocuments({ page_size: 5 });
      setRecentDocuments(recentResponse.data.results || []);

      // Load expiring documents
      const expiringResponse = await documentsAPI.getExpiringDocuments();
      setExpiringDocuments(expiringResponse.data || []);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'VERIFIED':
        return <FiCheckCircle className="h-5 w-5 text-green-500" />;
      case 'PENDING':
        return <FiClock className="h-5 w-5 text-yellow-500" />;
      case 'REJECTED':
        return <FiXCircle className="h-5 w-5 text-red-500" />;
      case 'PROCESSING':
        return <FiAlertTriangle className="h-5 w-5 text-blue-500" />;
      default:
        return <FiFileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED':
        return 'text-green-600 bg-green-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'REJECTED':
        return 'text-red-600 bg-red-100';
      case 'PROCESSING':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.first_name || user?.username}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's an overview of your document verification status.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiFileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Documents</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalDocuments}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiCheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Verified</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.verifiedDocuments}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiClock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingDocuments}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiXCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Rejected</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.rejectedDocuments}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiAlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.expiringDocuments}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Documents */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h2 className="card-title">Recent Documents</h2>
              <Link
                to="/documents"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            {recentDocuments.length > 0 ? (
              recentDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(doc.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded {formatDate(doc.created_at)}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                    {doc.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No documents yet</p>
                <Link
                  to="/documents/upload"
                  className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                >
                  <FiUpload className="mr-1 h-4 w-4" />
                  Upload your first document
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Expiring Documents */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h2 className="card-title">Expiring Soon</h2>
              <span className="text-sm text-orange-600 font-medium">
                Next 30 days
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {expiringDocuments.length > 0 ? (
              expiringDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-3">
                    <FiAlertTriangle className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                      <p className="text-xs text-gray-500">
                        Expires {formatDate(doc.expiry_date)}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/documents/${doc.id}`}
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                  >
                    View
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FiCheckCircle className="mx-auto h-12 w-12 text-green-400" />
                <p className="mt-2 text-sm text-gray-500">No documents expiring soon</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/documents/upload"
            className="card hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <FiUpload className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-medium text-gray-900">Upload Document</h3>
                <p className="text-sm text-gray-500">Add a new document for verification</p>
              </div>
            </div>
          </Link>

          <Link
            to="/documents"
            className="card hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <FiFileText className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-medium text-gray-900">View Documents</h3>
                <p className="text-sm text-gray-500">Manage your uploaded documents</p>
              </div>
            </div>
          </Link>

          <Link
            to="/profile"
            className="card hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <FiUsers className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="font-medium text-gray-900">Update Profile</h3>
                <p className="text-sm text-gray-500">Manage your account information</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
