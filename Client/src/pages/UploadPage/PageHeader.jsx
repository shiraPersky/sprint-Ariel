import React from 'react';

/**
 * PageHeader Component
 * Displays the main page title and description
 */
function PageHeader() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
        Upload Your Profile
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Get started by importing your LinkedIn profile or uploading your CV. We'll help you create an amazing profile.
      </p>
    </div>
  );
}

export default PageHeader;