import React, { useState} from 'react';//allows to store data in your component
import useCvUpload from './hooks/useCvUpload';
import CvUploadBox from './components/CvUploadBox';
import CvProgressBar from './components/CvProgressBar';

const CvMainUploadComponent = () => {
  const {
    selectedFile, // The file the user uploaded
    previewURL, // A link to show the PDF before upload
    uploadProgress, // A number from 0–100
    uploadSuccess, // If upload finished
    handleFileChange, // Called when user selects a file
    handleDrop, // Called when user drags a file into the box
    handleDragOver, 
    resetUpload,//resets everything if user removes the file
  } = useCvUpload();

  const [loading, setLoading] = useState(false); //when waiting for the backend to respond
  const [error, setError] = useState(null);

  //This function sends the file to the backend server
  const handleExtract = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();//This prepares the file to send in a request
      formData.append('cv', selectedFile);

      const res = await fetch('http://localhost:5000/upload-cv', {//Sends the file to the backend server 
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Failed to extract data');
      }

    } catch (err) {
      console.error('Upload error:', err);
      setError('Something went wrong during upload');
    } finally {//Whether success or error, stop the loading animation
      setLoading(false);
    }
  };

  const showProgress = selectedFile && !uploadSuccess && uploadProgress < 100;//true if file is selected, not finished uploading, and progress < 100.
  const showPreview = selectedFile && uploadSuccess;//true if upload finished and file is ready to preview

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {uploadSuccess ? 'Your CV' : 'Upload Your CV'}
      </h2>

      {!uploadSuccess && (
        <div className="border rounded-xl shadow-md p-4 bg-white">
          <CvUploadBox
            handleFileChange={handleFileChange}
            handleDrop={handleDrop}
            handleDragOver={handleDragOver}
          />
        </div>
      )}

      {showProgress && (
        <div className="mt-4">
          <CvProgressBar progress={uploadProgress} />
        </div>
      )}

      {showPreview && (
        <div className="flex flex-col items-center gap-3 mt-4">
          <embed
            src={previewURL}
            type="application/pdf"
            width="100"
            height="130"
            className="border rounded shadow"
          />

          <div className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-2 w-full max-w-xs shadow">
            <p className="text-sm truncate mr-2">{selectedFile.name}</p>
            <button
              onClick={resetUpload}
              className="text-pink-600 text-lg hover:text-pink-800"
              title="Remove file"
            >
              ❌
            </button>
          </div>

          <button
            onClick={handleExtract}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white font-medium px-6 py-2 rounded-full hover:bg-blue-700 transition duration-200 shadow-md"
          >
            {loading ? '🔄 Analyzing...' : '📄 Extract My Data from the CV'}
          </button>

          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CvMainUploadComponent;
