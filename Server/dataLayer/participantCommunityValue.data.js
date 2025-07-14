import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function create(data) {
  return await prisma.participantCommunityValue.create({ data });
}

async function getAll() {
  return await prisma.participantCommunityValue.findMany();
}

async function getByIds(id_community_member, id_community_value) {
  return await prisma.participantCommunityValue.findUnique({
    where: {
      id_community_member_id_community_value: {
        id_community_member,
        id_community_value,
      },
    },
  });
}

async function update(id_community_member, id_community_value, data) {
  return await prisma.participantCommunityValue.update({
    where: {
      id_community_member_id_community_value: {
        id_community_member,
        id_community_value,
      },
    },
    data,
  });
}

async function remove(id_community_member, id_community_value) {
  return await prisma.participantCommunityValue.delete({
    where: {
      id_community_member_id_community_value: {
        id_community_member,
        id_community_value,
      },
    },
  });
}

export default {
  create,
  getAll,
  getByIds,
  update,
  remove,
};
