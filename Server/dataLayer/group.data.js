import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function create(data) {
  return await prisma.group.create({ data });
}

// Retrieve all groups from the database, including their members
async function getAll() {
  try {
    console.log('🔄 Connecting to database...');
    
    // בדיקה פשוטה ראשונה
    const count = await prisma.group.count();
    // console.log(`📊 Total groups in DB: ${count}`);
    
    if (count === 0) {
      console.log('⚠️ No groups found in database');
      return [];
    }
    
    // קבלת הקבוצות
    const groups = await prisma.group.findMany({
      include: {
        members: true
      }
    });
    
    // console.log(`✅ Successfully fetched ${groups.length} groups`);
    console.log('📋 First group:', groups[0]);
    
    return groups;
    
  } catch (error) {
    console.error('❌ Database error:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw error;
  }
}

export { getAll };

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

export default {
  create,
  getAll,
  getById,
  update,
  remove,
};
