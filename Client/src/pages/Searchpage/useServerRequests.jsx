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

  const searchUsers = async (searchText, selectedGroups) => {
    try {
      setLoading(true);
      
      const searchParams = {
        searchText: searchText.trim(),
        groupIds: selectedGroups
      };
      
      const response = await fetch('/api/users/search', {
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

  return {
    loading,
    groupsLoading,
    availableGroups,
    fetchGroups,
    searchUsers,
    searchGroups,
    getGroupMembers,  // 🆕 פונקציה חדשה
    getGroupDetails   // 🆕 פונקציה חדשה
  };
};

export default useServerRequests;