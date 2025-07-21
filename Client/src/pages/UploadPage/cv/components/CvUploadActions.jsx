import React from 'react';

const CvUploadActions = ({ onCancel, onUpload }) => {
  return (
    <div className="flex justify-end mt-4 space-x-2">
      <button
        onClick={onCancel}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Cancel
      </button>
      <button
        onClick={onUpload}
        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
      >
        Upload
      </button>
    </div>
  );
};

export default CvUploadActions;
