import React from 'react';

/**
 * DeleteModeBanner Component
 * Warning banner displayed when delete mode is active
 * @param {boolean} deleteMode - Whether delete mode is active
 */
function DeleteModeBanner({ deleteMode }) {
  if (!deleteMode) return null;

  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-700 text-sm">
        <strong>Delete Mode:</strong> Click on users to select them for removal from the group
      </p>
    </div>
  );
}

export default DeleteModeBanner;