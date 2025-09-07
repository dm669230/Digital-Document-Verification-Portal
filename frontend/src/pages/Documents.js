import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { documentsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  FiFileText, 
  FiUpload, 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiEdit, 
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiAlertTriangle,
  FiPlus
} from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadDocuments();
  }, [currentPage, statusFilter, dateFilter]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        page_size: 10,
        ...(searchQuery && { query: searchQuery }),
        ...(statusFilter && { status: statusFilter }),
        ...(dateFilter && { date_from: dateFilter })
      };

      const response = await documentsAPI.getMyDocuments(params);
      setDocuments(response.data.results || []);
      setTotalPages(Math.ceil(response.data.count / 10));
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

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await documentsAPI.deleteDocument(documentId);
      toast.success('Document deleted successfully');
      loadDocuments();
    } catch (error) {
      console.error('Failed to delete document:', error);
      toast.error('Failed to delete document');
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
            <p className="mt-2 text-gray-600">
              Manage and track your document verification status
            </p>
          </div>
          <Link
            to="/documents/upload"
            className="btn btn-primary"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Upload Document
          </Link>
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
                    <th>Document</th>
                    <th>Status</th>
                    <th>File Size</th>
                    <th>Uploaded</th>
                    <th>Expires</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id}>
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
                      <td className="text-sm text-gray-500">
                        {doc.expiry_date ? formatDate(doc.expiry_date) : 'N/A'}
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
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Delete"
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
                  Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalCount)} of {totalCount} documents
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by uploading your first document.
            </p>
            <div className="mt-6">
              <Link
                to="/documents/upload"
                className="btn btn-primary"
              >
                <FiUpload className="mr-2 h-4 w-4" />
                Upload Document
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;
