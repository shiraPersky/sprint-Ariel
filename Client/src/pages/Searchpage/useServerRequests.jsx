// useServerRequests.js - עדכון עם פונקציונליות חברי קבוצה
import { useState } from 'react';

const useServerRequests = () => {
  const [loading, setLoading] = useState(false);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [availableGroups, setAvailableGroups] = useState([]);

  const fetchGroups = async () => {
    try {
      setGroupsLoading(true);
      
      const response = await fetch('/api/groups', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      
      const groupsData = await response.json();
      setAvailableGroups(groupsData);
      
    } catch (error) {
      console.error('Error fetching groups:', error);
      alert('שגיאה בטעינת רשימת הקבוצות');
    } finally {
      setGroupsLoading(false);
    }
  };
  const getAllUsers = async () => {
    try {
      setLoading(true);
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
      console.error('Error searching users:', error);
      alert('שגיאה בחיפוש משתמשים');
    }
  }
  const searchUsers = async (searchText, selectedGroups) => {
    try {
      setLoading(true);
      
      // const searchParams = {
      //   searchText: searchText.trim(),
      //   groupIds: selectedGroups
      // };
      const searchParams = { groupIds: selectedGroups };

      const response = await fetch('/members/search/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams),
      });
      
      if (!response.ok) {
        throw new Error('Failed to search users');
      }
      
      const usersData = await response.json();
      return usersData;
      
    } catch (error) {
      console.error('Error searching users:', error);
      alert('שגיאה בחיפוש משתמשים');
      return [];
    } finally {
      setLoading(false);
    }
  };
const uploadExcelFile = async (file) => {
  try {
    setLoading(true);
    console.log('📤 Uploading Excel file:', file.name);
    
    // יצירת FormData
    const formData = new FormData();
    formData.append('excelFile', file);
    formData.append('fileName', file.name);
    formData.append('fileSize', file.size);
    
    const response = await fetch('/api/upload-excel', {
      method: 'POST',
      body: formData,
      // לא מגדירים Content-Type - הדפדפן יעשה זאת אוטומטי
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('✅ Excel file uploaded successfully:', result);
    
    return result;
    
  } catch (error) {
    console.error('❌ Error uploading Excel file:', error);
    
    // הודעות שגיאה ידידותיות
    if (error.message.includes('404')) {
      alert('שגיאה: נתיב השרת לא נמצא');
    } else if (error.message.includes('413')) {
      alert('שגיאה: הקובץ גדול מדי');
    } else if (error.message.includes('400')) {
      alert('שגיאה: פורמט קובץ לא נתמך');
    } else {
      alert(`שגיאה בהעלאת הקובץ: ${error.message}`);
    }
    
    throw error;
  } finally {
    setLoading(false);
  }
};
  const searchGroups = async (searchText) => {
    try {
      setLoading(true);
      
      const searchParams = { searchText: searchText.trim() };
      
      const response = await fetch('/api/groups/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams),
      });
      
      if (!response.ok) {
        throw new Error('Failed to search groups');
      }
      
      const groupsData = await response.json();
      return groupsData;
      
    } catch (error) {
      console.error('Error searching groups:', error);
      alert('שגיאה בחיפוש קבוצות');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // 🆕 פונקציה חדשה - קבלת חברי קבוצה
  const getGroupMembers = async (groupId) => {
    try {
      setLoading(true);
      console.log('👥 Fetching members for group:', groupId);
      
      const response = await fetch(`/api/groups/${groupId}/members`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch group members');
      }
      
      const membersData = await response.json();
      console.log(`✅ Found ${membersData.length} members in group ${groupId}`);
      return membersData;
      
    } catch (error) {
      console.error('Error fetching group members:', error);
      alert('שגיאה בטעינת חברי הקבוצה');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // 🆕 פונקציה חדשה - קבלת פרטי קבוצה
  const getGroupDetails = async (groupId) => {
    try {
      console.log('📋 Fetching group details for:', groupId);
      
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch group details');
      }
      
      const groupData = await response.json();
      console.log('✅ Group details loaded:', groupData.name);
      return groupData;
      
    } catch (error) {
      console.error('Error fetching group details:', error);
      alert('שגיאה בטעינת פרטי הקבוצה');
      return null;
    }
  };

  // 🆕 פונקציה חדשה - קבלת רשימת משתמשים זמינים להוספה לקבוצה
  const getAvailableUsersForGroup = async (groupId) => {
    try {
      console.log('👤 Fetching available users for group:', groupId);
      
      const response = await fetch(`/api/groups/${groupId}/available-users`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch available users');
      }
      
      const availableUsers = await response.json();
      console.log(`✅ Found ${availableUsers.length} available users for group ${groupId}`);
      return availableUsers;
      
    } catch (error) {
      console.error('Error fetching available users:', error);
      alert('שגיאה בטעינת רשימת המשתמשים הזמינים');
      return [];
    }
  };

  // 🆕 פונקציה חדשה - הוספת משתמשים לקבוצה
  const addUsersToGroup = async (groupId, userIds) => {
    try {
      console.log('➕ Adding users to group:', { groupId, userIds });
      
      const response = await fetch(`/api/groups/${groupId}/add-users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add users to group');
      }
      
      const result = await response.json();
      console.log(`✅ Successfully added ${result.addedCount} users to group ${groupId}`);
      return result;
      
    } catch (error) {
      console.error('Error adding users to group:', error);
      alert('שגיאה בהוספת משתמשים לקבוצה');
      return { success: false, error: error.message };
    }
  };
  const removeUsersFromGroup = async (groupId, userIds) => {
    try {
      console.log('➖ Removing users from group:', { groupId, userIds });
      
      const response = await fetch(`/api/groups/${groupId}/remove-users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove users from group');
      }
      
      const result = await response.json();
      console.log(`✅ Successfully removed ${result.removedCount} users from group ${groupId}`);
      return result;
      
    } catch (error) {
      console.error('Error removing users from group:', error);
      alert('שגיאה בהסרת משתמשים מהקבוצה');
      return { success: false, error: error.message };
    }
  };

  return {
    loading,
    groupsLoading,
    availableGroups,
    fetchGroups,
    searchUsers,
    searchGroups,
    getGroupMembers,          // 🆕 פונקציה חדשה
    getGroupDetails,          // 🆕 פונקציה חדשה
    getAvailableUsersForGroup, // 🆕 פונקציה חדשה
    addUsersToGroup,         // 🆕 פונקציה חדשה
    removeUsersFromGroup     // 🆕 פונקציה חדשה
  };
};

export default useServerRequests;