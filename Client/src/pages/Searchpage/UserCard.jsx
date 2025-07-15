// קומפוננט כרטיס משתמש - מתוקן עם ניווט
import React from 'react';
import { Briefcase, MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserCard = ({ user }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    console.log('Navigating to user:', user.id);
    navigate(`/member/${user.id}/data/`);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer" 
      onClick={handleClick}
    >
      <div className="flex items-center mb-3">
        <img
          src={user.image}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover ml-3"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-gray-800 truncate">{user.name}</h3>
          <p className="text-blue-600 font-medium text-xs truncate">{user.position}</p>
        </div>
      </div>
      <div className="space-y-1 text-xs text-gray-600 mb-3">
        <p className="flex items-center truncate">
          <Briefcase className="w-3 h-3 ml-1 flex-shrink-0" />
          <span className="truncate">{user.company}</span>
        </p>
        <p className="flex items-center">
          <MapPin className="w-3 h-3 ml-1 flex-shrink-0" />
          <span>{user.location}</span>
        </p>
        <p className="flex items-center">
          <Calendar className="w-3 h-3 ml-1 flex-shrink-0" />
          <span>{user.experience}</span>
        </p>
      </div>
      
      {/* Groups Display */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-1">קבוצות:</p>
        <div className="flex flex-wrap gap-1">
          {user.groups.slice(0, 2).map((group, index) => (
            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              {group.name}
            </span>
          ))}
          {user.groups.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              +{user.groups.length - 2}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {user.skills.slice(0, 2).map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {skill}
          </span>
        ))}
        {user.skills.length > 2 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
            +{user.skills.length - 2}
          </span>
        )}
      </div>
    </div>
  );
};

export default UserCard;