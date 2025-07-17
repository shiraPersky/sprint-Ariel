import React from 'react';

/**
 * ProfileHeader Component
 * Displays user profile picture, name, title and update button
 * @param {Object} formData - User form data
 * @param {Function} handleChange - Form field change handler
 * @param {boolean} showUpdateButton - Whether to show the update button
 * @param {Function} onUpdateClick - Handler for update button click
 */
function ProfileHeader({ formData, handleChange, showUpdateButton, onUpdateClick }) {
  /**
   * Generates user initials from full name
   * @param {string} fullName - User's full name
   * @returns {string} Initials (e.g., "John Doe" -> "JD")
   */
  const getInitials = (fullName) =>
    fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-grow">
          <div className="relative">
            {formData.profile_picture_url ? (
              <img
                src={formData.profile_picture_url}
                alt={formData.english_name}
                className="w-16 h-16 rounded-full object-cover shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {getInitials(formData.english_name) || "U"}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
          <div className="flex-grow space-y-2">
            <input
              type="text"
              name="english_name"
              className="w-full text-2xl font-bold text-gray-800 bg-transparent border-none outline-none focus:bg-gray-50 rounded-lg px-3 py-1 transition-colors"
              placeholder="Your Full Name"
              value={formData.english_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="title"
              className="w-full text-gray-600 bg-transparent border-none outline-none focus:bg-gray-50 rounded-lg px-3 py-1 transition-colors"
              placeholder="Your Title (e.g. Senior Developer)"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
        </div>
        
        {showUpdateButton && (
          <button 
            onClick={onUpdateClick}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Update Profile
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfileHeader;