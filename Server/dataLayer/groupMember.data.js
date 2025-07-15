import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function create(data) {
  return await prisma.groupMember.create({ data });
}

async function getAll() {
  return await prisma.groupMember.findMany();
}

export const getByIds = async ({ id_group = null, id_community_member = null }) => {
  if (id_group) {
    return await prisma.groupMember.findMany({
      where: { id_group },
      include: { member: true }
    });
  }

  if (id_community_member) {
    return await prisma.groupMember.findMany({
      where: { id_community_member },
      include: { group: true }
    });
  }

  throw new Error('You must provide either id_group or id_community_member');
};





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