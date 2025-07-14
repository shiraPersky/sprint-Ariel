// GroupDetailsPage.js - דף פרטי קבוצה עם רשימת חברים
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Building, Tag, Loader2 } from 'lucide-react';
import useServerRequestsMock from '../Searchpage/testcomp'; // או useServerRequests
import UserCard from '../Searchpage/UserCard';

const GroupDetailsPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(true);

  const { getGroupDetails, getGroupMembers } = useServerRequestsMock();

  useEffect(() => {
    const loadGroupData = async () => {
      try {
        console.log('🔄 Loading group data for ID:', groupId);
        
        // טען פרטי קבוצה וחברים במקביל
        const [groupDetails, groupMembers] = await Promise.all([
          getGroupDetails(groupId),
          getGroupMembers(groupId)
        ]);
        
        setGroup(groupDetails);
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
    navigate(`/member/${user.id}/data/`);
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
          className="flex items-center mb-6 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <ArrowRight className="w-5 h-5 ml-2" />
          חזרה לחיפוש
        </button>

        {/* כותרת הקבוצה */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            
            {/* תמונת הקבוצה */}
            <div className="flex-shrink-0">
              <img
                src={group.image}
                alt={group.name}
                className="w-32 h-24 object-cover rounded-xl shadow-md"
              />
            </div>
            
            {/* פרטי הקבוצה */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{group.name}</h1>
              <p className="text-gray-600 text-lg mb-4">{group.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 ml-2" />
                  <span>{group.members.toLocaleString()} חברים</span>
                </div>
                <div className="flex items-center">
                  <Building className="w-4 h-4 ml-2" />
                  <span>{group.category}</span>
                </div>
              </div>
              
              {/* תגיות */}
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <Tag className="w-4 h-4 ml-2" />
                  <span className="text-sm font-medium text-gray-700">תגיות:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* כפתור הצטרפות */}
            <div className="flex-shrink-0">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-medium">
                הצטרף לקבוצה
              </button>
            </div>
          </div>
        </div>

        {/* רשימת חברי הקבוצה */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              חברי הקבוצה ({members.length})
            </h2>
            
            {membersLoading && (
              <div className="flex items-center">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500 ml-2" />
                <span className="text-gray-600">טוען חברים...</span>
              </div>
            )}
          </div>

          {/* רשת החברים */}
          {members.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {members.map(member => (
                <div key={member.id} onClick={() => handleUserClick(member)}>
                  <UserCard user={member} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">אין חברים בקבוצה זו כרגע</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsPage;