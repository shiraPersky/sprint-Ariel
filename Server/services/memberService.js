import { getById } from '../db/memberDb.js';


export async function getMemberById(id) {
  // Validate that an ID was provided
  if (!id) {
    const error = new Error('Missing member ID');
    error.status = 400;
    throw error;
  }

  // Validate that the ID is a non-empty string
  if (typeof id !== 'string' || id.trim() === '') {
    const error = new Error('Invalid member ID');
    error.status = 400;
    throw error;
  }

  // Query the database using the DB layer function
  const member = await getById(id);

  return member;
}
