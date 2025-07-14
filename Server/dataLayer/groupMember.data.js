import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createGroupMember(data) {
  return await prisma.groupMember.create({ data });
}

async function getAllGroupMembers() {
  return await prisma.groupMember.findMany();
}

async function getGroupMemberByIds(id_community_member, id_group) {
  return await prisma.groupMember.findUnique({
    where: {
      id_community_member_id_group: {
        id_community_member,
        id_group,
      },
    },
  });
}

async function deleteGroupMember(id_community_member, id_group) {
  return await prisma.groupMember.delete({
    where: {
      id_community_member_id_group: {
        id_community_member,
        id_group,
      },
    },
  });
}

export default {
  createGroupMember,
  getAllGroupMembers,
  getGroupMemberByIds,
  deleteGroupMember,
};
