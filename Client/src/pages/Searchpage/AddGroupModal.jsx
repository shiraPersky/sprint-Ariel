import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddGroupModal = ({ isOpen, onClose, onAddGroup }) => {
  const [groupName, setGroupName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (groupName.trim()) {
      // פשוט שולח את הנתונים ל-UserSearchComponent
      onAddGroup({
        name: groupName.trim()
      });
      
      // נקה את הטופס וסגור את ה-modal
      setGroupName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">הוספת קבוצה חדשה</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שם הקבוצה *
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="הכנס שם קבוצה..."
              required
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white rounded-xl transition-all"
            >
              הוסף קבוצה
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGroupModal;