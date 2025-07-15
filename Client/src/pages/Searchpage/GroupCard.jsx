// קומפוננט כרטיס קבוצה - פשוט עם שם בלבד
import React from 'react';
import { useNavigate } from 'react-router-dom';

const GroupCard = ({ group }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    console.log('Navigating to group:', group.id);
    navigate(`/group/${group.id}`);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-200"
      onClick={handleClick}
    >
      <div className="text-center">
        <h3 className="font-bold text-lg text-gray-800 mb-4">
          {group.name}
        </h3>
        
        {/* <button 
          className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium"
          onClick={(e) => {
            e.stopPropagation(); // מונע את הניווט כשלוחצים על הכפתור
            alert('הצטרפות לקבוצה - יתווסף בעתיד');
          }}
        >
          הצטרף לקבוצה
        </button> */}
      </div>
    </div>
  );
};

export default GroupCard;