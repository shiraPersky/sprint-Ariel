import { useState, useEffect } from 'react';

const useCvUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    if (selectedFile) {
      simulateUpload();
    }
  }, [selectedFile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setUploadProgress(0);
      setUploadSuccess(false);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setUploadProgress(0);
      setUploadSuccess(false);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const simulateUpload = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploadSuccess(true);
      }
    }, 150);
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewURL(null);
    setUploadProgress(0);
    setUploadSuccess(false);
  };

  return {
    selectedFile,
    previewURL,
    uploadProgress,
    uploadSuccess,
    handleFileChange,
    handleDrop,
    handleDragOver,
    simulateUpload,
    resetUpload,
  };
};

export default useCvUpload;
