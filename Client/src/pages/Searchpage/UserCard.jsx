// קומפוננט כרטיס משתמש - מתוקן עם ניווט ומותאם לנתונים מהשרת
import React from 'react';
import { Briefcase, MapPin, Calendar, Phone, Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserCard = ({ user }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    console.log('Navigating to user:', user.id_community_member);
    navigate(`/member/${user.id_community_member}/data/`);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer" 
      onClick={handleClick}
    >
      <div className="flex items-center mb-3">
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center ml-3">
          <User className="w-6 h-6 text-gray-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-gray-800 truncate">{user.english_name}</h3>
          <p className="text-blue-600 font-medium text-xs truncate">{user.title}</p>
        </div>
      </div>
      
      <div className="space-y-1 text-xs text-gray-600 mb-3">
        <p className="flex items-center truncate">
          <MapPin className="w-3 h-3 ml-1 flex-shrink-0" />
          <span>{user.city}</span>
        </p>
        
        {user.phone && (
          <p className="flex items-center">
            <Phone className="w-3 h-3 ml-1 flex-shrink-0" />
            <span>{user.phone}</span>
          </p>
        )}
        
        {user.email && (
          <p className="flex items-center truncate">
            <Mail className="w-3 h-3 ml-1 flex-shrink-0" />
            <span className="truncate">{user.email}</span>
          </p>
        )}
        
        {user.years_of_experience && (
          <p className="flex items-center">
            <Calendar className="w-3 h-3 ml-1 flex-shrink-0" />
            <span>{user.years_of_experience} שנות ניסיון</span>
          </p>
        )}
      </div>
      
      {/* About Section */}
      {user.about && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">אודות:</p>
          <p className="text-xs text-gray-700 line-clamp-2">{user.about}</p>
        </div>
      )}

      {/* Links Section */}
      <div className="flex flex-wrap gap-1 mt-3">
        {user.linkedin_url && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            LinkedIn
          </span>
        )}
        {user.facebook_url && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            Facebook
          </span>
        )}
        {user.wants_updates && (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            מעוניין בעדכונים
          </span>
        )}
      </div>
    </div>
  );
};

export default UserCard;