import { getAll } from '../dataLayer/group.data.js';

// Service function to get all groups
export async function getAllGroups() {
  const groups = await getAll();

  // You can add more processing logic here if needed
  return groups;
}