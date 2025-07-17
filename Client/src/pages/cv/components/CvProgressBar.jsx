import React from 'react';

const CvProgressBar = ({ progress }) => {//progress is expected to be a number between 0 and 100
  return (
    <div className="h-2 bg-gray-200 rounded overflow-hidden">
      <div
        className="h-2 bg-green-500 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default CvProgressBar;
