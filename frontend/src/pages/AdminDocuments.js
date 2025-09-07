import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { documentsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  FiFileText, 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertTriangle,
  FiShield
} from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  useEffect(() => {
    loadDocuments();
  }, [currentPage, statusFilter, userFilter, dateFilter]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        page_size: 20,
        ...(searchQuery && { query: searchQuery }),
        ...(statusFilter && { status: statusFilter }),
        ...(userFilter && { user_id: userFilter }),
        ...(dateFilter && { date_from: dateFilter })
      };

      const response = await documentsAPI.getDocuments(params);
      setDocuments(response.data.results || []);
      setTotalPages(Math.ceil(response.data.count / 20));
      setTotalCount(response.data.count);
    } catch (error) {
      console.error('Failed to load documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadDocuments();
  };

  const handleVerifyDocument = async (documentId, status, comment = '') => {
    try {
      await documentsAPI.verifyDocument(documentId, {
        status,
        admin_comment: comment,
        rejection_reason: status === 'REJECTED' ? comment : null
      });
      toast.success(`Document ${status.toLowerCase()} successfully`);
      loadDocuments();
    } catch (error) {
      console.error('Failed to verify document:', error);
      toast.error('Failed to verify document');
    }
  };

  const handleBulkAction = async () => {
    if (selectedDocuments.length === 0) {
      toast.error('Please select documents to perform bulk action');
      return;
    }

    if (!bulkAction) {
      toast.error('Please select a bulk action');
      return;
    }

    try {
      await documentsAPI.bulkVerifyDocuments({
        document_ids: selectedDocuments,
        status: bulkAction,
        admin_comment: `Bulk ${bulkAction.toLowerCase()} action`
      });
      toast.success(`Bulk ${bulkAction.toLowerCase()} completed successfully`);
      setSelectedDocuments([]);
      setBulkAction('');
      loadDocuments();
    } catch (error) {
      console.error('Failed to perform bulk action:', error);
      toast.error('Failed to perform bulk action');
    }
  };

  const handleSelectDocument = (documentId) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId) 
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(documents.map(doc => doc.id));
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('word') || fileType?.includes('document')) return '📝';
    if (fileType?.includes('image')) return '🖼️';
    if (fileType?.includes('text')) return '📄';
    return '📄';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <FiShield className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
            <p className="mt-2 text-gray-600">
              Review and verify documents submitted by users
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="form-label">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="form-input pl-10"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="VERIFIED">Verified</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div>
              <label className="form-label">User Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="Filter by user email"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Date From</label>
              <input
                type="date"
                className="form-input"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
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

      {/* Bulk Actions */}
      {selectedDocuments.length > 0 && (
        <div className="card mb-6 bg-blue-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedDocuments.length} document(s) selected
              </span>
              <select
                className="form-input"
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
              >
                <option value="">Select bulk action</option>
                <option value="VERIFIED">Verify All</option>
                <option value="REJECTED">Reject All</option>
                <option value="PROCESSING">Mark as Processing</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleBulkAction}
                className="btn btn-primary"
                disabled={!bulkAction}
              >
                Apply Action
              </button>
              <button
                onClick={() => setSelectedDocuments([])}
                className="btn btn-outline"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Documents Table */}
      <div className="card">
        {loading ? (
          <LoadingSpinner text="Loading documents..." />
        ) : documents.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedDocuments.length === documents.length && documents.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th>Document</th>
                    <th>User</th>
                    <th>Status</th>
                    <th>File Size</th>
                    <th>Uploaded</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedDocuments.includes(doc.id)}
                          onChange={() => handleSelectDocument(doc.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td>
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getFileIcon(doc.file_type)}</span>
                          <div>
                            <p className="font-medium text-gray-900">{doc.title}</p>
                            <p className="text-sm text-gray-500">{doc.description}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {doc.user?.first_name} {doc.user?.last_name}
                          </p>
                          <p className="text-xs text-gray-500">{doc.user?.email}</p>
                        </div>
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
                        {formatFileSize(doc.file_size)}
                      </td>
                      <td className="text-sm text-gray-500">
                        {formatDate(doc.created_at)}
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/documents/${doc.id}`}
                            className="p-1 text-gray-400 hover:text-blue-600"
                            title="View"
                          >
                            <FiEye className="h-4 w-4" />
                          </Link>
                          {doc.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleVerifyDocument(doc.id, 'VERIFIED', 'Document verified')}
                                className="p-1 text-gray-400 hover:text-green-600"
                                title="Verify"
                              >
                                <FiCheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleVerifyDocument(doc.id, 'REJECTED', 'Document rejected')}
                                className="p-1 text-gray-400 hover:text-red-600"
                                title="Reject"
                              >
                                <FiXCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
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
                  Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalCount)} of {totalCount} documents
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
            <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No documents match your current filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDocuments;
