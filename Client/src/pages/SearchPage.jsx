// import React, { useState, useEffect } from 'react';
// import { Search, Users, UserCheck, Upload, Filter, MapPin, Briefcase, GraduationCap, Calendar, Building, Award, ChevronDown, Loader2 } from 'lucide-react';

// const UserSearchComponent = () => {
//   const [searchMode, setSearchMode] = useState('users');
//   const [searchText, setSearchText] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [groupsLoading, setGroupsLoading] = useState(true);
  
//   const [checkboxFilters, setCheckboxFilters] = useState({
//     groups: []
//   });

//   const [openDropdowns, setOpenDropdowns] = useState({
//     groups: false
//   });

//   const [users, setUsers] = useState([]);
//   const [groups, setGroups] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [filteredGroups, setFilteredGroups] = useState([]);

//   // רשימת הקבוצות לפילטר (רק שם ו-ID)
//   const [availableGroups, setAvailableGroups] = useState([]);

//   // פונקציה לקבלת רשימת הקבוצות מהשרת
//   const fetchGroups = async () => {
//     try {
//       setGroupsLoading(true);
      
//       // דמיון לבקשת שרת - החלף עם ה-API האמיתי שלך
//       const response = await fetch('/api/groups', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch groups');
//       }
      
//       const groupsData = await response.json();
      
//       // נתונים מדומים לדוגמה - החלף עם התגובה האמיתית מהשרת
//       const mockGroups = [
//         { id: 1, name: 'מפתחי React ישראל' },
//         { id: 2, name: 'מנהלי מוצר תל אביב' },
//         { id: 3, name: 'מעצבי UX/UI ירושלים' },
//         { id: 4, name: 'סטארט-אפ חיפה' },
//         { id: 5, name: 'מפתחי Python ישראל' },
//         { id: 6, name: 'DevOps ישראל' }
//       ];
      
//       setAvailableGroups(mockGroups);
      
//     } catch (error) {
//       console.error('Error fetching groups:', error);
//       alert('שגיאה בטעינת רשימת הקבוצות');
//     } finally {
//       setGroupsLoading(false);
//     }
//   };

//   // פונקציה לחיפוש משתמשים בשרת
//   const searchUsers = async () => {
//     try {
//       setLoading(true);
      
//       // הכנת פרמטרים לבקשה
//       const searchParams = {
//         searchText: searchText.trim(),
//         groupIds: checkboxFilters.groups // שולח את ה-IDs של הקבוצות שנבחרו
//       };
      
//       // בקשה לשרת
//       const response = await fetch('/api/users/search', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(searchParams),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to search users');
//       }
      
//       const usersData = await response.json();
      
//       // נתונים מדומים לדוגמה - החלף עם התגובה האמיתית מהשרת
//       const mockUsers = [
//         {
//           id: 1,
//           name: 'דוד כהן',
//           position: 'מפתח תוכנה בכיר',
//           company: 'טכנולוגיות אלפא',
//           location: 'תל אביב',
//           education: 'תואר ראשון',
//           experience: '5-7 שנים',
//           skills: ['React', 'Node.js', 'Python'],
//           industry: 'טכנולוגיה',
//           image: 'https://via.placeholder.com/100x100?text=דוד',
//           groups: [
//             { id: 1, name: 'מפתחי React ישראל' },
//             { id: 2, name: 'מנהלי מוצר תל אביב' }
//           ]
//         },
//         {
//           id: 2,
//           name: 'שרה לוי',
//           position: 'מנהלת מוצר',
//           company: 'סטארט-אפ חדשני',
//           location: 'חיפה',
//           education: 'תואר שני',
//           experience: '7-10 שנים',
//           skills: ['Product Management', 'UX', 'Analytics'],
//           industry: 'טכנולוגיה',
//           image: 'https://via.placeholder.com/100x100?text=שרה',
//           groups: [
//             { id: 2, name: 'מנהלי מוצר תל אביב' },
//             { id: 4, name: 'סטארט-אפ חיפה' }
//           ]
//         },
//         {
//           id: 3,
//           name: 'יוסף גרין',
//           position: 'מעצב UX/UI',
//           company: 'סטודיו עיצוב',
//           location: 'ירושלים',
//           education: 'תואר ראשון',
//           experience: '3-5 שנים',
//           skills: ['Figma', 'Adobe XD', 'Sketch'],
//           industry: 'עיצוב',
//           image: 'https://via.placeholder.com/100x100?text=יוסף',
//           groups: [
//             { id: 3, name: 'מעצבי UX/UI ירושלים' }
//           ]
//         }
//       ];
      
