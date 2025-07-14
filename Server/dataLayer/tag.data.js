import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createTag(data) {
  return await prisma.tag.create({ data });
}

async function getAllTags() {
  return await prisma.tag.findMany();
}

async function getTagById(id) {
  return await prisma.tag.findUnique({
    where: { id_tag: id },
  });
}

async function updateTag(id, data) {
  return await prisma.tag.update({
    where: { id_tag: id },
    data,
  });
}

async function deleteTag(id) {
  return await prisma.tag.delete({
    where: { id_tag: id },
  });
}

export default {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
};
