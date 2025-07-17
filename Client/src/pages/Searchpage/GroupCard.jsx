// קומפוננט כרטיס קבוצה - עם כפתור עריכה ומחיקה
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2 } from "lucide-react";
import EditGroupModal from "./EditGroupModal";

const GroupCard = ({ group, onGroupUpdated, onGroupDeleted }) => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleClick = () => {
    console.log("Navigating to group:", group.id);
    navigate(`/group/${group.id_group}`, { state: { group } });
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent navigation
    setShowEditModal(true);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent navigation

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the group "${group.group_name}"?\n\nThis action cannot be undone and will delete all members in the group.`
    );

    if (confirmDelete) {
      handleDeleteGroup();
    }
  };

  const handleDeleteGroup = async () => {
    try {
      if (onGroupDeleted) {
        await onGroupDeleted(group.id_group);
      }
      alert(`The group "${group.group_name}" deleted successfully!`);
    } catch (error) {
      alert('Error deleting group');
      console.error('Error deleting group:', error);
    }
  };

  const handleUpdateGroup = async (groupId, newName) => {
    try {

      if (onGroupUpdated) {
        await onGroupUpdated(groupId, newName);
      }
      alert(`שם הקבוצה עודכן בהצלחה ל: "${newName}"`);
    } catch (error) {
      alert('שגיאה בעדכון שם הקבוצה');
      throw error;
    }
  };

  return (
    <>
      <div
        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-200 relative"
        onClick={handleClick}
      >
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          {/* Edit button */}
          <button
            onClick={handleEditClick}
            className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:bg-blue-50 border border-gray-200"
            title="עדכן שם קבוצה"
          >
            <Edit2 className="w-4 h-4 text-blue-600" />
          </button>

          {/*delete button */}
          <button
            onClick={handleDeleteClick}
            className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:bg-red-50 border border-gray-200"
            title="מחק קבוצה"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>

        <div className="text-center pt-8">
          <h3 className="font-bold text-lg text-gray-800 mb-4 break-words">
            {group.group_name}
          </h3>

        
        </div>
      </div>

     
      <EditGroupModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        group={group}
        onUpdateGroup={handleUpdateGroup}
      />
    </>
  );
};

export default GroupCard;