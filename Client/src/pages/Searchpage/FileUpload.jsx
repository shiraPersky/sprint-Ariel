import React from 'react';
import { Upload } from 'lucide-react';
const FileUpload = ({ onFileUpload }) => (
  <div className="bg-white rounded-3xl shadow-xl p-8">
    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
      העלאת קובץ אקסל
    </h2>
    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-500 transition-colors">
      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <p className="text-gray-600 mb-4">
        גרור קובץ אקסל לכאן או לחץ לבחירת קובץ
      </p>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={onFileUpload}
        className="hidden"
        id="excel-upload"
      />
      <label
        htmlFor="excel-upload"
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-xl cursor-pointer transition-all transform hover:scale-105"
      >
        <Upload className="w-5 h-5 ml-2" />
        בחר קובץ אקסל
      </label>
    </div>
  </div>
);
export default FileUpload;