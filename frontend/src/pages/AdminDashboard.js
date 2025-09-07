import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, documentsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  FiFileText, 
  FiUsers, 
  FiCheckCircle, 
  FiClock, 
  FiXCircle,
  FiAlertTriangle,
  FiTrendingUp,
  FiEye,
  FiShield
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load admin dashboard data
      const dashboardResponse = await adminAPI.getDashboard();
      setDashboardData(dashboardResponse.data);

      // Load recent documents for admin review
      const documentsResponse = await documentsAPI.getDocuments({ page_size: 10 });
      setRecentDocuments(documentsResponse.data.results || []);

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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Chart data
  const statusChartData = dashboardData ? [
    { name: 'Verified', value: dashboardData.verified_documents, color: '#10b981' },
    { name: 'Pending', value: dashboardData.pending_documents, color: '#f59e0b' },
    { name: 'Rejected', value: dashboardData.rejected_documents, color: '#ef4444' },
    { name: 'Processing', value: dashboardData.processing_documents, color: '#3b82f6' }
  ] : [];

  const monthlyData = dashboardData?.monthly_stats || [];

  if (loading) {
    return <LoadingSpinner text="Loading admin dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <FiShield className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Monitor and manage the document verification system
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiFileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Documents</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData?.total_documents || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiUsers className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData?.total_users || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiClock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Review</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData?.pending_documents || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiTrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData?.monthly_uploads || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Document Status Chart */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Document Status Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Uploads Chart */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Uploads</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="uploads" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="card-title">Recent Documents</h2>
            <Link
              to="/admin/documents"
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Document</th>
                <th>User</th>
                <th>Status</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentDocuments.length > 0 ? (
                recentDocuments.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div>
                        <p className="font-medium text-gray-900">{doc.title}</p>
                        <p className="text-sm text-gray-500">{doc.description}</p>
                      </div>
                    </td>
                    <td>
                      <p className="text-sm text-gray-900">
                        {doc.user?.first_name} {doc.user?.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{doc.user?.email}</p>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(doc.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </div>
                    </td>
                    <td className="text-sm text-gray-500">
                      {formatDate(doc.created_at)}
                    </td>
                    <td>
                      <Link
                        to={`/documents/${doc.id}`}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="View"
                      >
                        <FiEye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No documents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/documents"
            className="card hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <FiFileText className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-medium text-gray-900">Manage Documents</h3>
                <p className="text-sm text-gray-500">Review and verify documents</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/users"
            className="card hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <FiUsers className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-medium text-gray-900">Manage Users</h3>
                <p className="text-sm text-gray-500">View and manage user accounts</p>
              </div>
            </div>
          </Link>

          <div className="card hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3">
              <FiTrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="font-medium text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-500">View detailed analytics and reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
