import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function create(data) {
  return await prisma.tag.create({ data });
}

async function getAll() {
  return await prisma.tag.findMany();
}

async function getById(id) {
  return await prisma.tag.findUnique({
    where: { id_tag: id },
  });
}

async function update(id, data) {
  return await prisma.tag.update({
    where: { id_tag: id },
    data,
  });
}

async function remove(id) {
  return await prisma.tag.delete({
    where: { id_tag: id },
  });
}

export default {
  create,
  getAll,
  getById,
  update,
  remove,
};
