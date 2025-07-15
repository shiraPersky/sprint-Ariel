import { getAll } from '../dataLayer/group.data.js';

import { getByIds } from '../dataLayer/groupMember.data.js';

// Service function to get all groups
export async function getAllGroups() {
  const groups = await getAll();

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