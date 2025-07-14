import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function create(data) {
  return await prisma.job.create({ data });
}

async function getAll(filter = {}) {
  return await prisma.job.findMany(filter);
}

async function getById(id) {
  return await prisma.job.findUnique({
    where: { id_job: id },
  });
}

async function update(id, data) {
  return await prisma.job.update({
    where: { id_job: id },
    data,
  });
}

async function remove(id) {
  return await prisma.job.delete({
    where: { id_job: id },
  });
}

export default {
  create,
  getAll,
  getById,
  update,
  remove,
};
