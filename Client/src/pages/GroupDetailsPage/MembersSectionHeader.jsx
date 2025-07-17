import React from 'react';
import { Loader2, UserPlus, UserMinus, Trash2, X } from 'lucide-react';

/**
 * MembersSectionHeader Component
 * Header for the members section with action buttons and controls
 * @param {number} memberCount - Number of members
 * @param {boolean} membersLoading - Loading state for members
 * @param {boolean} deleteMode - Whether delete mode is active
 * @param {Array} selectedForDeletion - Array of selected member IDs
 * @param {boolean} deleting - Whether deletion is in progress
 * @param {Function} onAddUsers - Handler for add users action
 * @param {Function} onEnterDeleteMode - Handler to enter delete mode
 * @param {Function} onExitDeleteMode - Handler to exit delete mode
 * @param {Function} onSelectAll - Handler to select all members
 * @param {Function} onSelectNone - Handler to clear selection
 * @param {Function} onDeleteUsers - Handler to delete selected users
 * @param {boolean} loading - General loading state
 */
function MembersSectionHeader({
  memberCount,
  membersLoading,
  deleteMode,
  selectedForDeletion,
  deleting,
  onAddUsers,
  onEnterDeleteMode,
  onExitDeleteMode,
  onSelectAll,
  onSelectNone,
  onDeleteUsers,
  loading
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Community Members ({memberCount})
      </h2>
      
      <div className="flex items-center gap-4">
        {membersLoading && (
          <div className="flex items-center">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500 mr-2" />
            <span className="text-gray-600">Loading members...</span>
          </div>
        )}
        
        {!deleteMode ? (
          <NormalModeButtons
            onAddUsers={onAddUsers}
            onEnterDeleteMode={onEnterDeleteMode}
            loading={loading}
            memberCount={memberCount}
          />
        ) : (
          <DeleteModeButtons
            selectedCount={selectedForDeletion.length}
            deleting={deleting}
            onSelectAll={onSelectAll}
            onSelectNone={onSelectNone}
            onDeleteUsers={onDeleteUsers}
            onExitDeleteMode={onExitDeleteMode}
          />
        )}
      </div>
    </div>
  );
}

/**
 * NormalModeButtons Component
 * Buttons displayed in normal mode (add/delete mode toggle)
 */
function NormalModeButtons({ onAddUsers, onEnterDeleteMode, loading, memberCount }) {
  return (
    <>
      <button
        onClick={onAddUsers}
        className="flex items-center justify-center p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all"
        disabled={loading}
        title="Add Users"
      >
        <UserPlus className="w-5 h-5" />
      </button>

      <button
        onClick={onEnterDeleteMode}
        className="flex items-center justify-center p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
        disabled={loading || memberCount === 0}
        title="Remove Users"
      >
        <UserMinus className="w-5 h-5" />
      </button>
    </>
  );
}

/**
 * DeleteModeButtons Component
 * Buttons and controls displayed in delete mode
 */
function DeleteModeButtons({
  selectedCount,
  deleting,
  onSelectAll,
  onSelectNone,
  onDeleteUsers,
  onExitDeleteMode
}) {
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          Selected {selectedCount} users
        </span>
        
        <button
          onClick={onSelectAll}
          className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
          disabled={deleting}
        >
          Select All
        </button>
        
        <button
          onClick={onSelectNone}
          className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
          disabled={deleting || selectedCount === 0}
        >
          Clear Selection
        </button>
      </div>
      
      <button
        onClick={onDeleteUsers}
        disabled={selectedCount === 0 || deleting}
        className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {deleting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Deleting...
          </>
        ) : (
          <>
            <Trash2 className="w-5 h-5 mr-2" />
            Delete ({selectedCount})
          </>
        )}
      </button>
      
      <button
        onClick={onExitDeleteMode}
        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
        disabled={deleting}
      >
        <X className="w-5 h-5 mr-2" />
        Cancel
      </button>
    </>
  );
}

export default MembersSectionHeader;