// useServerRequestsMock.js - עדכון עם פונקציונליות חברי קבוצה
import { useState } from 'react';

// נתוני דמה - קבוצות
const MOCK_GROUPS = [
  { id: 1, name: 'מפתחי React ישראל' },
  { id: 2, name: 'מנהלי מוצר תל אביב' },
  { id: 3, name: 'מעצבי UX/UI ירושלים' },
  { id: 4, name: 'סטארט-אפ חיפה' },
  { id: 5, name: 'מפתחי Python ישראל' },
  { id: 6, name: 'DevOps ישראל' },
  { id: 7, name: 'מפתחי JavaScript' },
  { id: 8, name: 'אנליסטי נתונים' }
];

// נתוני דמה - משתמשים
const MOCK_USERS = [
  {
    id: 1,
    name: 'דוד כהן',
    position: 'מפתח תוכנה בכיר',
    company: 'טכנולוגיות אלפא',
    location: 'תל אביב',
    education: 'תואר ראשון',
    experience: '5-7 שנים',
    skills: ['React', 'Node.js', 'Python'],
    industry: 'טכנולוגיה',
    image: 'https://via.placeholder.com/100x100?text=דוד',
    groups: [
      { id: 1, name: 'מפתחי React ישראל' },
      { id: 2, name: 'מנהלי מוצר תל אביב' }
    ]
  },
  {
    id: 2,
    name: 'שרה לוי',
    position: 'מנהלת מוצר',
    company: 'סטארט-אפ חדשני',
    location: 'חיפה',
    education: 'תואר שני',
    experience: '7-10 שנים',
    skills: ['Product Management', 'UX', 'Analytics'],
    industry: 'טכנולוגיה',
    image: 'https://via.placeholder.com/100x100?text=שרה',
    groups: [
      { id: 2, name: 'מנהלי מוצר תל אביב' },
      { id: 4, name: 'סטארט-אפ חיפה' }
    ]
  },
  {
    id: 3,
    name: 'יוסף גרין',
    position: 'מעצב UX/UI',
    company: 'סטודיו עיצוב',
    location: 'ירושלים',
    education: 'תואר ראשון',
    experience: '3-5 שנים',
    skills: ['Figma', 'Adobe XD', 'Sketch'],
    industry: 'עיצוב',
    image: 'https://via.placeholder.com/100x100?text=יוסף',
    groups: [
      { id: 3, name: 'מעצבי UX/UI ירושלים' }
    ]
  },
  {
    id: 4,
    name: 'מיכל רוזן',
    position: 'מנהלת פרויקטים',
    company: 'חברת ייעוץ',
    location: 'תל אביב',
    education: 'תואר שני',
    experience: '10+ שנים',
    skills: ['Project Management', 'Agile', 'Leadership'],
    industry: 'ייעוץ',
    image: 'https://via.placeholder.com/100x100?text=מיכל',
    groups: [
      { id: 1, name: 'מפתחי React ישראל' },
      { id: 2, name: 'מנהלי מוצר תל אביב' },
      { id: 4, name: 'סטארט-אפ חיפה' }
    ]
  },
  {
    id: 5,
    name: 'אלכס וולף',
    position: 'מפתח Frontend',
    company: 'חברת טכנולוגיה',
    location: 'תל אביב',
    education: 'תואר ראשון',
    experience: '4-6 שנים',
    skills: ['React', 'Vue.js', 'TypeScript'],
    industry: 'טכנולוגיה',
    image: 'https://via.placeholder.com/100x100?text=אלכס',
    groups: [
      { id: 1, name: 'מפתחי React ישראל' },
      { id: 7, name: 'מפתחי JavaScript' }
    ]
  },
  {
    id: 6,
    name: 'רינה דוד',
    position: 'אנליסטית נתונים',
    company: 'בנק הפועלים',
    location: 'חיפה',
    education: 'תואר שני',
    experience: '6-8 שנים',
    skills: ['Python', 'SQL', 'Tableau'],
    industry: 'פיננסים',
    image: 'https://via.placeholder.com/100x100?text=רינה',
    groups: [
      { id: 5, name: 'מפתחי Python ישראל' },
      { id: 8, name: 'אנליסטי נתונים' }
    ]
  },
  {
    id: 7,
    name: 'אבי ישראלי',
    position: 'DevOps Engineer',
    company: 'חברת אבטחה',
    location: 'תל אביב',
    education: 'תואר ראשון',
    experience: '5-7 שנים',
    skills: ['Docker', 'Kubernetes', 'AWS'],
    industry: 'טכנולוגיה',
    image: 'https://via.placeholder.com/100x100?text=אבי',
    groups: [
      { id: 6, name: 'DevOps ישראל' },
      { id: 1, name: 'מפתחי React ישראל' }
    ]
  },
  {
    id: 8,
    name: 'נועה לבנה',
    position: 'Product Manager',
    company: 'גוגל',
    location: 'תל אביב',
    education: 'תואר שני',
    experience: '8-10 שנים',
    skills: ['Product Strategy', 'Analytics', 'Leadership'],
    industry: 'טכנולוגיה',
    image: 'https://via.placeholder.com/100x100?text=נועה',
    groups: [
      { id: 2, name: 'מנהלי מוצר תל אביב' },
      { id: 4, name: 'סטארט-אפ חיפה' }
    ]
  }
];

