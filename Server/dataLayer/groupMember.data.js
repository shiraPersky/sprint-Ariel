import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function create(data) {
  return await prisma.groupMember.create({ data });
}

async function getAll() {
  return await prisma.groupMember.findMany();
}

// Get all members of a specific group by group ID
async function getByIds(id_group) {
  return await prisma.groupMember.findMany({
    where: {
      id_group
    },
    include: {
      member: true // Include full CommunityMember details
    }
  });
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
