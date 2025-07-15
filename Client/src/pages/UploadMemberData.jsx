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
const handleContributionChange = (index, field, value) => {
  const updated = [...contributionEntries];
  updated[index][field] = value;
  setContributionEntries(updated);
};

const addContributionEntry = () => {
  setContributionEntries([...contributionEntries, { type: '', description: '' }]);
};

  const navigate = useNavigate();
  const [state, setRequest] = useDataApi(null);
  const { data, isLoading, isError } = state;

  // אם הצליח וקיבלנו id מהשרת – נווט לעמוד עם id
  useEffect(() => {
    if (submitClicked && data && data.id_community_member) {
      navigate(`/member/${data.id_community_member}/data/`);
    }
  }, [data, submitClicked, navigate]);

  // אם הייתה שגיאה – הצג למשתמש והפעל מחדש את המצב
  useEffect(() => {
    if (submitClicked && isError) {
      alert('An error occurred while processing your LinkedIn URL.');
      setSubmitClicked(false);
    }
  }, [isError, submitClicked]);

  const handleUpload = () => {
    // אם יש לינקדאין – שולחים בקשה לשרת
    if (linkedinUrl) {
      setSubmitClicked(true);
      setRequest({
        url: '/member/linkedin',
        method: 'POST',
        body: { linkedin_url: linkedinUrl }
      });
    } 
    // אם אין לינקדאין ויש קובץ קורות חיים – עוברים ישירות לעמוד
    else if (cvFile) {
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
          disabled={isLoading}
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
          disabled={isLoading}
        />
      </div>

      {isLoading && (
        <div className="mb-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <button
        className="btn btn-primary me-2"
        onClick={handleUpload}
        disabled={isLoading || (!linkedinUrl && !cvFile)}
      >
        Upload
      </button>

      <button
        className="btn btn-secondary"
        onClick={handleDirectNavigation}
        disabled={isLoading}
      >
        Go to Data Page
      </button>
    </div>
  );
}

export default UploadData;
