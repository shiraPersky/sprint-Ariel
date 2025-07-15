// קומפוננט תוצאות חיפוש - תיקון ID
import React from 'react';
import UserCard from './UserCard';
import GroupCard from './GroupCard';

const SearchResults = ({ searchMode, users, groups }) => {
  // הגנה על מערכים לא חוקיים
  const safeUsers = Array.isArray(users) ? users : [];
  const safeGroups = Array.isArray(groups) ? groups : [];
  
  return (
    <>
      {searchMode === 'users' && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Search results for users ({safeUsers.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {safeUsers.map(user => (
              <UserCard 
                key={user.id_community_member || user.id} 
                user={user} 
              />
            ))}
          </div>
        </div>
      )}

      {searchMode === 'groups' && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            תוצאות חיפוש קבוצות ({safeGroups.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {safeGroups.map(group => (
              <GroupCard 
                key={group.id_group || group.id} 
                group={group} 
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchResults;