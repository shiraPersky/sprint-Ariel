// src/pages/cv/components/CvUploadBox.jsx

import React, { useRef } from "react";

const CvUploadBox = ({ handleFileChange, handleDrop, handleDragOver }) => {
  const fileInputRef = useRef(null);//trigger the file input when the user clicks the button

  const triggerFileSelect = () => {
    fileInputRef.current.click();//to open the file picker
  };

  return (
    <div
      className="border-dashed border-2 border-gray-300 p-6 rounded-xl bg-gray-50 text-center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        accept="application/pdf"//gets only pdf
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />

      <button
        onClick={triggerFileSelect}
        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
      >
        📎 Select File
      </button>

      <p className="text-sm text-gray-500 mt-2">PDF only. Max 10MB.</p>
    </div>
  );
};

export default CvUploadBox;
