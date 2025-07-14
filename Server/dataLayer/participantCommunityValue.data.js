import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createParticipantCommunityValue(data) {
  return await prisma.participantCommunityValue.create({ data });
}

async function getAllParticipantCommunityValues() {
  return await prisma.participantCommunityValue.findMany();
}

async function getParticipantCommunityValueByIds(id_community_member, id_community_value) {
  return await prisma.participantCommunityValue.findUnique({
    where: {
      id_community_member_id_community_value: {
        id_community_member,
        id_community_value,
      },
    },
  });
}

async function updateParticipantCommunityValue(id_community_member, id_community_value, data) {
  return await prisma.participantCommunityValue.update({
    where: {
      id_community_member_id_community_value: {
        id_community_member,
        id_community_value,
      },
    },
    data,
  });
}

async function deleteParticipantCommunityValue(id_community_member, id_community_value) {
  return await prisma.participantCommunityValue.delete({
    where: {
      id_community_member_id_community_value: {
        id_community_member,
        id_community_value,
      },
    },
  });
}

export default {
  createParticipantCommunityValue,
  getAllParticipantCommunityValues,
  getParticipantCommunityValueByIds,
  updateParticipantCommunityValue,
  deleteParticipantCommunityValue,
};
