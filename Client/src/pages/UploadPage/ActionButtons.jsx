import React from 'react';

/**
 * ActionButtons Component
 * Handles main action buttons for import and manual creation
 * @param {Function} onUpload - Handler for upload/import action
 * @param {Function} onManualCreate - Handler for manual creation
 * @param {boolean} isLoading - Loading state
 * @param {boolean} hasInput - Whether user has provided LinkedIn URL or CV file
 */
function ActionButtons({ onUpload, onManualCreate, isLoading, hasInput }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        onClick={onUpload}
        disabled={isLoading || !hasInput}
        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          'Import Profile'
        )}
      </button>
      
      <button
        onClick={onManualCreate}
        disabled={isLoading}
        className="flex-1 sm:flex-none bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Create Manually
      </button>
    </div>
  );
}

/**
 * LoadingSpinner Component
 * Displays loading spinner with text
 */
function LoadingSpinner() {
  return (
    <span className="flex items-center justify-center">
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Processing...
    </span>
  );
}

export default ActionButtons;