import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function create(data) {
  return await prisma.event.create({ data });
}

async function getAll() {
  return await prisma.event.findMany();
}

async function getById(id) {
  return await prisma.event.findUnique({
    where: { id_event: id },
  });
}

async function update(id, data) {
  return await prisma.event.update({
    where: { id_event: id },
    data,
  });
}

async function remove(id) {
  return await prisma.event.delete({
    where: { id_event: id },
  });
}

async function getAllWithParticipants() {
  const events = await prisma.event.findMany({
    include: {
      participantEvents: {
        include: {
          member: {
            select: {
              id_community_member: true,
              english_name: true
            }
          }
        }
      }
    }
  });

  return events.map((event) => ({
    id_event: event.id_event,
    description: event.description,
    type: event.type,
    time: event.time,
    location: event.location,
    participants: event.participantEvents.map((pe) => pe.member),
  }));
}

async function getAvailableMembersForEvent(id_event) {
  const existing = await prisma.participantEvent.findMany({
    where: { id_event },
    select: { id_community_member: true }
  });

  const excludedIds = existing.map((m) => m.id_community_member);

  const members = await prisma.communityMember.findMany({
    where: {
      id_community_member: { notIn: excludedIds },
      active: true
    },
    select: {
      id_community_member: true,
      english_name: true
    }
  });

  return members;
}

export default {
  create,
  getAll,
  getById,
  update,
  remove,
  getAllWithParticipants,
  getAvailableMembersForEvent,
};