// נתוני קבוצות מפורטות
const MOCK_GROUPS_DETAILED = [
  {
    id: 1,
    name: 'מפתחי React ישראל',
    members: 1250,
    category: 'טכנולוגיה',
    description: 'קהילת מפתחי React הגדולה בישראל',
    image: 'https://via.placeholder.com/150x100?text=React+IL',
    tags: ['React', 'JavaScript', 'Frontend']
  },
  {
    id: 2,
    name: 'מנהלי מוצר תל אביב',
    members: 850,
    category: 'ניהול מוצר',
    description: 'רשת מנהלי מוצר במרכז',
    image: 'https://via.placeholder.com/150x100?text=PM+TLV',
    tags: ['Product Management', 'Strategy', 'Analytics']
  },
  {
    id: 3,
    name: 'מעצבי UX/UI ירושלים',
    members: 420,
    category: 'עיצוב',
    description: 'קהילת מעצבים בירושלים',
    image: 'https://via.placeholder.com/150x100?text=UX+JLM',
    tags: ['UX', 'UI', 'Design']
  },
  {
    id: 4,
    name: 'סטארט-אפ חיפה',
    members: 650,
    category: 'יזמות',
    description: 'יזמים וסטארט-אפיסטים בצפון',
    image: 'https://via.placeholder.com/150x100?text=Startup+HFA',
    tags: ['Entrepreneurship', 'Innovation', 'Networking']
  },
  {
    id: 5,
    name: 'מפתחי Python ישראל',
    members: 980,
    category: 'טכנולוגיה',
    description: 'קהילת מפתחי Python בישראל',
    image: 'https://via.placeholder.com/150x100?text=Python+IL',
    tags: ['Python', 'Backend', 'Data Science']
  },
  {
    id: 6,
    name: 'DevOps ישראל',
    members: 750,
    category: 'טכנולוגיה',
    description: 'קהילת מהנדסי DevOps בישראל',
    image: 'https://via.placeholder.com/150x100?text=DevOps+IL',
    tags: ['DevOps', 'AWS', 'Docker']
  }
];

// פונקציה לסימולציה של delay
const simulateNetworkDelay = (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// הוק דמה לבקשות שרת
const useServerRequestsMock = () => {
  const [loading, setLoading] = useState(false);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [availableGroups, setAvailableGroups] = useState([]);

  const fetchGroups = async () => {
    try {
      setGroupsLoading(true);
      console.log('🔄 [MOCK] Fetching groups...');
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
      console.log('✅ [MOCK] Groups loaded successfully:', groupsData.data);

    } catch (error) {
      console.error('❌ [MOCK] Error fetching groups:', error);
      alert('שגיאה בטעינת רשימת הקבוצות');
    } finally {
      setGroupsLoading(false);
    }
  };
const getAllUsers = async () => {
    try {
      setLoading(true);
      console.log('🔄 [MOCK] Fetching all users...');
      const response = await fetch('http://localhost:5000/members/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const usersData = await response.json();
      setLoading(false);
      return usersData;
    } catch (error) {
      console.error('Error searching users:', error);
      alert('שגיאה בחיפוש משתמשים');
    }
  }
const removeUsersFromGroup = async (groupId, userIds) => {
  setLoading(true);
  try {
    console.log('🗑️ Removing users from group:', { groupId, userIds });

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
    console.log('✅ Remove users result:', result);

    return result;
  } catch (error) {
    console.error('❌ Error removing users:', error);
    throw error;
  } finally {
    setLoading(false);
  }
};

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
    console.log('✅ Group created:', result);
    return result;
  } catch (error) {
    console.error('❌ Error creating group:', error);
    return { success: false, error: error.message };
  } finally {
    setLoading(false);
  }
};

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
      // const groupsData1=MOCK_GROUPS_DETAILED
      setLoading(false);
      return groupsData;
    } catch (error) {
      console.error('Error searching groups:', error);
      alert('שגיאה בחיפוש קבוצות');
    }
  }
  

  // const removeUsersFromGroup = async (groupId, userIds) => {
  //   try {
  //     console.log('➖ [MOCK] Removing users from group:', { groupId, userIds });
      
  //     await simulateNetworkDelay(1000);
      
  //     // בסימולציה - נסיר את המשתמשים מהקבוצה ברשימה המקומית
  //     const groupData = MOCK_GROUPS_DETAILED.find(g => g.id === parseInt(groupId));
  //     if (!groupData) {
  //       throw new Error('Group not found');
  //     }
      
  //     // עדכן את המשתמשים שהוסרו (בדמה)
  //     let removedCount = 0;
  //     userIds.forEach(userId => {
  //       const user = MOCK_USERS.find(u => u.id === parseInt(userId));
  //       if (user) {
  //         const groupIndex = user.groups.findIndex(g => g.id === parseInt(groupId));
  //         if (groupIndex !== -1) {
  //           user.groups.splice(groupIndex, 1);
  //           removedCount++;
  //         }
  //       }
  //     });
      
  //     console.log(`✅ [MOCK] Successfully removed ${removedCount} users from group ${groupId}`);
  //     return { success: true, removedCount };
      
  //   } catch (error) {
  //     console.error('❌ [MOCK] Error removing users from group:', error);
  //     alert('שגיאה בהסרת משתמשים מהקבוצה');
  //     return { success: false, error: error.message };
  //   }
  // };
