import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function EditableUserProfile() {
  const [activeTab, setActiveTab] = useState('contact');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    linkedin: '',
    facebook: '',
    about: '',
    skills: '',
    contribution: '',
    experience: [],
  });

  const [originalData, setOriginalData] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [isFinalStep, setIsFinalStep] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Load mock data
    const mockData = {
      firstName: 'Yael',
      lastName: 'Cohen',
      phone: '052-1234567',
      email: 'user@example.com',
      linkedin: 'https://linkedin.com/in/user',
      facebook: 'https://facebook.com/user',
      about: 'Lorem ipsum dolor sit amet.',
      skills: 'React, Design',
      contribution: '',
      experience: [],
    };
    setFormData(mockData);
    setOriginalData(mockData);
  }, []);

  useEffect(() => {
    setIsDirty(JSON.stringify(formData) !== JSON.stringify(originalData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...formData.experience];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, experience: updated }));
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [...prev.experience, { company: '', dates: '', description: '', firstName: '', lastName: '' }],
    }));
  };

  const getInitials = (first, last) =>
    `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();

  const handleUpdateClick = () => {
    setIsFinalStep(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Final Submitted Data:', formData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="container mt-5 text-center">
        <h4>Thank you! Your profile has been submitted.</h4>
      </div>
    );
  }

  return (
    <div className="container mt-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <div
            className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-3"
            style={{ width: 60, height: 60, fontSize: 24 }}
          >
            {getInitials(formData.firstName, formData.lastName)}
          </div>
          <h5 className="m-0">
            {formData.firstName || formData.lastName
              ? `${formData.firstName} ${formData.lastName}`
              : 'Unnamed User'}
          </h5>
        </div>

        {!isFinalStep && (
  <button className="btn btn-success" onClick={handleUpdateClick}>
    Update
  </button>
)}

      </div>

      <form onSubmit={handleSubmit}>
        {!isFinalStep ? (
          <>
            {/* Tabs */}
            <ul className="nav nav-pills nav-justified mb-3">
              {['contact', 'about', 'experience', 'skills'].map((tab) => (
                <li className="nav-item" key={tab}>
                  <button
                    className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(tab);
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                </li>
              ))}
            </ul>

            <div className="tab-content">
              {activeTab === 'contact' && (
                <div className="tab-pane active">
                  <div className="mb-3">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-control"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label>LinkedIn</label>
                    <input
                      type="url"
                      name="linkedin"
                      className="form-control"
                      value={formData.linkedin}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Facebook</label>
                    <input
                      type="url"
                      name="facebook"
                      className="form-control"
                      value={formData.facebook}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div className="tab-pane active">
                  <div className="mb-3">
                    <label>About</label>
                    <textarea
                      name="about"
                      rows="4"
                      className="form-control"
                      value={formData.about}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="tab-pane active">
                  {formData.experience.map((exp, index) => (
                    <div key={index} className="border rounded p-3 mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <div
                          className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center me-2"
                          style={{ width: 40, height: 40 }}
                        >
                          {getInitials(exp.firstName, exp.lastName)}
                        </div>
                        <input
                          type="text"
                          placeholder="Company"
                          className="form-control"
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Dates"
                        className="form-control mb-2"
                        value={exp.dates}
                        onChange={(e) => handleExperienceChange(index, 'dates', e.target.value)}
                      />
                      <textarea
                        placeholder="Description"
                        className="form-control"
                        rows="2"
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                      />
                      <div className="mt-2 d-flex">
                        <input
                          type="text"
                          placeholder="First Name"
                          className="form-control me-1"
                          value={exp.firstName}
                          onChange={(e) => handleExperienceChange(index, 'firstName', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Last Name"
                          className="form-control"
                          value={exp.lastName}
                          onChange={(e) => handleExperienceChange(index, 'lastName', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline-primary w-100" onClick={addExperience}>
                    Add Experience
                  </button>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="tab-pane active">
                  <div className="mb-3">
                    <label>Skills</label>
                    <input
                      type="text"
                      name="skills"
                      className="form-control"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="e.g. Writing, Design, Marketing"
                    />
                    <div className="form-text">Separate multiple skills with commas.</div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="mb-3">
              <label><strong>Community Contribution (Required)</strong></label>
              <textarea
                name="contribution"
                className="form-control"
                rows="4"
                required
                value={formData.contribution}
                onChange={handleChange}
                placeholder="e.g. Mentoring, Translating, Organizing events"
              />
            </div>
            {formData.contribution.trim() !== '' && (
              <div className="text-center">
                <button type="submit" className="btn btn-primary px-4">Submit</button>
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
}
