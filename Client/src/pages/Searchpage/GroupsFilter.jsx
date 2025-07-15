    // קומפוננט פילטר קבוצות
import React from 'react';
import { Filter, Loader2 } from 'lucide-react';
import GroupsDropdown from './GroupsDropdown';
    const GroupsFilter = ({ 
  availableGroups, 
  selectedGroups, 
  onGroupChange, 
  getSelectedGroupNames,
  groupsLoading,
  isOpen,
  toggleOpen
}) => (
  <div className="bg-gray-50 rounded-2xl p-6 mb-8">
    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
      <Filter className="w-5 h-5 ml-2" />
      Filter by Groups
    </h3>
    
    {groupsLoading ? (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500 ml-2" />
        <span className="text-gray-600">טוען קבוצות...</span>
      </div>
    ) : (
      <div className="flex flex-wrap gap-4">
        <GroupsDropdown 
          availableGroups={availableGroups}
          selectedGroups={selectedGroups}
          onGroupChange={onGroupChange}
          isOpen={isOpen}
          toggleOpen={toggleOpen}
          loading={groupsLoading}
        />
      </div>
    )}

    {selectedGroups.length > 0 && (
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">Selected groups:</p>
        <div className="flex flex-wrap gap-2">
          {getSelectedGroupNames().map(groupName => (
            <span key={groupName} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {groupName}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Will search for users who are members of all selected groups.
        </p>
      </div>
    )}
  </div>
);
export default GroupsFilter;