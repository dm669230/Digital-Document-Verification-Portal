import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  FiUsers, 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiEdit, 
  FiTrash2,
  FiShield,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [currentPage, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        page_size: 20,
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter && { is_verified: statusFilter === 'verified' })
      };

      const response = await adminAPI.getUsers(params);
      setUsers(response.data.results || []);
      setTotalPages(Math.ceil(response.data.count / 20));
      setTotalCount(response.data.count);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadUsers();
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleToggleVerification = async (userId, isVerified) => {
    try {
      await adminAPI.updateUser(userId, { is_verified: !isVerified });
      toast.success(`User ${!isVerified ? 'verified' : 'unverified'} successfully`);
      loadUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Failed to update user verification status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await adminAPI.deleteUser(userId);
      toast.success('User deleted successfully');
      loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVerificationStatus = (isVerified) => {
    return isVerified ? (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full text-green-600 bg-green-100">
        <FiCheckCircle className="mr-1 h-3 w-3" />
        Verified
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full text-yellow-600 bg-yellow-100">
        <FiXCircle className="mr-1 h-3 w-3" />
        Pending
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <FiShield className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="mt-2 text-gray-600">
              Manage user accounts and verification status
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="form-label">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="form-input pl-10"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="form-label">Verification Status</label>
              <select
                className="form-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Users</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending Verification</option>
              </select>
            </div>

            <div className="flex items-end">
              <button type="submit" className="btn btn-primary w-full">
                <FiFilter className="mr-2 h-4 w-4" />
                Filter
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div className="card">
        {loading ? (
          <LoadingSpinner text="Loading users..." />
        ) : users.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <FiUsers className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-sm text-gray-500">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <FiMail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{user.email}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <FiPhone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{user.phone_number || 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        {getVerificationStatus(user.is_verified)}
                      </td>
                      <td className="text-sm text-gray-500">
                        {formatDate(user.date_joined)}
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="p-1 text-gray-400 hover:text-blue-600"
                            title="View Details"
                          >
                            <FiEye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleVerification(user.id, user.is_verified)}
                            className={`p-1 hover:text-${user.is_verified ? 'yellow' : 'green'}-600`}
                            title={user.is_verified ? 'Unverify User' : 'Verify User'}
                          >
                            {user.is_verified ? (
                              <FiXCircle className="h-4 w-4" />
                            ) : (
                              <FiCheckCircle className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Delete User"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalCount)} of {totalCount} users
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="btn btn-outline"
                  >
                    Previous
                  </button>
                  <span className="flex items-center px-3 py-2 text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="btn btn-outline"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No users match your current filters.
            </p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal max-w-2xl">
            <div className="modal-header">
              <h3 className="modal-title">User Details</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="modal-close"
              >
                <FiXCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-gray-900">{selectedUser.first_name} {selectedUser.last_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Username</label>
                    <p className="text-gray-900">@{selectedUser.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{selectedUser.phone_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                    <p className="text-gray-900">
                      {selectedUser.date_of_birth ? formatDate(selectedUser.date_of_birth) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Verification Status</label>
                    <div className="mt-1">
                      {getVerificationStatus(selectedUser.is_verified)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Address</h4>
                <div className="flex items-start space-x-2">
                  <FiMapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <p className="text-gray-900">{selectedUser.address || 'No address provided'}</p>
                </div>
              </div>

              {/* Account Info */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Account Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Member Since</label>
                    <p className="text-gray-900">{formatDate(selectedUser.date_joined)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Login</label>
                    <p className="text-gray-900">
                      {selectedUser.last_login ? formatDate(selectedUser.last_login) : 'Never'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Is Staff</label>
                    <p className="text-gray-900">{selectedUser.is_staff ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Is Active</label>
                    <p className="text-gray-900">{selectedUser.is_active ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowUserModal(false)}
                className="btn btn-outline"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleToggleVerification(selectedUser.id, selectedUser.is_verified);
                  setShowUserModal(false);
                }}
                className={`btn ${selectedUser.is_verified ? 'btn-secondary' : 'btn-success'}`}
              >
                {selectedUser.is_verified ? 'Unverify User' : 'Verify User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
