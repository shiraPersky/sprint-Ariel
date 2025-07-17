import React, { useState } from 'react';

/**
 * CVUploadSection Component
 * Handles CV file upload with drag and drop functionality
 * @param {File|null} cvFile - Currently selected CV file
 * @param {Function} setCvFile - Function to update CV file
 * @param {boolean} isLoading - Loading state
 */
function CVUploadSection({ cvFile, setCvFile, isLoading }) {
  const [dragActive, setDragActive] = useState(false);

  /**
   * Handle drag events for file upload
   * @param {DragEvent} e - Drag event
   */
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  /**
   * Handle file drop
   * @param {DragEvent} e - Drop event
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setCvFile(file);
      } else {
        alert('Please upload a PDF file only.');
      }
    }
  };

  /**
   * Handle file input change
   * @param {Event} e - Input change event
   */
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Upload CV/Resume</h3>
          <p className="text-gray-600">Upload your PDF resume and we'll extract the information</p>
        </div>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : cvFile 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".pdf"
          onChange={handleFileInput}
          disabled={isLoading}
        />
        
        <div className="text-center">
          {cvFile ? (
            <FileUploadedState fileName={cvFile.name} />
          ) : (
            <FileUploadPlaceholder />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * FileUploadedState Component
 * Shows uploaded file information
 * @param {string} fileName - Name of uploaded file
 */
function FileUploadedState({ fileName }) {
  return (
    <div className="space-y-2">
      <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-lg font-semibold text-green-700">{fileName}</p>
      <p className="text-green-600">File uploaded successfully!</p>
    </div>
  );
}

/**
 * FileUploadPlaceholder Component
 * Shows upload placeholder UI
 */
function FileUploadPlaceholder() {
  return (
    <div className="space-y-2">
      <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <p className="text-lg font-semibold text-gray-700">Drop your PDF here</p>
      <p className="text-gray-500">or click to browse files</p>
      <p className="text-sm text-gray-400">PDF files only, up to 10MB</p>
    </div>
  );
}

export default CVUploadSection;