import groupData from '../dataLayer/group.data.js';

import getByIds from '../dataLayer/groupMember.data.js';

// Service function to get all groups
export async function getAllGroups() {
  const groups = await groupData.getAll();

  // You can add more processing logic here if needed
  return groups;
}



// Service function to get members by group ID
export async function getMembersByGroupId(id_group) {
  if (!id_group) {
    throw new Error('Group ID must be provided');
  }
  const members = await getByIds({ id_group });
  return members;
}



export async function getCommonMembersInGroups(groupIds) {
  const allGroupsMembers = [];

  // Loop through each group ID and fetch its members using getByIds
  for (const id_group of groupIds) {
    const membersInGroup = await getByIds({ id_group });

    // Extract only the member IDs from each group
    const memberIds = membersInGroup.map(m => m.id_community_member);

    // Store the member IDs as a Set for easier intersection
    allGroupsMembers.push(new Set(memberIds));
  }

  // Perform intersection across all sets to get common member IDs
  const commonMemberIds = [...allGroupsMembers.reduce((a, b) => {
    return new Set([...a].filter(x => b.has(x)));
  })];

  // Use getByIds again on one group to retrieve full member objects
  const fullMembers = await getByIds({ id_group: groupIds[0] });

  // Filter out only those whose IDs are in the intersection
  const filteredMembers = fullMembers
    .filter(m => commonMemberIds.includes(m.id_community_member))
    .map(m => m.member); // Return only the member object

  return filteredMembers;
}
