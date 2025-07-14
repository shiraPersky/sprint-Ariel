import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UploadData() {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const navigate = useNavigate();

  const handleUpload = () => {
    if (linkedinUrl || cvFile) {
    
      navigate('/member/data');
    } else {
      alert('Please provide either a LinkedIn URL or upload a CV file.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Upload Your Profile</h2>

      <div className="mb-3">
        <label htmlFor="linkedin" className="form-label">LinkedIn Profile URL</label>
        <input
          type="url"
          className="form-control"
          id="linkedin"
          placeholder="https://www.linkedin.com/in/your-profile"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="cv" className="form-label">Upload CV (PDF)</label>
        <input
          type="file"
          className="form-control"
          id="cv"
          accept=".pdf"
          onChange={(e) => setCvFile(e.target.files[0])}
        />
      </div>

      <button
        className="btn btn-primary"
        onClick={handleUpload}
        disabled={!linkedinUrl && !cvFile}
      >
        Upload
      </button>
    </div>
  );
}

export default UploadData;
