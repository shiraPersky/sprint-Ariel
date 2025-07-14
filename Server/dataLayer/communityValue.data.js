import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createCommunityValue(data) {
  return await prisma.communityValue.create({ data });
}

async function getAllCommunityValues() {
  return await prisma.communityValue.findMany();
}

async function getCommunityValueById(id) {
  return await prisma.communityValue.findUnique({
    where: { id_community_value: id },
  });
}

async function updateCommunityValue(id, data) {
  return await prisma.communityValue.update({
    where: { id_community_value: id },
    data,
  });
}

async function deleteCommunityValue(id) {
  return await prisma.communityValue.delete({
    where: { id_community_value: id },
  });
}

export default {
  createCommunityValue,
  getAllCommunityValues,
  getCommunityValueById,
  updateCommunityValue,
  deleteCommunityValue,
};
