import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createGroup(data) {
  return await prisma.group.create({ data });
}

async function getAllGroups() {
  return await prisma.group.findMany();
}

async function getGroupById(id) {
  return await prisma.group.findUnique({
    where: { id_group: id },
  });
}

async function updateGroup(id, data) {
  return await prisma.group.update({
    where: { id_group: id },
    data,
  });
}

async function deleteGroup(id) {
  return await prisma.group.delete({
    where: { id_group: id },
  });
}

export default {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
};
