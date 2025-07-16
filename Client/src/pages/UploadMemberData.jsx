import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDataApi from './UseDataApi'; 

function UploadData() {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [contributionEntries, setContributionEntries] = useState([
    { type: '', description: '' }
  ]);
  const [dragActive, setDragActive] = useState(false);

  const navigate = useNavigate();
  const [state, setRequest] = useDataApi(null);
  const { data, isLoading, isError } = state;

  const handleContributionChange = (index, field, value) => {
    const updated = [...contributionEntries];
    updated[index][field] = value;
    setContributionEntries(updated);
  };

  const addContributionEntry = () => {
    setContributionEntries([...contributionEntries, { type: '', description: '' }]);
  };

  // הסרתי את ה-useEffect הישנים כי הלוגיקה עכשיו ב-handleUpload

  const handleUpload = () => {
    // אם יש לינקדאין – שולחים בקשה לשרת
    console.log('Submitting LinkedIn URL:', linkedinUrl);
    if (linkedinUrl) {
      setSubmitClicked(true);
      setRequest({
        url: 'http://localhost:5000/excel/add-linkedin-member',
        method: 'POST',
        body: { linkedin_url: linkedinUrl },
        onSuccess: (data) => {
          console.log('LinkedIn import successful:', data);
          console.log('Navigating to member data page...',data.member);
          // אם הצליח וקיבלנו id מהשרת – נווט לעמוד עם id
          if (data && data.data.member.id_community_member) {
            navigate(`/member/${data.data.member.id_community_member}/data/`);
          }
        },
        onFailure: (error) => {
          // אם הייתה שגיאה - נווט לעמוד יצירת פרופיל חדש
          console.error('LinkedIn import failed:', error);
          navigate('/member/data');
          setSubmitClicked(false);
        }
      });
    } 
    // אם אין לינקדאין ויש קובץ קורות חיים – עוברים ישירות לעמוד
    else if (cvFile) {
      console
    .log('Uploading CV file:', cvFile.name);
      navigate('/member/data');
    } 
    // לא הזינו כלום
    else {
      alert('Please provide either a LinkedIn URL or upload a CV file.');
    }
  };

  const handleDirectNavigation = () => {
    navigate('/member/data');
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

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

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Upload Your Profile
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started by importing your LinkedIn profile or uploading your CV. We'll help you create an amazing profile.
          </p>
        </div>

        {/* Main Upload Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="p-8">
            {/* LinkedIn Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Import from LinkedIn</h3>
                  <p className="text-gray-600">Automatically fill your profile with LinkedIn data</p>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="url"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                  placeholder="https://www.linkedin.com/in/your-profile"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
              </div>
            </div>

            {/* CV Upload Section */}
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

              {/* Drag and Drop Area */}
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
                    <div className="space-y-2">
                      <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-lg font-semibold text-green-700">{cvFile.name}</p>
                      <p className="text-green-600">File uploaded successfully!</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-lg font-semibold text-gray-700">Drop your PDF here</p>
                      <p className="text-gray-500">or click to browse files</p>
                      <p className="text-sm text-gray-400">PDF files only, up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <div>
                    <p className="text-blue-800 font-semibold">Processing your LinkedIn profile...</p>
                    <p className="text-blue-600 text-sm">This may take a few moments while we import your data.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleUpload}
                disabled={isLoading || (!linkedinUrl && !cvFile)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Import Profile'
                )}
              </button>
              
              <button
                onClick={handleDirectNavigation}
                disabled={isLoading}
                className="flex-1 sm:flex-none bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Manually
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        {/* <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">LinkedIn Import</h4>
              <p className="text-sm text-gray-600">Copy your LinkedIn profile URL from your browser and paste it above.</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">CV Upload</h4>
              <p className="text-sm text-gray-600">Upload your resume in PDF format for automatic information extraction.</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Manual Entry</h4>
              <p className="text-sm text-gray-600">Prefer to enter your information manually? Click "Create Manually".</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default UploadData;