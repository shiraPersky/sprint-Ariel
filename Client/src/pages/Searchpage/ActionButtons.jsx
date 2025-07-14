// קומפוננט כפתורי פעולה
import React from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
const ActionButtons = ({ onClear, onSearch, loading }) => (
  <div className="flex justify-center gap-4 mb-8">
    <button
      onClick={onClear}
      className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all transform hover:scale-105"
    >
      <Filter className="w-5 h-5 ml-2" />
      נקה חיפוש
    </button>
    <button 
      onClick={onSearch}
      disabled={loading}
      className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
      ) : (
        <Search className="w-5 h-5 ml-2" />
      )}
      {loading ? 'מחפש...' : 'חפש'}
    </button>
  </div>
);
export default ActionButtons;