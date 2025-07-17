import React from 'react';

import { Search } from 'lucide-react';
const SearchField = ({ searchText, setSearchText, onSearch }) => (
  <div className="mb-6">
    <div className="relative">
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Free text search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSearch()}
        className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-lg"
      />
    </div>  
  </div>
);
export default SearchField;