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
    e.stopPropagation(); // מונע את הניווט
    setShowEditModal(true);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // מונע את הניווט
    
    const confirmDelete = window.confirm(
      `האם אתה בטוח שברצונך למחוק את הקבוצה "${group.group_name}"?\n\nפעולה זו לא ניתנת לביטול ותמחק את כל החברות בקבוצה.`
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
      alert(`הקבוצה "${group.group_name}" נמחקה בהצלחה!`);
    } catch (error) {
      alert('שגיאה במחיקת הקבוצה');
      console.error('Error deleting group:', error);
    }
  };

  const handleUpdateGroup = async (groupId, newName) => {
    try {
      // קרא לפונקציה מהקומפוננט ההורה
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
        {/* כפתורי עריכה ומחיקה - ברמה הגבוהה ביותר */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          {/* כפתור עריכה */}
          <button
            onClick={handleEditClick}
            className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:bg-blue-50 border border-gray-200"
            title="עדכן שם קבוצה"
          >
            <Edit2 className="w-4 h-4 text-blue-600" />
          </button>

          {/* כפתור מחיקה */}
          <button
            onClick={handleDeleteClick}
            className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:bg-red-50 border border-gray-200"
            title="מחק קבוצה"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>

        {/* תוכן הכרטיס עם מרווח מלמעלה */}
        <div className="text-center pt-8">
          <h3 className="font-bold text-lg text-gray-800 mb-4 break-words">
            {group.group_name}
          </h3>

          {/* <button 
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium"
            onClick={(e) => {
              e.stopPropagation(); // מונע את הניווט כשלוחצים על הכפתור
              alert('הצטרפות לקבוצה - יתווסף בעתיד');
            }}
          >
            הצטרף לקבוצה
          </button> */}
        </div>
      </div>

      {/* Modal עדכון שם */}
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