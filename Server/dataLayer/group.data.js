import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function create({ name  }) {
  return await prisma.group.create({
    data: {
      group_name: name,
    }
  });
}

// Retrieve all groups from the database, including their members
async function getAll() {
  return await prisma.group.findMany({
    include: {
      members: true // Required to calculate membersCount
    }
  });
}


async function getById(id) {
  return await prisma.group.findUnique({
    where: { id_group: id },
  });
}

async function update(id, data) {
  return await prisma.group.update({
    where: { id_group: id },
    data,
  });
}

async function remove(id) {
  return await prisma.group.delete({
    where: { id_group: id },
  });
}

async function findByName(name) {
  return await prisma.group.findFirst({
    where: { group_name: name },
  });
}

export default {
  create,
  getAll,
  getById,
  update,
  remove,
  findByName,
};
