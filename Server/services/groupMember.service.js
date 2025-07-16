import groupMemberData from '../dataLayer/groupMember.data.js';

import communityMemberData from '../dataLayer/communityMember.data.js';

export async function getMembersNotInGroup(id_group) {
  if (!id_group || isNaN(Number(id_group))) {
    throw new Error('Invalid group ID');
  }

  return await communityMemberData.getMembersNotInGroup(Number(id_group));
}

export async function addMemberToGroup(id_group, id_community_member) {
  if (!id_group || !id_community_member) {
    throw new Error('Group ID and Member ID are required');
  }

  const existing = await groupMemberData.getByIds({ id_group });

  const isAlreadyInGroup = existing.some(
    (entry) => entry.id_community_member === id_community_member
  );

  if (isAlreadyInGroup) {
    throw new Error('Member is already in this group');
  }

const newGroupMember = await groupMemberData.create({ id_group, id_community_member });  return newGroupMember;
}


export async function addMultipleMembersToGroup(id_group, id_community_members) {
  const results = [];

  // Get current group members to avoid duplicates
  const existing = await groupMemberData.getByIds({ id_group });

  const existingMemberIds = new Set(
    existing.map(entry => entry.id_community_member)
  );

  for (const memberId of id_community_members) {
    if (existingMemberIds.has(memberId)) {
      results.push({
        id_community_member: memberId,
        status: "skipped",
        reason: "Already in group"
      });
      continue;
    }

    try {
      const added = await groupMemberData.create({
        id_group,
        id_community_member: memberId
      });

      results.push({
        id_community_member: memberId,
        status: "added",
        data: added
      });
    } catch (error) {
      results.push({
        id_community_member: memberId,
        status: "failed",
        reason: error.message
      });
    }
  }

  return results;
}


export async function removeMemberFromGroup(id_group, id_community_member) {
  if (!id_group || !id_community_member) {
    throw new Error('Group ID and Member ID are required');
  }

  // check if member is part of the group
  const existingMembers = await groupMemberData.getByIds({ id_group });

  const isInGroup = existingMembers.some(
    (entry) => entry.id_community_member === id_community_member
  );

  if (!isInGroup) {
    throw new Error('Member is not part of this group');
  }

  const removed = await groupMemberData.remove(id_community_member, id_group);

  return removed;
}

export async function removeMultipleMembersFromGroup(id_group, id_community_members) {
  const results = [];

  for (const id_community_member of id_community_members) {
    const existingMembers = await groupMemberData.getByIds({ id_group });

    const isInGroup = existingMembers.some(
      (entry) => entry.id_community_member === id_community_member
    );

    if (!isInGroup) {
      results.push({
        id_community_member,
        status: "not_in_group"
      });
      continue;
    }

    try {
      await groupMemberData.remove(id_community_member, id_group);
      results.push({
        id_community_member,
        status: "removed"
      });
    } catch (err) {
      results.push({
        id_community_member,
        status: "error",
        message: err.message
      });
    }
  }

  return results;
}
