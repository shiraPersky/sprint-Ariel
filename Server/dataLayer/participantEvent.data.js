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

async function getParticipantsByEventId(id_event) {
  const results = await prisma.participantEvent.findMany({
    where: { id_event },
    include: {
      member: {
        select: {
          id_community_member: true,
          english_name: true,
          email: true,
          city: true,
          // אפשר להוסיף עוד שדות אם צריך
        }
      }
    }
  });

  return results.map((r) => r.member); // מחזירים רק את המשתתפים
}

export default {
  create,
  getAll,
  getByIds,
  remove,
  getParticipantsByEventId,
};
