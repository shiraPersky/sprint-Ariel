import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // connection to database

async function create(data) {
  return await prisma.communityMember.create({ data });
}

async function getAll() {
  return await prisma.communityMember.findMany();
}

async function getById(id) {
  return await prisma.communityMember.findUnique({
    where: { id_community_member: id },
  });
}

async function update(id, data) {
  return await prisma.communityMember.update({
    where: { id_community_member: id },
    data,
  });
}

async function remove(id) {
  return await prisma.communityMember.delete({
    where: { id_community_member: id },
  });
}

export default {
  create,
  getAll,
  getById,
  update,
  remove,
};
