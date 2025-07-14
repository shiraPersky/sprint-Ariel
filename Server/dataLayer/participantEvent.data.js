import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createParticipantEvent(data) {
  return await prisma.participantEvent.create({ data });
}

async function getAllParticipantEvents() {
  return await prisma.participantEvent.findMany();
}

async function getParticipantEventByIds(id_community_member, id_event) {
  return await prisma.participantEvent.findUnique({
    where: {
      id_community_member_id_event: {
        id_community_member,
        id_event,
      },
    },
  });
}

async function deleteParticipantEvent(id_community_member, id_event) {
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
  createParticipantEvent,
  getAllParticipantEvents,
  getParticipantEventByIds,
  deleteParticipantEvent,
};