//       setUsers(mockUsers);
//       setFilteredUsers(mockUsers);
      
//     } catch (error) {
//       console.error('Error searching users:', error);
//       alert('שגיאה בחיפוש משתמשים');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // פונקציה לחיפוש קבוצות בשרת
//   const searchGroups = async () => {
//     try {
//       setLoading(true);
      
//       const searchParams = {
//         searchText: searchText.trim()
//       };
      
//       const response = await fetch('/api/groups/search', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(searchParams),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to search groups');
//       }
      
//       const groupsData = await response.json();
      
//       // נתונים מדומים לדוגמה
//       const mockGroupsResults = [
//         {
//           id: 1,
//           name: 'מפתחי React ישראל',
//           members: 1250,
//           category: 'טכנולוגיה',
//           description: 'קהילת מפתחי React הגדולה בישראל',
//           image: 'https://via.placeholder.com/150x100?text=React+IL',
//           tags: ['React', 'JavaScript', 'Frontend']
//         },
//         {
//           id: 2,
//           name: 'מנהלי מוצר תל אביב',
//           members: 850,
//           category: 'ניהול מוצר',
//           description: 'רשת מנהלי מוצר במרכז',
//           image: 'https://via.placeholder.com/150x100?text=PM+TLV',
//           tags: ['Product Management', 'Strategy', 'Analytics']
//         }
//       ];
      
//       setGroups(mockGroupsResults);
//       setFilteredGroups(mockGroupsResults);
      
//     } catch (error) {
//       console.error('Error searching groups:', error);
//       alert('שגיאה בחיפוש קבוצות');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // טעינת רשימת הקבוצות בטעינה ראשונית
//   useEffect(() => {
//     fetchGroups();
//   }, []);

//   const toggleDropdown = (category) => {
//     setOpenDropdowns(prev => ({
//       ...prev,
//       [category]: !prev[category]
//     }));
//   };

//   const handleCheckboxChange = (category, groupId) => {
//     const newCheckboxFilters = { ...checkboxFilters };
//     if (newCheckboxFilters[category].includes(groupId)) {
//       newCheckboxFilters[category] = newCheckboxFilters[category].filter(id => id !== groupId);
//     } else {
//       newCheckboxFilters[category].push(groupId);
//     }
//     setCheckboxFilters(newCheckboxFilters);
//   };

//   const handleSearchTextChange = (value) => {
//     setSearchText(value);
//   };

//   const handleSearch = () => {
//     if (searchMode === 'users') {
//       searchUsers();
//     } else {
//       searchGroups();
//     }
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       console.log('File uploaded:', file.name);
//       alert(`קובץ ${file.name} הועלה בהצלחה! (בפרויקט אמיתי כאן יהיה parsing של האקסל)`);
//     }
//   };

//   const clearFilters = () => {
//     setSearchText('');
//     setCheckboxFilters({
//       groups: []
//     });
//     setOpenDropdowns({
//       groups: false
//     });
//     setUsers([]);
//     setGroups([]);
//     setFilteredUsers([]);
//     setFilteredGroups([]);
//   };

//   // פונקציה לקבלת שמות הקבוצות הנבחרות
//   const getSelectedGroupNames = () => {
//     return checkboxFilters.groups.map(groupId => {
//       const group = availableGroups.find(g => g.id === groupId);
//       return group ? group.name : '';
//     }).filter(name => name);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
//           <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
//             חיפוש משתמשים וקבוצות
//           </h1>
//           <p className="text-center text-gray-600 text-lg">
//             מצא את האנשים והקבוצות המתאימים עבורך לפי שם ושייכות לקבוצות
//           </p>
//         </div>

