import { useState, useEffect } from 'react';
//useState – to store and update values
//useEffect – to run code automatically when something changes

const useCvUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);//stores the file
  const [previewURL, setPreviewURL] = useState(null);//This stores a preview link
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);//Becomes true when the upload simulation reaches 100%

  useEffect(() => {
    if (selectedFile) {//If a file is selected, it automatically starts simulating the upload
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

  const handleDrop = (e) => {//Triggered when user drops a file onto a drop zone
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setUploadProgress(0);
      setUploadSuccess(false);
    }
  };

  const handleDragOver = (e) => e.preventDefault();//Needed to prevent browser from opening the file when it’s dragged over the page.

  const simulateUpload = () => {//This creates a fake upload animation by updating the progress every 150ms
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

  const resetUpload = () => {//Clears all state and resets the hook to its initial state
  //Used when user clicks x to remove the uploaded file
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
