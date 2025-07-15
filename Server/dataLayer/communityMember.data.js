import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // connection to database

async function create(data) {
  console.log('Creating new community member with data:', data);
  return await prisma.communityMember.create({ data });
}

// async function getAll() {
//   return await prisma.communityMember.findMany();
// }

// //generic get all users
// export async function getAll(selectedFields = null) {
//   const query = selectedFields ? { select: selectedFields } : {};
//   return await prisma.communityMember.findMany(query);
// }

// Get all community members
export async function getAll(selectedFields = null) {
  if (selectedFields) {
    // Return only selected fields if provided
    return await prisma.communityMember.findMany({
      select: selectedFields
    });
  }

  // Default: return full user info + group memberships + group details
  return await prisma.communityMember.findMany({
    include: {
      groupMemberships: {
        include: {
          group: true // Include the full group object (e.g. id, name, etc.)
        }
      }
    }
  });
}

async function getById(id) {
  return await prisma.communityMember.findUnique({
    where: { id_community_member: id },
    include: {
      jobs: true,
      skills: true,
      tags: true,
      participantEvents: true,
      groupMemberships: true,
      participantValues: true,
    },
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
