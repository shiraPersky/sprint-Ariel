import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function create(data) {
  return await prisma.participantEvent.create({ data });
}

async function getAll() {
  return await prisma.participantEvent.findMany();
}

async function getByIds(id_community_member, id_event) {
  return await prisma.participantEvent.findUnique({
    where: {
      id_community_member_id_event: {
        id_community_member,
        id_event,
      },
    },
  });
}

async function remove(id_community_member, id_event) {
  return await prisma.participantEvent.delete({
    where: {
      id_community_member_id_event: {
        id_community_member,
        id_event,
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
