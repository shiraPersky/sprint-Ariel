/**
 * API Services for Group Details
 * Contains all API calls related to group management
 */

/**
 * Fetch group details from server
 * @param {string|number} groupId - ID of the group to fetch
 * @returns {Promise<Object|null>} Group data or null if not found
 */
export const getGroupDetails = async (groupId) => {
  try {
    console.log('Fetching group details for group:', groupId);
    
    const response = await fetch(`http://localhost:5000/communities/group/${groupId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Group details API Response:', result);

    if (result.success) {
      return result.data;
    } else {
      console.error('API returned error:', result);
      return null;
    }
  } catch (error) {
    console.error('Error fetching group details:', error);
    throw error;
  }
};

/**
 * Fetch group members from server
 * @param {string|number} groupId - ID of the group
 * @returns {Promise<Array>} Array of formatted member objects
 */
export const getGroupMembers = async (groupId) => {
  try {
    console.log('Fetching group members for group:', groupId);
    
    const response = await fetch(`http://localhost:5000/communities/group/${groupId}/members`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Group members API Response:', result);

    if (result.success) {
      // Transform server data to component-expected format
      const formattedMembers = result.data.map(memberData => {
        const member = memberData.member;
        return {
          id: member.id_community_member,
          english_name: member.english_name,
          position: member.title,
          company: member.about,
          email: member.email,
          phone: member.phone,
          city: member.city,
          linkedin_url: member.linkedin_url,
          facebook_url: member.facebook_url,
          additional_info: member.additional_info,
          years_of_experience: member.years_of_experience,
          wants_updates: member.wants_updates,
          active: member.active,
          admin_notes: member.admin_notes,
          community_value_id: member.community_value_id,
          // Additional fields for better display
          profile_picture_url: member.profile_picture_url || null,
          description: member.additional_info || member.about
        };
      });

      console.log('Formatted members:', formattedMembers);
      return formattedMembers;
    } else {
      console.error('API returned error:', result);
      return [];
    }
  } catch (error) {
    console.error('Error fetching group members:', error);
    throw error;
  }
};