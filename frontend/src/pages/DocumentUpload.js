import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentsAPI } from '../services/api';
import { toast } from 'react-toastify';
import FileUpload, { FilePreview } from '../components/FileUpload';
import { FiCalendar, FiFileText, FiX } from 'react-icons/fi';

const DocumentUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    expiry_date: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    // Clear file error
    if (errors.file) {
      setErrors(prev => ({
        ...prev,
        file: ''
      }));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!selectedFile) {
      newErrors.file = 'Please select a file to upload';
    }

    if (formData.expiry_date) {
      const expiryDate = new Date(formData.expiry_date);
      const today = new Date();
      if (expiryDate <= today) {
        newErrors.expiry_date = 'Expiry date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('file', selectedFile);
      if (formData.expiry_date) {
        uploadData.append('expiry_date', formData.expiry_date);
      }

      await documentsAPI.uploadDocument(uploadData);
      toast.success('Document uploaded successfully!');
      navigate('/documents');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error.response?.data?.error || 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload Document</h1>
        <p className="mt-2 text-gray-600">
          Upload a document for verification. Supported formats: PDF, DOC, DOCX, JPG, PNG, TXT
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Select File</h2>
          {!selectedFile ? (
            <FileUpload
              onFileSelect={handleFileSelect}
              accept={{
                'application/pdf': ['.pdf'],
                'application/msword': ['.doc'],
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                'image/jpeg': ['.jpg', '.jpeg'],
                'image/png': ['.png'],
                'text/plain': ['.txt']
              }}
              maxSize={10 * 1024 * 1024} // 10MB
            />
          ) : (
            <FilePreview file={selectedFile} onRemove={handleRemoveFile} />
          )}
          {errors.file && <p className="form-error mt-2">{errors.file}</p>}
        </div>

        {/* Document Details */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Document Details</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="form-label">
                Document Title *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiFileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className={`form-input pl-10 ${errors.title ? 'error' : ''}`}
                  placeholder="Enter document title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              {errors.title && <p className="form-error">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="form-input"
                placeholder="Enter document description (optional)"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="expiry_date" className="form-label">
                Expiry Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="expiry_date"
                  name="expiry_date"
                  type="date"
                  className={`form-input pl-10 ${errors.expiry_date ? 'error' : ''}`}
                  value={formData.expiry_date}
                  onChange={handleChange}
                />
              </div>
              {errors.expiry_date && <p className="form-error">{errors.expiry_date}</p>}
              <p className="mt-1 text-xs text-gray-500">
                Optional: Set an expiry date for this document
              </p>
            </div>
          </div>
        </div>

        {/* Upload Guidelines */}
        <div className="card bg-blue-50 border border-blue-200">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Upload Guidelines</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Maximum file size: 10MB</li>
            <li>• Supported formats: PDF, DOC, DOCX, JPG, PNG, TXT</li>
            <li>• Ensure documents are clear and readable</li>
            <li>• Remove any password protection from PDFs</li>
            <li>• Documents will be verified by our admin team</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/documents')}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !selectedFile}
            className="btn btn-primary"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="spinner mr-2"></div>
                Uploading...
              </div>
            ) : (
              'Upload Document'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentUpload;