//         {/* Search Mode Toggle */}
//         <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
//           <div className="flex justify-center mb-8">
//             <div className="flex bg-gray-100 rounded-full p-2">
//               <button
//                 onClick={() => setSearchMode('users')}
//                 className={`flex items-center px-6 py-3 rounded-full transition-all ${
//                   searchMode === 'users'
//                     ? 'bg-blue-500 text-white shadow-lg transform scale-105'
//                     : 'text-gray-600 hover:bg-gray-200'
//                 }`}
//               >
//                 <Users className="w-5 h-5 ml-2" />
//                 חיפוש משתמשים
//               </button>
//               <button
//                 onClick={() => setSearchMode('groups')}
//                 className={`flex items-center px-6 py-3 rounded-full transition-all ${
//                   searchMode === 'groups'
//                     ? 'bg-blue-500 text-white shadow-lg transform scale-105'
//                     : 'text-gray-600 hover:bg-gray-200'
//                 }`}
//               >
//                 <UserCheck className="w-5 h-5 ml-2" />
//                 חיפוש קבוצות
//               </button>
//             </div>
//           </div>

//           {/* Search Text Field */}
//           <div className="mb-6">
//             <div className="relative">
//               <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="חפש לפי שם..."
//                 value={searchText}
//                 onChange={(e) => handleSearchTextChange(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//                 className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-lg"
//               />
//             </div>
//           </div>

//           {/* Groups Filter */}
//           {searchMode === 'users' && (
//             <div className="bg-gray-50 rounded-2xl p-6 mb-8">
//               <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
//                 <Filter className="w-5 h-5 ml-2" />
//                 פילטר לפי קבוצות
//               </h3>
              
//               {groupsLoading ? (
//                 <div className="flex items-center justify-center py-4">
//                   <Loader2 className="w-6 h-6 animate-spin text-blue-500 ml-2" />
//                   <span className="text-gray-600">טוען קבוצות...</span>
//                 </div>
//               ) : (
//                 <div className="flex flex-wrap gap-4">
//                   {/* Groups Filter */}
//                   <div className="relative">
//                     <button
//                       onClick={() => toggleDropdown('groups')}
//                       className="flex items-center justify-between min-w-[200px] px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
//                     >
//                       <span className="flex items-center text-sm font-medium">
//                         <Users className="w-4 h-4 ml-2" />
//                         קבוצות {checkboxFilters.groups.length > 0 && `(${checkboxFilters.groups.length})`}
//                       </span>
//                       <ChevronDown className={`w-4 h-4 transition-transform ${openDropdowns.groups ? 'rotate-180' : ''}`} />
//                     </button>
//                     {openDropdowns.groups && (
//                       <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
//                         {availableGroups.map(group => (
//                           <label key={group.id} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
//                             <input
//                               type="checkbox"
//                               checked={checkboxFilters.groups.includes(group.id)}
//                               onChange={() => handleCheckboxChange('groups', group.id)}
//                               className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ml-2"
//                             />
//                             <span className="text-sm text-gray-700">{group.name}</span>
//                           </label>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Selected Groups Display */}
//               {checkboxFilters.groups.length > 0 && (
//                 <div className="mt-4">
//                   <p className="text-sm text-gray-600 mb-2">קבוצות נבחרות:</p>
//                   <div className="flex flex-wrap gap-2">
//                     {getSelectedGroupNames().map(groupName => (
//                       <span key={groupName} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//                         {groupName}
//                       </span>
//                     ))}
//                   </div>
//                   <p className="text-xs text-gray-500 mt-2">
//                     יחפש משתמשים שחברים בכל הקבוצות הנבחרות
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Search Button */}
//           <div className="flex justify-center gap-4 mb-8">
//             <button
//               onClick={clearFilters}
//               className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all transform hover:scale-105"
//             >
//               <Filter className="w-5 h-5 ml-2" />
//               נקה חיפוש
//             </button>
//             <button 
//               onClick={handleSearch}
//               disabled={loading}
//               className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <Loader2 className="w-5 h-5 ml-2 animate-spin" />
//               ) : (
//                 <Search className="w-5 h-5 ml-2" />
//               )}
//               {loading ? 'מחפש...' : 'חפש'}
//             </button>
//           </div>

