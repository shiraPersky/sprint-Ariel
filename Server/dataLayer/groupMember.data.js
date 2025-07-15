import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function create(data) {
  return await prisma.groupMember.create({ data });
}

async function getAll() {
  return await prisma.groupMember.findMany();
}

// Get group members by group ID OR groups by member ID
async function getByIds({ id_group = null, id_community_member = null }) {
  if (id_group) {
    // Return all members in the specified group
    return await prisma.groupMember.findMany({
      where: {
        id_group
      },
      include: {
        member: true // Include full member details
      }
    });
  }

  if (id_community_member) {
    // Return all groups the member belongs to
    return await prisma.groupMember.findMany({
      where: {
        id_community_member
      },
      include: {
        group: true // Include full group details
      }
    });
  }

  // If neither ID was provided
  throw new Error('You must provide either id_group or id_community_member');
}




async function remove(id_community_member, id_group) {
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
  create,
  getAll,
  getByIds,
  remove,
};