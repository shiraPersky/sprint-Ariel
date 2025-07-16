// GroupDetailsPage.js - דף פרטי קבוצה עם רשימת חברים - עם קריאת API אמיתית
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate,useLocation } from 'react-router-dom';
import {  Users, Building, Tag, Loader2, UserPlus, UserMinus, Trash2, X, ArrowLeft } from 'lucide-react';
import useServerRequestsMock from '../Searchpage/testcomp'; // או useServerRequests
import UserCard from '../Searchpage/UserCard';
import AddUsersModal from './AddUsersModal';
const GroupDetailsPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(true);
  const [showAddUsersModal, setShowAddUsersModal] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const location = useLocation();
  const groupdata = location.state?.group; // מקבל את האובייקט שהועבר
  const { 
    // getGroupDetails, 
    getAvailableUsersForGroup, 
    addUsersToGroup,
    removeUsersFromGroup,
  } = useServerRequestsMock();

  // פונקציה לטעינת חברי הקבוצה מהשרת
  const getGroupMembers = async (groupId) => {
    try {
      console.log('🔄 Fetching group members for group:', groupId);
      
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
      console.log('✅ Group members API Response:', result);

      if (result.success) {
        // המר את הנתונים מהשרת לפורמט שהקומפוננט מצפה לו
        const formattedMembers = result.data.map(memberData => {
          const member = memberData.member;
          return {
            id: member.id_community_member,
            english_name: member.english_name,
            position: member.title,
            company: member.about, // או שדה אחר שמתאים לחברה
            email: member.email,
            phone: member.phone,
            city: member.city,
            linkedin_url: member.linkedin_url,
            facebook_url: member.facebook_url,
            additional_info: member.additional_info,
            years_of_experience: member.years_of_experience,
            wants_updates: member.wants_updates,
            active: member.active,
            admin_notes: member.admin_notes,
            community_value_id: member.community_value_id,
            // שדות נוספים לתצוגה טובה יותר
            image: member.image || '/api/placeholder/400/400', // תמונת ברירת מחדל
            description: member.additional_info || member.about
          };
        });

        console.log('✅ Formatted members:', formattedMembers);
        return formattedMembers;
      } else {
        console.error('❌ API returned error:', result);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching group members:', error);
      throw error;
    }
  };

  const handleUsersAdded = async () => {
    try {
      setMembersLoading(true);
      const updatedMembers = await getGroupMembers(groupId);
      setMembers(updatedMembers);
    } catch (error) {
      console.error('Error reloading members:', error);
      alert('שגיאה בטעינת רשימת החברים המעודכנת');
    } finally {
      setMembersLoading(false);
    }
  };

  useEffect(() => {
    const loadGroupData = async () => {
      try {
        console.log('🔄 Loading group data for ID:', groupId);
        
        // טען פרטי קבוצה וחברים במקביל
        const [ groupMembers] = await Promise.all([
          // getGroupDetails(groupId),
          getGroupMembers(groupId)
        ]);
        console.log('✅ Group data loaded:', groupdata);
        setGroup(groupdata);
        setMembers(groupMembers);
        
      } catch (error) {
        console.error('Error loading group data:', error);
        alert('שגיאה בטעינת נתוני הקבוצה');
      } finally {
        setLoading(false);
        setMembersLoading(false);
      }
    };

    if (groupId) {
      loadGroupData();
    }
  }, [groupId]);

  const handleUserClick = (user) => {
    if (deleteMode) {
      // במצב מחיקה - הוסף/הסר משתמש מרשימת המחיקה
      setSelectedForDeletion(prev => 
        prev.includes(user.id)
          ? prev.filter(id => id !== user.id)
          : [...prev, user.id]
      );
    } else {
      // במצב רגיל - עבור לדף המשתמש
      navigate(`/member/${user.id}/data`);
    }
  };

  // הפעלת מצב מחיקה
  const enterDeleteMode = () => {
    setDeleteMode(true);
    setSelectedForDeletion([]);
  };

  // יציאה ממצב מחיקה
  const exitDeleteMode = () => {
    setDeleteMode(false);
    setSelectedForDeletion([]);
  };

  // מחיקת משתמשים נבחרים
  const handleDeleteUsers = async () => {
    if (selectedForDeletion.length === 0) {
      alert('אנא בחר לפחות משתמש אחד למחיקה');
      return;
    }

    const confirmDelete = window.confirm(
      `האם אתה בטוח שברצונך להסיר ${selectedForDeletion.length} משתמשים מהקבוצה?`
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);
      console.log('🗑️ Removing users from group:', { groupId, selectedForDeletion });
      
      const result = await removeUsersFromGroup(groupId, selectedForDeletion);
      
      if (result && result.success) {
        const count = result.removedCount || selectedForDeletion.length;
        alert(`${count} משתמשים הוסרו בהצלחה מהקבוצה!`);
        
        // עדכן את רשימת החברים
        await handleUsersAdded();
        
        // צא ממצב מחיקה
        exitDeleteMode();
      } else {
        const errorMsg = result?.error || 'שגיאה לא ידועה';
        alert('שגיאה בהסרת משתמשים: ' + errorMsg);
      }
    } catch (error) {
      console.error('❌ Error removing users:', error);
      alert('שגיאה בהסרת משתמשים מהקבוצה');
    } finally {
      setDeleting(false);
    }
  };

  // בחירת כל המשתמשים למחיקה
  const selectAllForDeletion = () => {
    setSelectedForDeletion(members.map(member => member.id));
  };

  // ביטול בחירת כל המשתמשים
  const selectNoneForDeletion = () => {
    setSelectedForDeletion([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-lg text-gray-600">טוען פרטי קבוצה...</span>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">קבוצה לא נמצאה</h2>
          <button
            onClick={() => navigate('/UserSearch')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            חזרה לחיפוש
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* כפתור חזרה */}
        <button
          onClick={() => navigate('/UserSearch')}
          className="flex items-center mb-6 px-4 py-2  rounded-lg shadow hover:bg-gray-200 transition-shadow"
        >
          <ArrowLeft className="w-5 h-5 ml-2" />
         
        </button>

        {/* כותרת הקבוצה */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            
            {/* תמונת הקבוצה */}
            <div className="flex-shrink-0">
              <img
                src={group.image}
                // alt={group.group_name}
                className="w-32 h-24 object-cover rounded-xl shadow-md"
              />
            </div>
            
            {/* פרטי הקבוצה */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{group.group_name}</h1>
              {/* <p className="text-gray-600 text-lg mb-4">{group.description}</p> */}
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                   <Users className="w-4 h-4 mr-2" />
                  <span> Friends: {members.length}  </span>
                </div>
                {/* <div className="flex items-center">
                  <Building className="w-4 h-4 ml-2" />
                  <span>{group.category}</span>
                </div> */}
              </div>
              
              {/* תגיות */}
              {/* <div className="mt-4">
                <div className="flex items-center mb-2">
                  <Tag className="w-4 h-4 ml-2" />
                  <span className="text-sm font-medium text-gray-700">תגיות:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.tags && group.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* רשימת חברי הקבוצה */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
             Community members ({members.length})
            </h2>
            
            <div className="flex items-center gap-4">
              {membersLoading && (
                <div className="flex items-center">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500 ml-2" />
                  <span className="text-gray-600">טוען חברים...</span>
                </div>
              )}
              
              {/* כפתורי ניהול משתמשים */}
              {!deleteMode ? (
                <>
                  {/* כפתור הוספת משתמשים */}
                  <button
  onClick={() => setShowAddUsersModal(true)}
  className="flex items-center justify-center p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all"
  disabled={loading}
>
  <UserPlus className="w-5 h-5" />
</button>


                  
                  {/* כפתור מחיקת משתמשים */}
                  <button
  onClick={enterDeleteMode}
  className="flex items-center justify-center p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
  disabled={loading || members.length === 0}
>
  <UserMinus className="w-5 h-5" />
</button>


                </>
              ) : (
                <>
                  {/* כפתורים במצב מחיקה */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      נבחרו {selectedForDeletion.length} משתמשים
                    </span>
                    
                    <button
                      onClick={selectAllForDeletion}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                      disabled={deleting}
                    >
                      בחר הכל
                    </button>
                    
                    <button
                      onClick={selectNoneForDeletion}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                      disabled={deleting || selectedForDeletion.length === 0}
                    >
                      בטל בחירה
                    </button>
                  </div>
                  
                  <button
                    onClick={handleDeleteUsers}
                    disabled={selectedForDeletion.length === 0 || deleting}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin ml-2" />
                        מוחק...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5 ml-2" />
                        מחק ({selectedForDeletion.length})
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={exitDeleteMode}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                    disabled={deleting}
                  >
                    <X className="w-5 h-5 ml-2" />
                    בטל
                  </button>
                </>
              )}
            </div>
          </div>

          {/* הודעה במצב מחיקה */}
          {deleteMode && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                <strong>מצב מחיקה:</strong> לחץ על משתמשים כדי לבחור אותם למחיקה מהקבוצה
              </p>
            </div>
          )}

          {/* רשת החברים */}
          {members.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {members.map(member => {
                const isSelectedForDeletion = selectedForDeletion.includes(member.id);
                return (
                  <div 
                    key={member.id} 
                    onClick={() => handleUserClick(member)}
                    className={`relative ${deleteMode ? 'cursor-pointer' : ''} ${
                      isSelectedForDeletion ? 'ring-4 ring-red-500 ring-opacity-50' : ''
                    }`}
                  >
                    {/* אינדיקטור בחירה למחיקה */}
                    {deleteMode && (
                      <div className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelectedForDeletion 
                          ? 'bg-red-500 border-red-500' 
                          : 'bg-white border-gray-300'
                      }`}>
                        {isSelectedForDeletion && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    )}
                    
                    {/* כרטיס המשתמש */}
                    <div className={`${deleteMode ? 'pointer-events-none' : ''} ${
                      isSelectedForDeletion ? 'opacity-75' : ''
                    }`}>
                      <UserCard user={member} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">אין חברים בקבוצה זו כרגע</p>
              <button
                onClick={() => setShowAddUsersModal(true)}
                className="mt-4 flex items-center mx-auto px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all"
              >
                <UserPlus className="w-5 h-5 ml-2" />
                הוסף משתמשים ראשונים
              </button>
            </div>
          )}
        </div>

        {/* מודל הוספת משתמשים */}
        <AddUsersModal
          isOpen={showAddUsersModal}
          onClose={() => setShowAddUsersModal(false)}
          groupId={groupId}
          groupName={group?.name}
          addUsersToGroup={addUsersToGroup}
          onUsersAdded={handleUsersAdded}
        />
      </div>
    </div>
  );
};

export default GroupDetailsPage;