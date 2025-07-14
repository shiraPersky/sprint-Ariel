// AdminViewUserProfile.js
import React, { useEffect } from 'react';
import useDataApi from "./UseDataApi";
import 'bootstrap/dist/css/bootstrap.min.css';

const getInitials = (first, last) => `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();

const AdminViewUserProfile = ({ userId }) => {
  const [{ data: user, isLoading, isError }, setUrl] = useDataApi('', {});

  const mockUser = {
    firstName: 'Dana',
    lastName: 'Ben David',
    email: 'dana.ben.david@example.com',
    phone: '052-4567890',
    linkedin: 'https://linkedin.com/in/danabendavid',
    facebook: 'https://facebook.com/dana.ben.david',
    about: 'Community leader and experienced project manager in the tech industry.',
    skills: 'Leadership, Communication, Project Management',
    contribution: 'Organizes tech events and mentors students.',
    experience: [],
  };

  useEffect(() => {
    if (userId) {
      setUrl(`/api/users/${userId}`);
    }
  }, [userId, setUrl]);

  const displayUser = userId ? user : mockUser;

  if (userId && isLoading) return <div className="alert alert-danger">Error loading user data.</div>;// <LoadingSpinner />;
  if (userId && isError) return <div className="alert alert-danger">Error loading user data.</div>;
  if (!displayUser || !displayUser.firstName) return null;

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <div
          className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-3"
          style={{ width: 60, height: 60, fontSize: 24 }}
        >
            kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
          {getInitials(displayUser.firstName, displayUser.lastName)}
        </div>
        <h3 className="mb-0">
          {displayUser.firstName} {displayUser.lastName}
        </h3>
      </div>

      {/* Contact Info */}
      <div className="mb-4">
        <h5>Contact Information</h5>
        <p><strong>Email:</strong> {displayUser.email}</p>
        <p><strong>Phone:</strong> {displayUser.phone}</p>
        <p><strong>LinkedIn:</strong> <a href={displayUser.linkedin}>{displayUser.linkedin}</a></p>
        <p><strong>Facebook:</strong> <a href={displayUser.facebook}>{displayUser.facebook}</a></p>
      </div>

      {/* About */}
      <div className="mb-4">
        <h5>About</h5>
        <p>{displayUser.about}</p>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <h5>Skills</h5>
        <p>{displayUser.skills}</p>
      </div>

      {/* Contribution */}
      <div className="mb-4">
        <h5>Community Contribution</h5>
        <p>{displayUser.contribution}</p>
      </div>

      {/* Experience */}
      <div>
        <h5>Experience</h5>
        {displayUser.experience?.length === 0 ? (
          <p>No experience provided.</p>
        ) : (
          displayUser.experience?.map((exp, index) => (
            <div key={index} className="border rounded p-3 mb-3">
              <div className="d-flex align-items-center mb-2">
                <div
                  className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center me-2"
                  style={{ width: 40, height: 40 }}
                >
                  {getInitials(exp.firstName, exp.lastName)}
                </div>
                <h6 className="mb-0">{exp.company}</h6>
              </div>
              <p className="mb-1"><strong>Dates:</strong> {exp.dates}</p>
              <p className="mb-0"><strong>Description:</strong> {exp.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminViewUserProfile;
