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
import AddGroupModal from './AddGroupModal';


const UserSearchComponent = () => {
  const [searchMode, setSearchMode] = useState('users');
  const [searchText, setSearchText] = useState('');
  const [selectedGroups, setSelectedGroups] = useState([]);
  
  // נתונים מקוריים (נטענים פעם אחת)
  const [originalUsers, setOriginalUsers] = useState([]);
  const [originalGroups, setOriginalGroups] = useState([]);
  
  // תוצאות חיפוש
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [isGroupsDropdownOpen, setIsGroupsDropdownOpen] = useState(false);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);

  const {
    loading,
    groupsLoading,
    availableGroups,
    getAllUsers,
    getAllGroups,
    fetchGroups,
    searchUsers,
    removeUsersFromGroup,
    uploadExcelFile,
    searchGroups,
    createGroup
  } = useServerRequestsMock();

  // טעינה ראשונית - טוען קבוצות לפילטר + כל הנתונים לתצוגה
  useEffect(() => {
    const loadInitialData = async () => {
      console.log('🚀 Loading initial data...');
      
      // טען קבוצות לפילטר (רשימה נפתחת)
      await fetchGroups();
      
      // טען כל המשתמשים לתצוגה ראשונית
      console.log('📋 Loading all users...');
      const allUsers = await getAllUsers();
      setOriginalUsers(allUsers);
      
      // טען כל הקבוצות לתצוגה ראשונית
      console.log('👥 Loading all groups...');
      const allGroups = await getAllGroups();
      const groupsArray = allGroups.success ? allGroups.data : [];
      console.log('Retrieved groups:11111', groupsArray);
      setOriginalGroups(groupsArray);

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

  const handleSendToServer = async (file) => {
    try {
      const result = await uploadExcelFile(file);
      console.log('📤 File upload result:', result);
      
      // הצגת הודעת הצלחה
      alert(`הקובץ ${file.name} הועלה בהצלחה!`);
      
      // טען מחדש את כל המשתמשים ועדכן את הstate
      console.log('🔄 Refreshing users data after upload...');
      const refreshedUsers = await getAllUsers();
      setOriginalUsers(refreshedUsers);
      
      // טען מחדש את הקבוצות גם
      console.log('🔄 Refreshing groups data after upload...');
      const refreshedGroups = await getAllGroups();
      const groupsArray = refreshedGroups.success ? refreshedGroups.data : [];
      setOriginalGroups(groupsArray);
      
      // נקה את תוצאות החיפוש כדי להציג את כל הנתונים המעודכנים
      setSearchResults([]);
      setHasSearched(false);
      
      // אם השרת מחזיר נתונים חדשים נוספים, עדכן את הstate
      if (result.data) {
        if (result.data.users) {
          setOriginalUsers(prev => [...prev, ...result.data.users]);
        }
        if (result.data.groups) {
          setOriginalGroups(prev => [...prev, ...result.data.groups]);
        }
      }
      
      console.log('✅ Data refreshed successfully after upload');
      return result;
      
    } catch (error) {
      // השגיאה כבר מטופלת ב-hook
      console.error('Upload failed:', error);
    }
  };

  const handleSearch = async () => {
    console.log('🔍 Starting search...', { searchMode, searchText, selectedGroups });
    
    if (searchMode === 'users') {
      const results = await searchUsers(searchText, selectedGroups);
      console.log('📊 Search results:', results);
      setSearchResults(results.data || []);
    } else {
      const results = await searchGroups(searchText);
      setSearchResults(results);
    }
    
    setHasSearched(true);
  };

  const clearFilters = async () => {
    console.log('🧹 Clearing filters and resetting data...');
    
    // נקה את הפילטרים
    setSearchText('');
    setSelectedGroups([]);
    setIsGroupsDropdownOpen(false);
    setSearchResults([]);
    setHasSearched(false);
    
    console.log('✅ Filters cleared and data reset');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      console.log('📎 File uploaded:', file.name);
      alert(`קובץ ${file.name} הועלה בהצלחה! (בפרויקט אמיתי כאן יהיה parsing של האקסל)`);
    }
  };


const handleAddGroup = async (groupData) => {
  const result = await createGroup(groupData); // השתמש בפונקציה מה-hook
  
  if (result.success) {
    setOriginalGroups(prev => [...prev, result.data]);
    await fetchGroups();
    alert(`הקבוצה "${groupData.name}" נוספה בהצלחה!`);
  } else {
    alert('שגיאה ביצירת הקבוצה');
  }
};
  // קבע איזה נתונים להציג
  const getDisplayData = () => {
    if (hasSearched) {
      return {
        users: searchMode === 'users' ? searchResults : [],
        groups: searchMode === 'groups' ? searchResults : []
      };
    }
    
    return {
      users: originalUsers,
      groups: originalGroups
    };
  };

  const displayData = getDisplayData();

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
            searchMode={searchMode}
            onAddGroup={() => setIsAddGroupModalOpen(true)}
          />

          <SearchResults 
            searchMode={searchMode}
            users={displayData.users}
            groups={displayData.groups}
          />
        </div>

        <FileUpload onFileUpload={handleFileUpload} onSendToServer={handleSendToServer} />
        
        <AddGroupModal 
          isOpen={isAddGroupModalOpen}
          onClose={() => setIsAddGroupModalOpen(false)}
          onAddGroup={handleAddGroup}
        />
      </div>
    </div>
  );
};

export default UserSearchComponent;