import React from 'react';

/**
 * LoadingIndicator Component
 * Displays loading state while processing LinkedIn profile
 * @param {boolean} isLoading - Loading state
 */
function LoadingIndicator({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div className="bg-blue-50 rounded-xl p-6 mb-6">
      <div className="flex items-center space-x-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <div>
          <p className="text-blue-800 font-semibold">Processing your LinkedIn profile...</p>
          <p className="text-blue-600 text-sm">This may take a few moments while we import your data.</p>
        </div>
      </div>
    </div>
  );
}

export default LoadingIndicator;