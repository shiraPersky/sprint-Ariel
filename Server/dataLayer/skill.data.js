import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createSkill(data) {
  return await prisma.skill.create({ data });
}

async function getAllSkills() {
  return await prisma.skill.findMany();
}

async function getSkillById(id) {
  return await prisma.skill.findUnique({
    where: { id_skill: id },
  });
}

async function updateSkill(id, data) {
  return await prisma.skill.update({
    where: { id_skill: id },
    data,
  });
}

async function deleteSkill(id) {
  return await prisma.skill.delete({
    where: { id_skill: id },
  });
}

export default {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
};
