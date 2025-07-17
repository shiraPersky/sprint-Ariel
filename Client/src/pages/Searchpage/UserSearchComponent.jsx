import React, { useState, useEffect } from 'react';
import { Search, Users, UserCheck, Upload, Filter, MapPin, Briefcase, GraduationCap, Calendar, Building, Award, ChevronDown, Loader2 } from 'lucide-react';
import useServerRequests from './useServerRequests';
import Header from './Header';
import { SearchModeToggle } from './SearchModeToggle';
import SearchField from './SearchField';
import ActionButtons from './ActionButtons';
import GroupsFilter from './GroupsFilter';
import SearchResults from './SearchResults';
import FileUpload from './FileUpload';
import AddGroupModal from './AddGroupModal';

/**
 * UserSearchComponent
 * Main component for searching and managing users and groups
 * Handles user/group search, filtering, file uploads, and CRUD operations
 */
const UserSearchComponent = () => {
  // Search state
  const [searchMode, setSearchMode] = useState('users');
  const [searchText, setSearchText] = useState('');
  const [selectedGroups, setSelectedGroups] = useState([]);
  
  // Original data (loaded once)
  const [originalUsers, setOriginalUsers] = useState([]);
  const [originalGroups, setOriginalGroups] = useState([]);
  
  // Search results
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  // UI state
  const [isGroupsDropdownOpen, setIsGroupsDropdownOpen] = useState(false);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);

  // Server requests hook
  const {
    loading,
    groupsLoading,
    availableGroups,
    getAllUsers,
    getAllGroups,
    fetchGroups,
    searchUsers,
    updateGroupName,
    deleteGroup,
    uploadExcelFile,
    searchGroups,
    createGroup
  } = useServerRequests();

  /**
   * Initialize data on component mount
   * Loads all users, groups, and available groups for filtering
   */
  useEffect(() => {
    const loadInitialData = async () => {
      console.log('Loading initial data...');
      
      // Fetch groups for filter
      console.log('Fetching groups for filter...');
      await fetchGroups();
      
      // Load all users
      console.log('Loading all users...');
      const allUsers = await getAllUsers();
      setOriginalUsers(allUsers);
      
      // Load all groups
      console.log('Loading all groups...');
      const allGroups = await getAllGroups();
      const groupsArray = allGroups.success ? allGroups.data : [];
      setOriginalGroups(groupsArray);
      
      console.log('Initial data loaded successfully');
    };
    
    loadInitialData();
  }, []);

  /**
   * Handle search mode changes
   * Automatically performs search when search mode changes if there are search criteria
   */
  useEffect(() => {
    if (searchText.trim() || (searchMode === 'users' && selectedGroups.length > 0)) {
      console.log('Search mode changed, performing automatic search...', { searchMode, searchText, selectedGroups });
      handleSearch();
    } else if (hasSearched) {
      console.log('No search criteria, resetting to show all data...');
      setSearchResults([]);
      setHasSearched(false);
    }
  }, [searchMode]); // Only when searchMode changes

  /**
   * Handle group selection for filtering
   * Toggles group selection in the filter
   * @param {string} groupId - ID of the group to toggle
   */
  const handleGroupChange = (groupId) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  /**
   * Handle group name update
   * Updates group name and refreshes data
   * @param {string} groupId - ID of the group to update
   * @param {string} newName - New name for the group
   */
  const handleGroupUpdated = async (groupId, newName) => {
    console.log('Updating group name:', { groupId, newName });
    await updateGroupName(groupId, newName);
    
    // Refresh groups data
    const refreshedGroups = await getAllGroups();
    const groupsArray = refreshedGroups.success ? refreshedGroups.data : [];
    setOriginalGroups(groupsArray);
    await fetchGroups(); // Update filter as well
  };

  /**
   * Get selected group names for display
   * Maps selected group IDs to their names
   * @returns {string[]} Array of selected group names
   */
  const getSelectedGroupNames = () => {
    return selectedGroups.map(groupId => {
      const group = availableGroups.find(g => g.id === groupId);
      return group ? group.name : '';
    }).filter(name => name);
  };

  /**
   * Handle group deletion
   * Deletes group and refreshes data
   * @param {string} groupId - ID of the group to delete
   */
  const handleGroupDeleted = async (groupId) => {
    console.log('Deleting group:', groupId);
    await deleteGroup(groupId);
    
    // Refresh groups data
    const refreshedGroups = await getAllGroups();
    const groupsArray = refreshedGroups.success ? refreshedGroups.data : [];
    setOriginalGroups(groupsArray);
    await fetchGroups(); // Update filter as well
  };

  /**
   * Handle file upload to server
   * Uploads Excel file and refreshes all data
   * @param {File} file - File to upload
   * @returns {Promise} Upload result
   */
  const handleSendToServer = async (file) => {
    try {
      const result = await uploadExcelFile(file);
      console.log('File upload result:', result);
      
      // Show success message
      alert(`The file ${file.name} was uploaded successfully!`);
      
      // Reload all users and update state
      console.log('Refreshing users data after upload...');
      const refreshedUsers = await getAllUsers();
      setOriginalUsers(refreshedUsers);
      
      // Reload groups as well
      console.log('Refreshing groups data after upload...');
      const refreshedGroups = await getAllGroups();
      const groupsArray = refreshedGroups.success ? refreshedGroups.data : [];
      setOriginalGroups(groupsArray);
      
      // Clear search results to show all updated data
      setSearchResults([]);
      setHasSearched(false);
      
      // If server returns additional new data, update state
      if (result.data) {
        if (result.data.users) {
          setOriginalUsers(prev => [...prev, ...result.data.users]);
        }
        if (result.data.groups) {
          setOriginalGroups(prev => [...prev, ...result.data.groups]);
        }
      }
      
      console.log('Data refreshed successfully after upload');
      return result;
      
    } catch (error) {
      // Error is already handled in hook
      console.error('Upload failed:', error);
    }
  };

  /**
   * Handle search execution
   * Performs search based on current search mode and criteria
   */
  const handleSearch = async () => {
    console.log('Starting search...', { searchMode, searchText, selectedGroups });
    
    if (searchMode === 'users') {
      const results = await searchUsers(searchText, selectedGroups);
      console.log('Search results:', results);
      setSearchResults(results.data || []);
    } else {
      const results = await searchGroups(searchText);
      setSearchResults(results);
    }
    
    setHasSearched(true);
  };

  /**
   * Clear all filters and reset data
   * Resets search text, selected groups, and search results
   */
  const clearFilters = async () => {
    console.log('Clearing filters and resetting data...');
    
    // Clear filters
    setSearchText('');
    setSelectedGroups([]);
    setIsGroupsDropdownOpen(false);
    setSearchResults([]);
    setHasSearched(false);
    
    console.log('Filters cleared and data reset');
  };

  /**
   * Handle file upload (legacy method)
   * Basic file upload handler for input change events
   * @param {Event} event - File input change event
   */
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      console.log('File uploaded:', file.name);
      alert(`File ${file.name} uploaded successfully! (In a real project, Excel parsing would happen here)`);
    }
  };

  /**
   * Handle adding new group
   * Creates new group and updates data
   * @param {Object} groupData - Group data to create
   */
  const handleAddGroup = async (groupData) => {
    const result = await createGroup(groupData);
    
    if (result.success) {
      setOriginalGroups(prev => [...prev, result.data]);
      await fetchGroups();
      alert(`Group "${groupData.name}" was added successfully!`);
    } else {
      alert('Error creating group');
    }
  };

  /**
   * Determine which data to display
   * Returns search results if search was performed, otherwise returns original data
   * @returns {Object} Object containing users and groups arrays to display
   */
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
        {/* <Header /> */}
        
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
            onGroupUpdated={handleGroupUpdated}
            onGroupDeleted={handleGroupDeleted}
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