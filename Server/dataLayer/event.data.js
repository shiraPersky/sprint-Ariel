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

export default {
  create,
  getAll,
  getById,
  update,
  remove,
};
