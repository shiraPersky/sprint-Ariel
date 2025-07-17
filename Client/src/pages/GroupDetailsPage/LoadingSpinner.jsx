import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * LoadingSpinner Component
 * Full page loading spinner for initial data load
 * @param {string} message - Loading message to display
 */
export function LoadingSpinner({ message = "Loading group details..." }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="text-lg text-gray-600">{message}</span>
      </div>
    </div>
  );
}

/**
 * GroupNotFound Component
 * Error state when group cannot be loaded
 * @param {Function} onBackToSearch - Handler for back to search action
 */
export function GroupNotFound({ onBackToSearch }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Group not found</h2>
        <button
          onClick={onBackToSearch}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Back to Search
        </button>
      </div>
    </div>
  );
}