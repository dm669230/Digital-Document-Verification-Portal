import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';

const FileUpload = ({ onFileSelect, accept, maxSize = 10 * 1024 * 1024, className = '' }) => {
  const [uploadError, setUploadError] = useState('');

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setUploadError('');
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setUploadError('File size must be less than 10MB');
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setUploadError('Invalid file type. Please upload PDF, DOC, DOCX, JPG, PNG, or TXT files');
      } else {
        setUploadError('File upload failed');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept || {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'text/plain': ['.txt']
    },
    maxSize,
    multiple: false
  });

  return (
    <div className={`file-upload-area ${isDragActive ? 'dragover' : ''} ${className}`} {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="text-center">
        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <p className="text-lg font-medium text-gray-900">
            {isDragActive ? 'Drop the file here' : 'Upload a document'}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Drag and drop a file here, or click to select
          </p>
          <p className="mt-1 text-xs text-gray-400">
            PDF, DOC, DOCX, JPG, PNG, TXT up to 10MB
          </p>
        </div>
      </div>
      {uploadError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{uploadError}</p>
        </div>
      )}
    </div>
  );
};

export const FilePreview = ({ file, onRemove }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('image')) return '🖼️';
    if (type.includes('text')) return '📄';
    return '📄';
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getFileIcon(file.type)}</span>
          <div>
            <p className="text-sm font-medium text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="p-1 text-gray-400 hover:text-red-500"
        >
          <FiX className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
