// קומפוננט כרטיס קבוצה - מעודכן עם ניווט
import React from 'react';
import { Users, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GroupCard = ({ group }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    console.log('Navigating to group:', group.id);
    navigate(`/group/${group.id}`);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer"
      onClick={handleClick}
    >
      <div className="mb-3">
        <img
          src={group.image}
          alt={group.name}
          className="w-full h-24 object-cover rounded-lg mb-3"
        />
        <h3 className="font-bold text-sm text-gray-800 mb-1 line-clamp-2">{group.name}</h3>
        <p className="text-gray-600 text-xs mb-2 line-clamp-2">{group.description}</p>
      </div>
      <div className="space-y-1 text-xs text-gray-600 mb-3">
        <p className="flex items-center">
          <Users className="w-3 h-3 ml-1 flex-shrink-0" />
          <span>{group.members.toLocaleString()} חברים</span>
        </p>
        <p className="flex items-center">
          <Building className="w-3 h-3 ml-1 flex-shrink-0" />
          <span>{group.category}</span>
        </p>
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {group.tags.slice(0, 2).map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            {tag}
          </span>
        ))}
        {group.tags.length > 2 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
            +{group.tags.length - 2}
          </span>
        )}
      </div>
      {/* <button 
        className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-xs font-medium"
        onClick={(e) => {
          e.stopPropagation(); // מונע את הניווט כשלוחצים על הכפתור
          alert('הצטרפות לקבוצה - יתווסף בעתיד');
        }}
      >
        הצטרף לקבוצה
      </button> */}
    </div>
  );
};

export default GroupCard;