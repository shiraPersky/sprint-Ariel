import React, { useState } from "react";
import { X, Check, Loader2 } from "lucide-react";

const EditGroupModal = ({ isOpen, onClose, group, onUpdateGroup }) => {
  const [newGroupName, setNewGroupName] = useState(group?.group_name || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    console.log('🚀 Submitting group name update:', newGroupName);
    e.preventDefault();
    if (newGroupName.trim() && newGroupName.trim() !== group.group_name) {
      setLoading(true);
      try {
        await onUpdateGroup(group.id_group, newGroupName.trim());
        onClose();
      } catch (error) {
        console.error('Error updating group:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  React.useEffect(() => {
    if (group) {
      setNewGroupName(group.group_name);
    }
  }, [group]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Update Group Name</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Group Name *
            </label>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter new group name..."
              required
              disabled={loading}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
              disabled={loading}
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={loading || !newGroupName.trim() || newGroupName.trim() === group.group_name}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin inline ml-2" />
                  מעדכן...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 inline ml-2" />
                  עדכן
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGroupModal;