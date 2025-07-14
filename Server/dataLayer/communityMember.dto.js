import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();//connection to database

async function createCommunityMember(data) {
  return await prisma.communityMember.create({ data });
}

async function getAllCommunityMembers() {
  return await prisma.communityMember.findMany();
}

async function getCommunityMemberById(id) {
  return await prisma.communityMember.findUnique({
    where: { id_community_member: id },
  });
}

async function updateCommunityMember(id, data) {
  return await prisma.communityMember.update({
    where: { id_community_member: id },
    data,
  });
}

async function deleteCommunityMember(id) {
  return await prisma.communityMember.delete({
    where: { id_community_member: id },
  });
}

export default {
  createCommunityMember,
  getAllCommunityMembers,
  getCommunityMemberById,
  updateCommunityMember,
  deleteCommunityMember,
};
