import React from 'react';

/**
 * AboutTab Component
 * Renders about me textarea field
 * @param {Object} formData - User form data
 * @param {Function} handleChange - Form field change handler
 */
function AboutTab({ formData, handleChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">About Me</label>
      <textarea
        name="about"
        rows="8"
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
        placeholder="Tell us about yourself, your background, interests, and what you're passionate about..."
        value={formData.about}
        onChange={handleChange}
      />
    </div>
  );
}

export default AboutTab;