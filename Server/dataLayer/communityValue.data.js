import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function create(data) {
  return await prisma.communityValue.create({ data });
}

async function getAll() {
  return await prisma.communityValue.findMany();
}

async function getById(id) {
  return await prisma.communityValue.findUnique({
    where: { id_community_value: id },
  });
}

async function update(id, data) {
  return await prisma.communityValue.update({
    where: { id_community_value: id },
    data,
  });
}

async function remove(id) {
  return await prisma.communityValue.delete({
    where: { id_community_value: id },
  });
}

export default {
  create,
  getAll,
  getById,
  update,
  remove,
};
