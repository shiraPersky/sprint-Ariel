import React from 'react';

const CvPreview = ({ selectedFile, previewURL }) => {//selectedFile - the actual file object the user selected,
//previewURL - a local browser URL that allows previewing the PDF
  if (!selectedFile) return null;

  return (
    <div className="mt-4">
      <p className="text-sm text-gray-700">Selected File: {selectedFile.name}</p>
      <div className="mt-2">
        <iframe
            src={previewURL}//Used to display documents like PDFs
            width="100%"
            height="500px"
            className="border rounded"
            title="CV Preview"
            />

      </div>
    </div>
  );
};

export default CvPreview;
