// AddUsersModal.js - מודל להוספת משתמשים לקבוצה - מתוקן
import React, { useState, useEffect } from 'react';
import { X, Plus, Search, Loader2, UserPlus, Check } from 'lucide-react';

const AddUsersModal = ({ 
  isOpen, 
  onClose, 
  groupId, 
  groupName, 
  getAvailableUsers, 
  addUsersToGroup,
  onUsersAdded 
}) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [searchText, setSearchText] = useState('');

  // טען משתמשים זמינים כשהמודל נפתח
  useEffect(() => {
    if (isOpen && groupId && getAvailableUsers) {
      loadAvailableUsers();
    }
  }, [isOpen, groupId, getAvailableUsers]);

  const loadAvailableUsers = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading available users for group:', groupId);
      
      const users = await getAvailableUsers(groupId);
      console.log('✅ Available users loaded:', users);
      
      setAvailableUsers(users || []);
    } catch (error) {
      console.error('❌ Error loading available users:', error);
      setAvailableUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // פילטר משתמשים לפי חיפוש
  const filteredUsers = availableUsers.filter(user => {
    if (!searchText.trim()) return true;
    
    const searchLower = searchText.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.position?.toLowerCase().includes(searchLower) ||
      user.company?.toLowerCase().includes(searchLower)
    );
  });

  // טיפול בבחירת/ביטול בחירת משתמש
  const handleUserToggle = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // בחירת כל המשתמשים המסוננים
  const selectAll = () => {
    const allFilteredIds = filteredUsers.map(user => user.id);
    setSelectedUsers(prev => {
      // הוסף רק IDs שלא כבר נבחרו
      const newIds = allFilteredIds.filter(id => !prev.includes(id));
      return [...prev, ...newIds];
    });
  };

  // ביטול בחירת כל המשתמשים המסוננים
  const selectNone = () => {
    const filteredIds = filteredUsers.map(user => user.id);
    setSelectedUsers(prev => prev.filter(id => !filteredIds.includes(id)));
  };

  // הוספת המשתמשים הנבחרים לקבוצה
  const handleAddUsers = async () => {
    if (selectedUsers.length === 0) {
      alert('אנא בחר לפחות משתמש אחד');
      return;
    }

    if (!addUsersToGroup) {
      alert('שגיאה: פונקציית הוספה לא זמינה');
      return;
    }

    try {
      setAdding(true);
      console.log('➕ Adding users to group:', { groupId, selectedUsers });
      
      const result = await addUsersToGroup(groupId, selectedUsers);
      console.log('✅ Add users result:', result);
      
      if (result && result.success) {
        const count = result.addedCount || selectedUsers.length;
        alert(`${count} משתמשים נוספו בהצלחה לקבוצה!`);
        
        // עדכן את רשימת החברים בדף הקבוצה
        if (onUsersAdded) {
          await onUsersAdded();
        }
        
        // סגור את המודל ונקה את הבחירות
        handleClose();
      } else {
        const errorMsg = result?.error || 'שגיאה לא ידועה';
        alert('שגיאה בהוספת משתמשים: ' + errorMsg);
      }
    } catch (error) {
      console.error('❌ Error adding users:', error);
      alert('שגיאה בהוספת משתמשים לקבוצה');
    } finally {
      setAdding(false);
    }
  };

  // איפוס בסגירת המודל
  const handleClose = () => {
    setSelectedUsers([]);
    setSearchText('');
    setAvailableUsers([]);
    onClose();
  };

  // הצג רק אם המודל פתוח
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        
        {/* כותרת המודל */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">הוסף משתמשים לקבוצה</h2>
            <p className="text-gray-600">{groupName || 'קבוצה'}</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* כפתור הוספה מהיר */}
            <button
              onClick={handleAddUsers}
              disabled={selectedUsers.length === 0 || adding || !addUsersToGroup}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  מוסיף...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 ml-2" />
                  הוסף ({selectedUsers.length})
                </>
              )}
            </button>
            
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={adding}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* שדה חיפוש */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="חפש משתמשים לפי שם, תפקיד או חברה..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              disabled={loading || adding}
            />
          </div>
        </div>

        {/* כפתורי בחירה */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm disabled:opacity-50"
              disabled={loading || adding || filteredUsers.length === 0}
            >
              בחר הכל ({filteredUsers.length})
            </button>
            <button
              onClick={selectNone}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
              disabled={loading || adding || selectedUsers.length === 0}
            >
              בטל בחירה
            </button>
          </div>
          <span className="text-sm text-gray-600">
            נבחרו {selectedUsers.length} מתוך {filteredUsers.length} משתמשים
          </span>
        </div>

        {/* רשימת משתמשים */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 ml-3" />
              <span className="text-gray-600">טוען משתמשים זמינים...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">
                {searchText ? 'לא נמצאו משתמשים התואמים לחיפוש' : 'כל המשתמשים כבר חברים בקבוצה'}
              </p>
              {searchText && (
                <button
                  onClick={() => setSearchText('')}
                  className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                >
                  נקה חיפוש
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredUsers.map(user => {
                const isSelected = selectedUsers.includes(user.id);
                return (
                  <div
                    key={user.id}
                    onClick={() => handleUserToggle(user.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 truncate">{user.name || 'ללא שם'}</h3>
                        <p className="text-blue-600 text-sm truncate">{user.position || 'ללא תפקיד'}</p>
                        <p className="text-gray-500 text-sm truncate">{user.company || 'ללא חברה'}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 ${
                        isSelected 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* כפתורי פעולה */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            disabled={adding}
          >
            ביטול
          </button>
          <button
            onClick={handleAddUsers}
            disabled={selectedUsers.length === 0 || adding || !addUsersToGroup}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin ml-2" />
                מוסיף...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 ml-2" />
                הוסף {selectedUsers.length} משתמש{selectedUsers.length !== 1 ? 'ים' : ''}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUsersModal;