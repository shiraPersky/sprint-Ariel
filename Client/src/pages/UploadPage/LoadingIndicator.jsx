import React from 'react';

/**
 * LoadingIndicator Component
 * Displays loading state while processing LinkedIn or CV upload
 * @param {boolean} isLoading - Loading state
 * @param {string|null} uploadMode - 'linkedin' or 'cv'
 */
function LoadingIndicator({ isLoading, uploadMode }) {
  if (!isLoading) return null;

  const sourceText = uploadMode === 'linkedin' ? 'LinkedIn profile' : 'CV';

  return (
    <div className="bg-blue-50 rounded-xl p-6 mb-6">
      <div className="flex items-center space-x-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <div>
          <p className="text-blue-800 font-semibold">Processing your {sourceText}...</p>
          <p className="text-blue-600 text-sm">
            This may take a few moments while we import your data.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoadingIndicator;
