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
      
      await simulateNetworkDelay(800);
      
      setAvailableGroups(MOCK_GROUPS);
      console.log('✅ [MOCK] Groups loaded successfully:', MOCK_GROUPS.length);
      
    } catch (error) {
      console.error('❌ [MOCK] Error fetching groups:', error);
      alert('שגיאה בטעינת רשימת הקבוצות');
    } finally {
      setGroupsLoading(false);
    }
  };

  const searchUsers = async (searchText, selectedGroups) => {
    try {
      setLoading(true);
      console.log('🔍 [MOCK] Searching users with:', { searchText, selectedGroups });
      
      await simulateNetworkDelay(1200);
      
      let filteredUsers = [...MOCK_USERS];
      
      // פילטר לפי טקסט חיפוש
      if (searchText && searchText.trim()) {
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(searchText.toLowerCase()) ||
          user.position.toLowerCase().includes(searchText.toLowerCase()) ||
          user.company.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      
      // פילטר לפי קבוצות - המשתמש צריך להיות חבר בכל הקבוצות שנבחרו
      if (selectedGroups && selectedGroups.length > 0) {
        filteredUsers = filteredUsers.filter(user => {
          const userGroupIds = user.groups.map(group => group.id);
          return selectedGroups.every(selectedGroupId => 
            userGroupIds.includes(selectedGroupId)
          );
        });
      }
      
      console.log(`✅ [MOCK] Found ${filteredUsers.length} users`);
      return filteredUsers;
      
    } catch (error) {
      console.error('❌ [MOCK] Error searching users:', error);
      alert('שגיאה בחיפוש משתמשים');
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

  // 🆕 פונקציה חדשה - הוספת משתמשים לקבוצה
  const addUsersToGroup = async (groupId, userIds) => {
    try {
      console.log('➕ [MOCK] Adding users to group:', { groupId, userIds });
      
      await simulateNetworkDelay(1200);
      
      // בסימולציה - נוסיף את המשתמשים לקבוצה ברשימה המקומית
      const groupData = MOCK_GROUPS_DETAILED.find(g => g.id === parseInt(groupId));
      if (!groupData) {
        throw new Error('Group not found');
      }
      
      // עדכן את המשתמשים שנוספו (בדמה)
      userIds.forEach(userId => {
        const user = MOCK_USERS.find(u => u.id === parseInt(userId));
        if (user && !user.groups.some(g => g.id === parseInt(groupId))) {
          user.groups.push({ 
            id: parseInt(groupId), 
            name: groupData.name 
          });
        }
      });
      
      console.log(`✅ [MOCK] Successfully added ${userIds.length} users to group ${groupId}`);
      return { success: true, addedCount: userIds.length };
      
    } catch (error) {
      console.error('❌ [MOCK] Error adding users to group:', error);
      alert('שגיאה בהוספת משתמשים לקבוצה');
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
    addUsersToGroup           // 🆕 פונקציה חדשה
  };
};

export default useServerRequestsMock;