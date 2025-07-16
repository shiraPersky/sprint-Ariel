// קומפוננט Dropdown לקבוצות
import React from "react";
import { Users, ChevronDown, Loader2 } from "lucide-react";

const GroupsDropdown = ({
  availableGroups,
  selectedGroups,
  onGroupChange,
  isOpen,
  toggleOpen,
  loading,
}) => (
  <div className="relative">
    <button
      onClick={toggleOpen}
      className="flex items-center justify-between min-w-[200px] px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
      disabled={loading}
    >
      <span className="flex items-center text-sm font-medium">
        <Users className="w-4 h-4 ml-2" />
        קבוצות {selectedGroups.length > 0 && `(${selectedGroups.length})`}
      </span>
      <ChevronDown
        className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
    {isOpen && (
      <div className="absolute top-full left-0 mt-1 w-full min-w-[250px] bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            <span className="text-xs text-gray-600 mr-2">טוען...</span>
          </div>
        ) : (
          availableGroups.map((group) => (
            <label
              key={group.id_group}
              className="flex items-center px-3 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 w-full"
            >
              <input
                type="checkbox"
                checked={selectedGroups.includes(group.id_group)}
                onChange={() => onGroupChange(group.id_group)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ml-2 flex-shrink-0"
              />
              <span className="text-sm text-gray-700 flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                {group.group_name}
              </span>
            </label>
          ))
        )}
      </div>
    )}
  </div>
);

export default GroupsDropdown;