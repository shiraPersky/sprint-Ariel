import groupMemberData from '../dataLayer/groupMember.data.js';

export async function addMemberToGroup(id_group, id_community_member) {
  if (!id_group || !id_community_member) {
    throw new Error('Group ID and Member ID are required');
  }

  // Optional: check if already exists
  const existing = await groupMemberData.getByIds({ id_group });

  const isAlreadyInGroup = existing.some(
    (entry) => entry.id_community_member === id_community_member
  );

  if (isAlreadyInGroup) {
    throw new Error('Member is already in this group');
  }

const newGroupMember = await groupMemberData.create({ id_group, id_community_member });  return newGroupMember;
}