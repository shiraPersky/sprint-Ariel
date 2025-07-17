import React from 'react';
import { Users, UserPlus } from 'lucide-react';
import UserCard from '../Searchpage/UserCard';

/**
 * MembersGrid Component
 * Displays grid of member cards with selection functionality
 * @param {Array} members - Array of member objects
 * @param {boolean} deleteMode - Whether delete mode is active
 * @param {Array} selectedForDeletion - Array of selected member IDs
 * @param {Function} onUserClick - Handler for user card clicks
 * @param {Function} onAddUsers - Handler for add users action
 */
function MembersGrid({ members, deleteMode, selectedForDeletion, onUserClick, onAddUsers }) {
  if (members.length === 0) {
    return <EmptyMembersState onAddUsers={onAddUsers} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {members.map(member => {
        const isSelectedForDeletion = selectedForDeletion.includes(member.id);
        return (
          <MemberCard
            key={member.id}
            member={member}
            deleteMode={deleteMode}
            isSelected={isSelectedForDeletion}
            onUserClick={onUserClick}
          />
        );
      })}
    </div>
  );
}

/**
 * MemberCard Component
 * Individual member card with selection state
 * @param {Object} member - Member data
 * @param {boolean} deleteMode - Whether delete mode is active
 * @param {boolean} isSelected - Whether this member is selected for deletion
 * @param {Function} onUserClick - Handler for card clicks
 */
function MemberCard({ member, deleteMode, isSelected, onUserClick }) {
  return (
    <div 
      onClick={() => onUserClick(member)}
      className={`relative ${deleteMode ? 'cursor-pointer' : ''} ${
        isSelected ? 'ring-4 ring-red-500 ring-opacity-50' : ''
      }`}
    >
      {deleteMode && (
        <SelectionCheckbox isSelected={isSelected} />
      )}
      
      <div className={`${deleteMode ? 'pointer-events-none' : ''} ${
        isSelected ? 'opacity-75' : ''
      }`}>
        <UserCard user={member} />
      </div>
    </div>
  );
}

/**
 * SelectionCheckbox Component
 * Checkbox overlay for member selection in delete mode
 * @param {boolean} isSelected - Whether the item is selected
 */
function SelectionCheckbox({ isSelected }) {
  return (
    <div className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
      isSelected 
        ? 'bg-red-500 border-red-500' 
        : 'bg-white border-gray-300'
    }`}>
      {isSelected && (
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </div>
  );
}

/**
 * EmptyMembersState Component
 * Displayed when no members are in the group
 * @param {Function} onAddUsers - Handler for add users action
 */
function EmptyMembersState({ onAddUsers }) {
  return (
    <div className="text-center py-12">
      <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-500 text-lg">No members in this group yet</p>
      <button
        onClick={onAddUsers}
        className="mt-4 flex items-center mx-auto px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all"
      >
        <UserPlus className="w-5 h-5 mr-2" />
        Add First Members
      </button>
    </div>
  );
}

export default MembersGrid;