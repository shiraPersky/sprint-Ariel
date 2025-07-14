import React from 'react';
import { Users, UserCheck } from 'lucide-react'; // ← הוסף את זה!

// קומפוננט Toggle למצבי חיפוש
const SearchModeToggle = ({ searchMode, setSearchMode }) => (
  <div className="flex justify-center mb-8">
    <div className="flex bg-gray-100 rounded-full p-2">
      <button
        onClick={() => setSearchMode('users')}
        className={`flex items-center px-6 py-3 rounded-full transition-all ${
          searchMode === 'users'
            ? 'bg-blue-500 text-white shadow-lg transform scale-105'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        <Users className="w-5 h-5 ml-2" />
        search users
      </button>
      <button
        onClick={() => setSearchMode('groups')}
        className={`flex items-center px-6 py-3 rounded-full transition-all ${
          searchMode === 'groups'
            ? 'bg-blue-500 text-white shadow-lg transform scale-105'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        <UserCheck className="w-5 h-5 ml-2" />
        חיפוש קבוצות
      </button>
    </div>
  </div>
);

export { SearchModeToggle };