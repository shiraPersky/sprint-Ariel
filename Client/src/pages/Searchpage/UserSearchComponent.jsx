// הקומפוננט הראשי - מעודכן עם טעינת נתונים ראשונית
import React, { useState, useEffect } from 'react';
import { Search, Users, UserCheck, Upload, Filter, MapPin, Briefcase, GraduationCap, Calendar, Building, Award, ChevronDown, Loader2 } from 'lucide-react';
// import useServerRequests from './useServerRequests';
import useServerRequestsMock from './testcomp';
import Header from './Header';
import {SearchModeToggle} from './SearchModeToggle';
import SearchField from './SearchField';
import ActionButtons from './ActionButtons';
import GroupsFilter from './GroupsFilter';
import SearchResults from './SearchResults';
import FileUpload from './FileUpload';

const UserSearchComponent = () => {
  const [searchMode, setSearchMode] = useState('users');
  const [searchText, setSearchText] = useState('');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isGroupsDropdownOpen, setIsGroupsDropdownOpen] = useState(false);

  const {
    loading,
    groupsLoading,
    availableGroups,
    fetchGroups,
    searchUsers,
    searchGroups
  } = useServerRequestsMock();

  // טעינה ראשונית - טוען קבוצות לפילטר + כל הנתונים לתצוגה
  useEffect(() => {
    const loadInitialData = async () => {
      console.log('🚀 Loading initial data...');
      
      // טען קבוצות לפילטר (רשימה נפתחת)
      await fetchGroups();
      
      // טען כל המשתמשים לתצוגה ראשונית
      console.log('📋 Loading all users...');
      const allUsers = await searchUsers('', []); // חיפוש ריק = כל המשתמשים
      setUsers(allUsers);
      
      // טען כל הקבוצות לתצוגה ראשונית
      console.log('👥 Loading all groups...');
      const allGroups = await searchGroups(''); // חיפוש ריק = כל הקבוצות
      setGroups(allGroups);
      
      console.log('✅ Initial data loaded successfully');
    };
    
    loadInitialData();
  }, []);

  const handleGroupChange = (groupId) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const getSelectedGroupNames = () => {
    return selectedGroups.map(groupId => {
      const group = availableGroups.find(g => g.id === groupId);
      return group ? group.name : '';
    }).filter(name => name);
  };

  const handleSearch = async () => {
    console.log('🔍 Starting search...', { searchMode, searchText, selectedGroups });
    
    if (searchMode === 'users') {
      const results = await searchUsers(searchText, selectedGroups);
      setUsers(results);
    } else {
      const results = await searchGroups(searchText);
      setGroups(results);
    }
  };

  const clearFilters = async () => {
    console.log('🧹 Clearing filters and resetting data...');
    
    // נקה את הפילטרים
    setSearchText('');
    setSelectedGroups([]);
    setIsGroupsDropdownOpen(false);
    
    // החזר את כל הנתונים (כמו בטעינה ראשונית)
    const allUsers = await searchUsers('', []); // כל המשתמשים
    setUsers(allUsers);
    
    const allGroups = await searchGroups(''); // כל הקבוצות
    setGroups(allGroups);
    
    console.log('✅ Filters cleared and data reset');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('📎 File uploaded:', file.name);
      alert(`קובץ ${file.name} הועלה בהצלחה! (בפרויקט אמיתי כאן יהיה parsing של האקסל)`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <Header />
        
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <SearchModeToggle searchMode={searchMode} setSearchMode={setSearchMode} />
          
          <SearchField 
            searchText={searchText} 
            setSearchText={setSearchText} 
            onSearch={handleSearch} 
          />

          {searchMode === 'users' && (
            <GroupsFilter 
              availableGroups={availableGroups}
              selectedGroups={selectedGroups}
              onGroupChange={handleGroupChange}
              getSelectedGroupNames={getSelectedGroupNames}
              groupsLoading={groupsLoading}
              isOpen={isGroupsDropdownOpen}
              toggleOpen={() => setIsGroupsDropdownOpen(!isGroupsDropdownOpen)}
            />
          )}

          <ActionButtons 
            onClear={clearFilters}
            onSearch={handleSearch}
            loading={loading}
          />

          <SearchResults 
            searchMode={searchMode}
            users={users}
            groups={groups}
          />
        </div>

        <FileUpload onFileUpload={handleFileUpload} />
      </div>
    </div>
  );
};

export default UserSearchComponent;