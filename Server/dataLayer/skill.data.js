import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function create(data) {
  return await prisma.skill.create({ data });
}

async function getAll() {
  return await prisma.skill.findMany();
}

async function getById(id) {
  return await prisma.skill.findUnique({
    where: { id_skill: id },
  });
}

async function update(id, data) {
  return await prisma.skill.update({
    where: { id_skill: id },
    data,
  });
}

async function remove(id) {
  return await prisma.skill.delete({
    where: { id_skill: id },
  });
}

export default {
  create,
  getAll,
  getById,
  update,
  remove,
};