const uploadExcelFile = async (file) => {
  try {
    setLoading(true);
    console.log('📤 Uploading Excel file:', file.name);
    
    // המרת הקובץ ל-base64
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(',')[1]; // מסיר את "data:application/...;base64,"
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    
    console.log('📋 File converted to base64, sending...');
    
    // שינוי הנתיב ל-/excel/upload-excel
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
  // const searchUsers = async (searchText, selectedGroups) => {
  //   try {
  //     setLoading(true);
  //     console.log('🔍 [MOCK] Searching users with:', { searchText, selectedGroups });
      
  //     await simulateNetworkDelay(1200);
      
  //     let filteredUsers = [...MOCK_USERS];
      
  //     // פילטר לפי טקסט חיפוש
  //     if (searchText && searchText.trim()) {
  //       filteredUsers = filteredUsers.filter(user => 
  //         user.name.toLowerCase().includes(searchText.toLowerCase()) ||
  //         user.position.toLowerCase().includes(searchText.toLowerCase()) ||
  //         user.company.toLowerCase().includes(searchText.toLowerCase())
  //       );
  //     }
      
  //     // פילטר לפי קבוצות - המשתמש צריך להיות חבר בכל הקבוצות שנבחרו
  //     if (selectedGroups && selectedGroups.length > 0) {
  //       filteredUsers = filteredUsers.filter(user => {
  //         const userGroupIds = user.groups.map(group => group.id);
  //         return selectedGroups.every(selectedGroupId => 
  //           userGroupIds.includes(selectedGroupId)
  //         );
  //       });
  //     }
      
  //     console.log(`✅ [MOCK] Found ${filteredUsers.length} users`);
  //     return filteredUsers;
      
  //   } catch (error) {
  //     console.error('❌ [MOCK] Error searching users:', error);
  //     alert('שגיאה בחיפוש משתמשים');
  //     return [];
  //   } finally {
  //     setLoading(false);
  //   }
  // };

;const searchUsers = async (searchText, selectedGroups) => {
  try {
    setLoading(true);

    // ודא ששלחת לפחות שני groupIds
    if (!Array.isArray(selectedGroups) || selectedGroups.length < 2) {
      alert('יש לבחור לפחות שני קבוצות');
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
    console.log('✅ [MOCK] Found users:', usersData.data);
    return usersData;
  } catch (error) {
    console.error('Error searching users:', error);
    alert('שגיאה בחיפוש משתמשים: ' + error.message);
    return [];
  } finally {
    setLoading(false);
  }
};

  const searchGroups = async (searchText) => {
    try {
      setLoading(true);
      console.log('🔍 [MOCK] Searching groups with:', { searchText });
      
      await simulateNetworkDelay(1000);
      
      let filteredGroups = [...MOCK_GROUPS_DETAILED];
      
      // פילטר לפי טקסט חיפוש
      if (searchText && searchText.trim()) {
        filteredGroups = filteredGroups.filter(group => 
          group.name.toLowerCase().includes(searchText.toLowerCase()) ||
          group.description.toLowerCase().includes(searchText.toLowerCase()) ||
          group.category.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      
      console.log(`✅ [MOCK] Found ${filteredGroups.length} groups`);
      return filteredGroups;
      
    } catch (error) {
      console.error('❌ [MOCK] Error searching groups:', error);
      alert('שגיאה בחיפוש קבוצות');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // 🆕 פונקציה חדשה - חיפוש חברי קבוצה
  const getGroupMembers = async (groupId) => {
    try {
      setLoading(true);
      console.log('👥 [MOCK] Getting members for group:', groupId);
      
      await simulateNetworkDelay(1000);
      
      // מצא את כל המשתמשים שחברים בקבוצה הזו
      const groupMembers = MOCK_USERS.filter(user => 
        user.groups.some(userGroup => userGroup.id === parseInt(groupId))
      );
      
      console.log(`✅ [MOCK] Found ${groupMembers.length} members in group ${groupId}`);
      return groupMembers;
      
    } catch (error) {
      console.error('❌ [MOCK] Error getting group members:', error);
      alert('שגיאה בטעינת חברי הקבוצה');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // 🆕 פונקציה חדשה - קבלת פרטי קבוצה
  const getGroupDetails = async (groupId) => {
    try {
      console.log('📋 [MOCK] Getting group details for:', groupId);
      
      await simulateNetworkDelay(500);
      
      const group = MOCK_GROUPS_DETAILED.find(g => g.id === parseInt(groupId));
      
      if (!group) {
        throw new Error('Group not found');
      }
      
      console.log('✅ [MOCK] Group details loaded:', group.name);
      return group;
      
    } catch (error) {
      console.error('❌ [MOCK] Error getting group details:', error);
      alert('שגיאה בטעינת פרטי הקבוצה');
      return null;
    }
  };

  // 🆕 פונקציה חדשה - קבלת רשימת משתמשים זמינים להוספה לקבוצה
  const getAvailableUsersForGroup = async (groupId) => {
    try {
      console.log('👤 [MOCK] Getting available users for group:', groupId);
      
      await simulateNetworkDelay(800);
      
      // מצא משתמשים שלא חברים בקבוצה
      const availableUsers = MOCK_USERS.filter(user => 
        !user.groups.some(userGroup => userGroup.id === parseInt(groupId))
      ).map(user => ({
        id: user.id,
        name: user.name,
        position: user.position,
        company: user.company
      }));
      
      console.log(`✅ [MOCK] Found ${availableUsers.length} available users for group ${groupId}`);
      return availableUsers;
      
    } catch (error) {
      console.error('❌ [MOCK] Error getting available users:', error);
      alert('שגיאה בטעינת רשימת המשתמשים הזמינים');
      return [];
    }
  };
const addUsersToGroup = async (groupId, userIds) => {
  setLoading(true);
  try {
    console.log('➕ Adding users to group:', { groupId, userIds });
    
    const response = await fetch(`http://localhost:5000/communities/add-communities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        groupId: groupId,
        userIds: userIds 
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Add users to group result:', result);
    
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
    console.error('❌ Error adding users to group:', error);
    return { success: false, error: error.message };
  } finally {
    setLoading(false);
  }
};

// ב-return הוסף: addUsersToGroup
  // 🆕 פונקציה חדשה - הוספת משתמשים לקבוצה
  // const addUsersToGroup = async (groupId, userIds) => {
  //   try {
  //     console.log('➕ [MOCK] Adding users to group:', { groupId, userIds });
      
  //     await simulateNetworkDelay(1200);
      
  //     // בסימולציה - נוסיף את המשתמשים לקבוצה ברשימה המקומית
  //     const groupData = MOCK_GROUPS_DETAILED.find(g => g.id === parseInt(groupId));
  //     if (!groupData) {
  //       throw new Error('Group not found');
  //     }
      
  //     // עדכן את המשתמשים שנוספו (בדמה)
  //     userIds.forEach(userId => {
  //       const user = MOCK_USERS.find(u => u.id === parseInt(userId));
  //       if (user && !user.groups.some(g => g.id === parseInt(groupId))) {
  //         user.groups.push({ 
  //           id: parseInt(groupId), 
  //           name: groupData.name 
  //         });
  //       }
  //     });
      
  //     console.log(`✅ [MOCK] Successfully added ${userIds.length} users to group ${groupId}`);
  //     return { success: true, addedCount: userIds.length };
      
  //   } catch (error) {
  //     console.error('❌ [MOCK] Error adding users to group:', error);
  //     alert('שגיאה בהוספת משתמשים לקבוצה');
  //     return { success: false, error: error.message };
  //   }
  // };

  return {
    loading,
    groupsLoading,
    availableGroups,
    fetchGroups,
    getAllUsers,             // 🆕 פונקציה חדשה
    searchUsers,
    searchGroups,
    getAllGroups,
    removeUsersFromGroup,    // 🆕 פונקציה חדשה
    getGroupMembers,          // 🆕 פונקציה חדשה
    getGroupDetails,          // 🆕 פונקציה חדשה
    getAvailableUsersForGroup, // 🆕 פונקציה חדשה
    addUsersToGroup,
    uploadExcelFile,
    createGroup,
           // 🆕 פונקציה חדשה
  };
};

export default useServerRequestsMock;