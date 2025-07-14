import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createEvent(data) {
  return await prisma.event.create({ data });
}

async function getAllEvents() {
  return await prisma.event.findMany();
}

async function getEventById(id) {
  return await prisma.event.findUnique({
    where: { id_event: id },
  });
}

async function updateEvent(id, data) {
  return await prisma.event.update({
    where: { id_event: id },
    data,
  });
}

async function deleteEvent(id) {
  return await prisma.event.delete({
    where: { id_event: id },
  });
}

export default {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
