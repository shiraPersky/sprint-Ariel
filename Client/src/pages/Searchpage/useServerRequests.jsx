import { useState } from 'react';

/**
 * Custom hook for server requests
 * Handles all API calls for users and groups management
 */
const useServerRequests = () => {
  const [loading, setLoading] = useState(false);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [availableGroups, setAvailableGroups] = useState([]);

  /**
   * Simulate network delay for testing purposes
   * @param {number} ms - Delay in milliseconds (default: 1000)
   * @returns {Promise} Promise that resolves after the delay
   */
  const simulateNetworkDelay = (ms = 1000) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  /**
   * Fetch all available groups for filtering
   * Updates the availableGroups state
   */
  const fetchGroups = async () => {
    try {
      setGroupsLoading(true);
      console.log('Fetching groups...');
      
      const response = await fetch('http://localhost:5000/communities/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      
      const groupsData = await response.json();
      const groupsArray = groupsData.success ? groupsData.data : [];
      await simulateNetworkDelay(800);
      
      setAvailableGroups(groupsArray);
      console.log('Groups loaded successfully:', groupsData.data);

    } catch (error) {
      console.error('Error fetching groups:', error);
      alert('Error loading groups list');
    } finally {
      setGroupsLoading(false);
    }
  };

  /**
   * Get all users from the server
   * @returns {Promise<Array>} Array of user objects
   */
  const getAllUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching all users...');
      
      const response = await fetch('http://localhost:5000/members/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const usersData = await response.json();
      return usersData;
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error loading users');
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove users from a specific group
   * @param {string|number} groupId - ID of the group
   * @param {Array<string|number>} userIds - Array of user IDs to remove
   * @returns {Promise<Object>} Result of the operation
   */
  const removeUsersFromGroup = async (groupId, userIds) => {
    setLoading(true);
    try {
      console.log('Removing users from group:', { groupId, userIds });

      const response = await fetch(`http://localhost:5000/communities/remove-members`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_group: groupId,
          id_community_members: userIds
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Remove users result:', result);

      return result;
    } catch (error) {
      console.error('Error removing users:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new group
   * @param {Object} groupData - Group data containing name and other properties
   * @param {string} groupData.name - Name of the new group
   * @returns {Promise<Object>} Result of the group creation
   */
  const createGroup = async (groupData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/communities/add-communities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: groupData.name }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Group created:', result);
      return result;
    } catch (error) {
      console.error('Error creating group:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get all groups with detailed information
   * @returns {Promise<Object>} Groups data with success flag and data array
   */
  const getAllGroups = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/communities/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      
      const groupsData = await response.json();
      return groupsData;
    } catch (error) {
      console.error('Error fetching groups:', error);
      alert('Error loading groups');
      return { success: false, data: [] };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Upload Excel file to server
   * @param {File} file - Excel file to upload
   * @returns {Promise<Object>} Upload result
   */
  const uploadExcelFile = async (file) => {
    try {
      setLoading(true);
      console.log('Uploading Excel file:', file.name);
      
      // Convert file to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result.split(',')[1]; // Remove "data:application/...;base64,"
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      console.log('File converted to base64, sending...');
      
      const response = await fetch('http://localhost:5000/excel/upload-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileData: base64,
          fileName: file.name,
          fileSize: file.size
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Excel file uploaded successfully:', result);
      
      return result;
      
    } catch (error) {
      console.error('Error uploading Excel file:', error);
      
      // User-friendly error messages
      if (error.message.includes('404')) {
        alert('Error: Server endpoint not found');
      } else if (error.message.includes('413')) {
        alert('Error: File too large');
      } else if (error.message.includes('400')) {
        alert('Error: Unsupported file format');
      } else {
        alert(`Error uploading file: ${error.message}`);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update group name
   * @param {string|number} groupId - ID of the group to update
   * @param {string} newName - New name for the group
   * @returns {Promise<Object>} Update result
   */
  const updateGroupName = async (groupId, newName) => {
    setLoading(true);
    try {
      console.log('Updating group name:', { groupId, newName });
      
      const response = await fetch('http://localhost:5000/communities/update-name', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_group: groupId,
          group_name: newName
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Update group name result:', result);

      return result;
    } catch (error) {
      console.error('Error updating group name:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a group
   * @param {string|number} groupId - ID of the group to delete
   * @returns {Promise<Object>} Deletion result
   */
  const deleteGroup = async (groupId) => {
    setLoading(true);
    try {
      console.log('Deleting group:', groupId);

      const response = await fetch(`http://localhost:5000/communities/remove-community/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Group deleted successfully:', result);

      return result;
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Search users by groups
   * Requires at least 2 groups to be selected
   * @param {string} searchText - Search text (currently unused)
   * @param {Array<string|number>} selectedGroups - Array of group IDs to search in
   * @returns {Promise<Object>} Search results with user data
   */
  const searchUsers = async (searchText, selectedGroups) => {
    try {
      setLoading(true);

      // Ensure at least 2 groups are selected
      if (!Array.isArray(selectedGroups) || selectedGroups.length < 2) {
        alert('Please select at least two groups');
        return [];
      }

      const searchParams = { groupIds: selectedGroups };

      const response = await fetch('http://localhost:5000/members/search/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to search users');
      }

      const usersData = await response.json();
      console.log('Search users result:', usersData.data);
      return usersData;
    } catch (error) {
      console.error('Error searching users:', error);
      alert('Error searching users: ' + error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get group members details
   * @param {string|number} groupId - ID of the group
   * @returns {Promise<Object>} Group details with member information
   */
  const getGroupMembers = async (groupId) => {
    setLoading(true);
    try {
      console.log('Fetching group details for:', groupId);
      
      const response = await fetch(`http://localhost:5000/communities/group/${groupId}/members`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Group details API response:', result);
      
      if (result.success && result.data.length > 0) {
        // Use group details from the first member
        const firstMember = result.data[0];
        const groupIdFromResponse = firstMember.id_group;
        
        // Create basic group object
        const group = {
          id: groupIdFromResponse,
          name: `Group ${groupIdFromResponse}`, // Could call separate API for group details
          description: `Group with ${result.count} members`,
          image: '/api/placeholder/400/300',
          category: 'General',
          tags: ['Community'],
          memberCount: result.count
        };
        
        return group;
      } else {
        // Return empty group if no members
        return {
          id: parseInt(groupId),
          name: `Group ${groupId}`,
          description: 'Empty group',
          image: '/api/placeholder/400/300',
          category: 'General',
          tags: [],
          memberCount: 0
        };
      }
    } catch (error) {
      console.error('Error fetching group details:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add users to a group
   * @param {string|number} groupId - ID of the group
   * @param {Array<string|number>} userIds - Array of user IDs to add
   * @returns {Promise<Object>} Result of the operation
   */
  const addUsersToGroup = async (groupId, userIds) => {
    setLoading(true);
    try {
      console.log('Adding users to group:', { groupId, userIds });
      
      const response = await fetch(`http://localhost:5000/communities/add-members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id_group: Number(groupId),
          id_community_members: userIds 
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Add users to group result:', result);
      
      if (result.success) {
        return { 
          success: true, 
          addedCount: userIds.length,
          data: result.data 
        };
      } else {
        return { success: false, error: result.error || 'Unknown error' };
      }
    } catch (error) {
      console.error('Error adding users to group:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    groupsLoading,
    availableGroups,
    fetchGroups,
    getAllUsers,
    searchUsers,
    updateGroupName,
    getAllGroups,
    removeUsersFromGroup,
    getGroupMembers,
    addUsersToGroup,
    uploadExcelFile,
    createGroup,
    deleteGroup,
  };
};

export default useServerRequests;