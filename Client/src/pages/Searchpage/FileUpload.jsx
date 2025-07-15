import React, { useState } from 'react';
import { Upload, Send, File, X, Loader2 } from 'lucide-react';

const FileUpload = ({ onFileUpload, onSendToServer }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log('📁 File selected:', file.name);
      
      // קרא לפונקציה שמעבדת את הקובץ
      if (onFileUpload) {
        onFileUpload(file);
      }
    }
  };

  const handleSendToServer = async () => {
    if (!selectedFile) {
      alert('אנא בחר קובץ תחילה');
      return;
    }

    if (!onSendToServer) {
      alert('פונקציית שליחה לא זמינה');
      return;
    }

    try {
      setSending(true);
      console.log('📤 Sending file to server:', selectedFile.name);
      
      await onSendToServer(selectedFile);
      
      console.log('✅ File sent successfully');
      // אפשר להוסיף הודעת הצלחה כאן
      
    } catch (error) {
      console.error('❌ Error sending file:', error);
      alert('שגיאה בשליחת הקובץ לשרת');
    } finally {
      setSending(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    // אפס את ה-input
    const fileInput = document.getElementById('excel-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        העלאת קובץ אקסל
      </h2>
      
      {!selectedFile ? (
        // אזור בחירת קובץ
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-500 transition-colors">
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-4">
            גרור קובץ אקסל לכאן או לחץ לבחירת קובץ
          </p>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
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
      ) : (
        // הצגת הקובץ הנבחר וכפתורים
        <div className="space-y-6">
          {/* פרטי הקובץ */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <File className="w-8 h-8 text-green-600 ml-3" />
                <div>
                  <h3 className="font-bold text-gray-800">{selectedFile.name}</h3>
                  <p className="text-sm text-gray-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                disabled={sending}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* כפתורי פעולה */}
          <div className="flex gap-4">
            {/* כפתור שליחה לשרת */}
            <button
              onClick={handleSendToServer}
              disabled={sending || !onSendToServer}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {sending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin ml-2" />
                  שולח לשרת...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 ml-2" />
                  שלח לשרת
                </>
              )}
            </button>

            {/* כפתור בחירת קובץ אחר */}
            <label
              htmlFor="excel-upload"
              className="flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl cursor-pointer transition-all"
            >
              <Upload className="w-5 h-5 ml-2" />
              בחר קובץ אחר
            </label>
          </div>

          {/* הודעת מידע */}
          <div className="text-center text-sm text-gray-600">
            הקובץ מוכן לשליחה לשרת. לחץ על "שלח לשרת" כדי להעלות את הנתונים.
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;