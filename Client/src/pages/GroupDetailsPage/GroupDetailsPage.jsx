import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useServerRequestsMock from '../Searchpage/testcomp';
import AddUsersModal from './AddUsersModal';

// Import components
// import BackButton from './BackButton';
import GroupHeader from './GroupHeader';
import MembersSectionHeader from './MembersSectionHeader';
import MembersGrid from './MembersGrid';
import DeleteModeBanner from './DeleteModeBanner';
import { LoadingSpinner, GroupNotFound } from './LoadingSpinner';
import { getGroupDetails, getGroupMembers } from './API Services';

/**
 * GroupDetailsPage Component
 * Main page component for displaying group details and managing members
 */
const GroupDetailsPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(true);
  const [showAddUsersModal, setShowAddUsersModal] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState([]);
  const [deleting, setDeleting] = useState(false);
  
  // Get group data from navigation state
  const groupData = location.state?.group;
  
  const { 
    addUsersToGroup,
    removeUsersFromGroup,
  } = useServerRequestsMock();

  /**
   * Handle users added to group
   * Reloads member list after successful addition
   */
  const handleUsersAdded = async () => {
    try {
      setMembersLoading(true);
      const updatedMembers = await getGroupMembers(groupId);
      setMembers(updatedMembers);
    } catch (error) {
      console.error('Error reloading members:', error);
      alert('Error loading updated member list');
    } finally {
      setMembersLoading(false);
    }
  };

  /**
   * Load group data and members on component mount
   */
  useEffect(() => {
    const loadGroupData = async () => {
      try {
        console.log('Loading group data for ID:', groupId);
        console.log('Group data from location state:', groupData);
        
        // Use state data if available, otherwise fetch from server
        let groupDetails = groupData;
        if (!groupDetails) {
          console.log('No group data in state, fetching from server...');
          groupDetails = await getGroupDetails(groupId);
        }
        
        // Load group members
        const groupMembers = await getGroupMembers(groupId);
        
        console.log('Final group data:', groupDetails);
        console.log('Group members:', groupMembers);
        
        setGroup(groupDetails);
        setMembers(groupMembers);
        
      } catch (error) {
        console.error('Error loading group data:', error);
        alert('Error loading group data');
      } finally {
        setLoading(false);
        setMembersLoading(false);
      }
    };

    if (groupId) {
      loadGroupData();
    }
  }, [groupId, groupData]);

  /**
   * Handle user card clicks
   * Either selects for deletion or navigates to user profile
   * @param {Object} user - User object that was clicked
   */
  const handleUserClick = (user) => {
    if (deleteMode) {
      setSelectedForDeletion(prev => 
        prev.includes(user.id)
          ? prev.filter(id => id !== user.id)
          : [...prev, user.id]
      );
    } else {
      navigate(`/member/${user.id}/data`);
    }
  };

  /**
   * Enter delete mode
   * Activates member selection for deletion
   */
  const enterDeleteMode = () => {
    setDeleteMode(true);
    setSelectedForDeletion([]);
  };

  /**
   * Exit delete mode
   * Deactivates member selection and clears selection
   */
  const exitDeleteMode = () => {
    setDeleteMode(false);
    setSelectedForDeletion([]);
  };

  /**
   * Handle member deletion
   * Removes selected members from the group
   */
  const handleDeleteUsers = async () => {
    if (selectedForDeletion.length === 0) {
      alert('Please select at least one user to delete');
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to remove ${selectedForDeletion.length} users from the group?`
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);
      console.log('Removing users from group:', { groupId, selectedForDeletion });
      
      const result = await removeUsersFromGroup(groupId, selectedForDeletion);
      
      if (result && result.success) {
        const count = result.removedCount || selectedForDeletion.length;
        alert(`${count} users removed successfully from the group!`);
        
        await handleUsersAdded();
        exitDeleteMode();
      } else {
        const errorMsg = result?.error || 'Unknown error';
        alert('Error removing users: ' + errorMsg);
      }
    } catch (error) {
      console.error('Error removing users:', error);
      alert('Error removing users from group');
    } finally {
      setDeleting(false);
    }
  };

  /**
   * Select all members for deletion
   */
  const selectAllForDeletion = () => {
    setSelectedForDeletion(members.map(member => member.id));
  };

  /**
   * Clear member selection
   */
  const selectNoneForDeletion = () => {
    setSelectedForDeletion([]);
  };

  /**
   * Navigate back to search page
   */
  const handleBackToSearch = () => {
    navigate('/UserSearch');
  };

  // Loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Group not found state
  if (!group) {
    return <GroupNotFound onBackToSearch={handleBackToSearch} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Button */}
        {/* <BackButton onClick={handleBackToSearch} /> */}

        {/* Group Header */}
        <GroupHeader group={group} memberCount={members.length} />

        {/* Members Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <MembersSectionHeader
            memberCount={members.length}
            membersLoading={membersLoading}
            deleteMode={deleteMode}
            selectedForDeletion={selectedForDeletion}
            deleting={deleting}
            onAddUsers={() => setShowAddUsersModal(true)}
            onEnterDeleteMode={enterDeleteMode}
            onExitDeleteMode={exitDeleteMode}
            onSelectAll={selectAllForDeletion}
            onSelectNone={selectNoneForDeletion}
            onDeleteUsers={handleDeleteUsers}
            loading={loading}
          />

          <DeleteModeBanner deleteMode={deleteMode} />

          <MembersGrid
            members={members}
            deleteMode={deleteMode}
            selectedForDeletion={selectedForDeletion}
            onUserClick={handleUserClick}
            onAddUsers={() => setShowAddUsersModal(true)}
          />
        </div>

        {/* Add Users Modal */}
        <AddUsersModal
          isOpen={showAddUsersModal}
          onClose={() => setShowAddUsersModal(false)}
          groupId={groupId}
          groupName={group?.group_name || group?.name}
          addUsersToGroup={addUsersToGroup}
          onUsersAdded={handleUsersAdded}
        />
      </div>
    </div>
  );
};

export default GroupDetailsPage;