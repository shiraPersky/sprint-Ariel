import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createJob(data) {
  return await prisma.job.create({ data });
}

async function getAllJobs() {
  return await prisma.job.findMany();
}

async function getJobById(id) {
  return await prisma.job.findUnique({
    where: { id_job: id },
  });
}

async function updateJob(id, data) {
  return await prisma.job.update({
    where: { id_job: id },
    data,
  });
}

async function deleteJob(id) {
  return await prisma.job.delete({
    where: { id_job: id },
  });
}

export default {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
};
