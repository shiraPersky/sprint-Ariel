import React, { useState } from 'react';


const UserProfileForm = () => {
  const [formData, setFormData] = useState({
    hebrewName: '',
    englishName: '',
    email: '',
    phone: '',
    linkedin: '',
    facebook: '',
    location: '',
    about: '',
    skills: '',
    contribution: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // TODO: send to backend
  };

  return (
    <div className="container" dir="rtl">
      <h1 className="text-center mb-4">Edit Profile</h1>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Profile Image */}
          <div className="col-12 col-md-4 text-center">
            <img
              src={
                formData.image
                  ? URL.createObjectURL(formData.image)
                  : 'images/profile-placeholder.png'
              }
              alt="Profile"
              className="profile-img mb-2"
              style={{
                width: '100%',
                maxWidth: '200px',
                height: 'auto',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <input
              type="file"
              className="form-control"
              accept="image/*"
              name="image"
              onChange={handleChange}
            />
          </div>

          {/* Text Fields */}
          <div className="col-12 col-md-8">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Name (Hebrew)</label>
                <input
                  type="text"
                  className="form-control"
                  name="hebrewName"
                  value={formData.hebrewName}
                  onChange={handleChange}
                  placeholder="Yael Cohen"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Name (English)</label>
                <input
                  type="text"
                  className="form-control"
                  name="englishName"
                  value={formData.englishName}
                  onChange={handleChange}
                  placeholder="Yael Cohen"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="yael@example.com"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="052-1234567"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">LinkedIn</label>
                <input
                  type="url"
                  className="form-control"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                 // placeholder="https://linkedin.com/in/yael"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Facebook</label>
                <input
                  type="url"
                  className="form-control"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/yael"
                />
              </div>
              <div className="col-12">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Tel Aviv, Israel"
                />
              </div>
            </div>
          </div>

          {/* About */}
          <div className="col-12">
            <label className="form-label">About</label>
            <textarea
              className="form-control"
              rows="3"
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Skills */}
          <div className="col-12">
            <label className="form-label">Skills</label>
            <input
              type="text"
              className="form-control"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Writing, Graphic Design, Digital Marketing"
            />
            <div className="form-text">Separate multiple skills with commas.</div>
          </div>

          {/* Community Contribution */}
          <div className="col-12">
            <label className="form-label">Community Contribution</label>
            <textarea
              className="form-control"
              rows="3"
              name="contribution"
              value={formData.contribution}
              onChange={handleChange}
              placeholder="I can help with mentoring, translating, organizing events..."
            />
          </div>

          {/* Submit Button */}
          <div className="col-12 text-center">
            <button type="submit" className="btn btn-success btn-lg mt-3">
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;
