import React from 'react';

/**
 * Divider Component
 * Displays an "OR" divider between sections
 */
function Divider() {
  return (
    <div className="relative mb-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
      </div>
    </div>
  );
}

export default Divider;