//           {/* Users Results */}
//           {searchMode === 'users' && (
//             <div>
//               <h3 className="text-xl font-bold text-gray-800 mb-4">
//                 תוצאות חיפוש משתמשים ({filteredUsers.length})
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                 {filteredUsers.map(user => (
//                   <div key={user.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4">
//                     <div className="flex items-center mb-3">
//                       <img
//                         src={user.image}
//                         alt={user.name}
//                         className="w-12 h-12 rounded-full object-cover ml-3"
//                       />
//                       <div className="flex-1 min-w-0">
//                         <h3 className="font-bold text-sm text-gray-800 truncate">{user.name}</h3>
//                         <p className="text-blue-600 font-medium text-xs truncate">{user.position}</p>
//                       </div>
//                     </div>
//                     <div className="space-y-1 text-xs text-gray-600 mb-3">
//                       <p className="flex items-center truncate">
//                         <Briefcase className="w-3 h-3 ml-1 flex-shrink-0" />
//                         <span className="truncate">{user.company}</span>
//                       </p>
//                       <p className="flex items-center">
//                         <MapPin className="w-3 h-3 ml-1 flex-shrink-0" />
//                         <span>{user.location}</span>
//                       </p>
//                       <p className="flex items-center">
//                         <Calendar className="w-3 h-3 ml-1 flex-shrink-0" />
//                         <span>{user.experience}</span>
//                       </p>
//                     </div>
                    
//                     {/* Groups Display */}
//                     <div className="mb-3">
//                       <p className="text-xs text-gray-500 mb-1">קבוצות:</p>
//                       <div className="flex flex-wrap gap-1">
//                         {user.groups.slice(0, 2).map((group, index) => (
//                           <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
//                             {group.name}
//                           </span>
//                         ))}
//                         {user.groups.length > 2 && (
//                           <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
//                             +{user.groups.length - 2}
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     <div className="flex flex-wrap gap-1">
//                       {user.skills.slice(0, 2).map((skill, index) => (
//                         <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
//                           {skill}
//                         </span>
//                       ))}
//                       {user.skills.length > 2 && (
//                         <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
//                           +{user.skills.length - 2}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Groups Results */}
//           {searchMode === 'groups' && (
//             <div>
//               <h3 className="text-xl font-bold text-gray-800 mb-4">
//                 תוצאות חיפוש קבוצות ({filteredGroups.length})
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                 {filteredGroups.map(group => (
//                   <div key={group.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4">
//                     <div className="mb-3">
//                       <img
//                         src={group.image}
//                         alt={group.name}
//                         className="w-full h-24 object-cover rounded-lg mb-3"
//                       />
//                       <h3 className="font-bold text-sm text-gray-800 mb-1 line-clamp-2">{group.name}</h3>
//                       <p className="text-gray-600 text-xs mb-2 line-clamp-2">{group.description}</p>
//                     </div>
//                     <div className="space-y-1 text-xs text-gray-600 mb-3">
//                       <p className="flex items-center">
//                         <Users className="w-3 h-3 ml-1 flex-shrink-0" />
//                         <span>{group.members.toLocaleString()} חברים</span>
//                       </p>
//                       <p className="flex items-center">
//                         <Building className="w-3 h-3 ml-1 flex-shrink-0" />
//                         <span>{group.category}</span>
//                       </p>
//                     </div>
//                     <div className="flex flex-wrap gap-1 mb-3">
//                       {group.tags.slice(0, 2).map((tag, index) => (
//                         <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
//                           {tag}
//                         </span>
//                       ))}
//                       {group.tags.length > 2 && (
//                         <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
//                           +{group.tags.length - 2}
//                         </span>
//                       )}
//                     </div>
//                     <button className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-xs font-medium">
//                       הצטרף לקבוצה
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* File Upload Section */}
//         <div className="bg-white rounded-3xl shadow-xl p-8">
//           <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
//             העלאת קובץ אקסל
//           </h2>
//           <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-500 transition-colors">
//             <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
//             <p className="text-gray-600 mb-4">
//               גרור קובץ אקסל לכאן או לחץ לבחירת קובץ
//             </p>
//             <input
//               type="file"
//               accept=".xlsx,.xls"
//               onChange={handleFileUpload}
//               className="hidden"
//               id="excel-upload"
//             />
//             <label
//               htmlFor="excel-upload"
//               className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-xl cursor-pointer transition-all transform hover:scale-105"
//             >
//               <Upload className="w-5 h-5 ml-2" />
//               בחר קובץ אקסל
//             </label>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserSearchComponent;