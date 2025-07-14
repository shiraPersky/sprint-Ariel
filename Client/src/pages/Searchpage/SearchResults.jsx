// קומפוננט תוצאות חיפוש
import React from 'react';
import UserCard from './UserCard';
import GroupCard from './GroupCard';
const SearchResults = ({ searchMode, users, groups }) => (
  <>
    {searchMode === 'users' && (
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          תוצאות חיפוש משתמשים ({users.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {users.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    )}

    {searchMode === 'groups' && (
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          תוצאות חיפוש קבוצות ({groups.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {groups.map(group => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </div>
    )}
  </>
);

// קומפוננט העלאת קבצים
export default SearchResults;