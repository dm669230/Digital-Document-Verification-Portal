import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { documentsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  FiArrowLeft, 
  FiDownload, 
  FiEdit, 
  FiTrash2, 
  FiCalendar, 
  FiUser, 
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiAlertTriangle
} from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';

const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadDocument();
  }, [id]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      const response = await documentsAPI.getDocument(id);
      setDocument(response.data);
    } catch (error) {
      console.error('Failed to load document:', error);
      toast.error('Failed to load document');
      navigate('/documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await documentsAPI.deleteDocument(id);
      toast.success('Document deleted successfully');
      navigate('/documents');
    } catch (error) {
      console.error('Failed to delete document:', error);
      toast.error('Failed to delete document');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDownload = () => {
    if (document?.file_url) {
      window.open(document.file_url, '_blank');
    } else {
      toast.error('Download link not available');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'VERIFIED':
        return <FiCheckCircle className="h-6 w-6 text-green-500" />;
      case 'PENDING':
        return <FiClock className="h-6 w-6 text-yellow-500" />;
      case 'REJECTED':
        return <FiXCircle className="h-6 w-6 text-red-500" />;
      case 'PROCESSING':
        return <FiAlertTriangle className="h-6 w-6 text-blue-500" />;
      default:
        return <FiFileText className="h-6 w-6 text-gray-500" />;
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
      month: 'long',
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

  if (loading) {
    return <LoadingSpinner text="Loading document..." />;
  }

  if (!document) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Document not found</h1>
          <p className="mt-2 text-gray-600">The document you're looking for doesn't exist.</p>
          <Link to="/documents" className="btn btn-primary mt-4">
            Back to Documents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link
            to="/documents"
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{document.title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {getStatusIcon(document.status)}
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(document.status)}`}>
              {document.status}
            </span>
          </div>
          <span className="text-2xl">{getFileIcon(document.file_type)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Document Info */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Document Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="mt-1 text-gray-900">
                  {document.description || 'No description provided'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">File Type</label>
                  <p className="mt-1 text-gray-900">{document.file_type || 'Unknown'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">File Size</label>
                  <p className="mt-1 text-gray-900">{formatFileSize(document.file_size)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Uploaded</label>
                  <p className="mt-1 text-gray-900">{formatDate(document.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="mt-1 text-gray-900">{formatDate(document.updated_at)}</p>
                </div>
              </div>

              {document.expiry_date && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Expiry Date</label>
                  <p className="mt-1 text-gray-900">{formatDate(document.expiry_date)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Verification Details */}
          {(document.status === 'VERIFIED' || document.status === 'REJECTED') && (
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Verification Details</h2>
              <div className="space-y-4">
                {document.verification_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Verified On</label>
                    <p className="mt-1 text-gray-900">{formatDate(document.verification_date)}</p>
                  </div>
                )}
                
                {document.admin_comment && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Admin Comment</label>
                    <p className="mt-1 text-gray-900">{document.admin_comment}</p>
                  </div>
                )}

                {document.rejection_reason && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rejection Reason</label>
                    <p className="mt-1 text-red-600">{document.rejection_reason}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
            <div className="flex space-x-4">
              <button
                onClick={handleDownload}
                className="btn btn-outline"
              >
                <FiDownload className="mr-2 h-4 w-4" />
                Download
              </button>
              <button
                onClick={() => navigate(`/documents/${id}/edit`)}
                className="btn btn-outline"
              >
                <FiEdit className="mr-2 h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="btn btn-danger"
              >
                <FiTrash2 className="mr-2 h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {getStatusIcon(document.status)}
              </div>
              <p className="text-sm font-medium text-gray-900">{document.status}</p>
              <p className="text-xs text-gray-500 mt-1">
                {document.status === 'PENDING' && 'Waiting for admin review'}
                {document.status === 'PROCESSING' && 'Currently being reviewed'}
                {document.status === 'VERIFIED' && 'Document has been verified'}
                {document.status === 'REJECTED' && 'Document was rejected'}
              </p>
            </div>
          </div>

          {/* File Info */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">File Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Type</span>
                <span className="text-sm font-medium text-gray-900">
                  {document.file_type || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Size</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatFileSize(document.file_size)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Uploaded</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(document.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Delete Document</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="modal-close"
              >
                <FiXCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to delete this document? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-outline"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-danger"
                disabled={deleting}
              >
                {deleting ? (
                  <div className="flex items-center">
                    <div className="spinner mr-2"></div>
                    Deleting...
                  </div>
                ) : (
                  'Delete Document'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentDetail;
