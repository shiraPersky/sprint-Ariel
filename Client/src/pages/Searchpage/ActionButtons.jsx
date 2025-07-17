import React from 'react';
import { Search, Filter, Loader2, UserPlus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ActionButtons = ({ onClear, onSearch, loading, searchMode, onAddGroup }) => {
  const navigate = useNavigate();

  const handleAddMember = () => {
    console.log('🔍 Adding new member...');
    navigate('/');
  };

  const handleAddGroup = () => {
    console.log('👥 Adding new group...');
    if (onAddGroup) {
      onAddGroup(); 
    } else {
      navigate('/add-group'); 
    }
  };

  
  const getAddButtonConfig = () => {
    if (searchMode === 'users') {
      return {
        text: 'Add member',
        icon: UserPlus,
        onClick: handleAddMember,
        gradient: 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
      };
    } else {
      return {
        text: 'Add group',
        icon: Users,
        onClick: handleAddGroup,
        gradient: 'from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700'
      };
    }
  };

  const addButtonConfig = getAddButtonConfig();
  const IconComponent = addButtonConfig.icon;

  return (
    <div className="flex justify-center gap-4 mb-8">
      <button
        onClick={onClear}
        className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all transform hover:scale-105"
      >
        <Filter className="w-5 h-5 ml-2" />
        Clear
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
        {loading ? 'Search...' : 'Search'}
      </button>

      <button
        onClick={addButtonConfig.onClick}
        className={`flex items-center px-6 py-3 bg-gradient-to-r ${addButtonConfig.gradient} text-white rounded-xl shadow-lg transition-all transform hover:scale-105`}
      >
        <IconComponent className="w-5 h-5 ml-2" />
        {addButtonConfig.text}
      </button>
    </div>
  );
};

export default ActionButtons;