import communityMemberData from "../dataLayer/communityMember.data.js";

const { getById, getAll } = communityMemberData;

//Removes leading/trailing whitespace from the string
export async function getMemberById(id) {
  if (typeof id !== "string") {
    const error = new Error("Member ID must be a string");
    error.status = 400;
    throw error;
  }

  const trimmed = id.trim();//Removes leading/trailing whitespace from the string
  const parsed = parseInt(trimmed, 10);//ensures it parses in base 10

  if (isNaN(parsed) || parsed < 1) {//If parsed is not a number or if the ID is less than 1 
    const error = new Error("Invalid member ID");
    error.status = 400;
    throw error;
  }

  console.log('Looking up member ID:', parsed); 
  const member = await getById(parsed);
  console.log('Found member:', member);    

  if (!member) return null;

  // Destructure and remove unwanted fields
  const {
    id_community_member,
    additional_info,
    admin_notes,
    years_of_experience,
    participantEvents,
    groupMemberships,
    tags,
    community_value_id,
    ...safeData
  } = member;

  return safeData;
}
 


export async function getAllMembers() {
  try {
    const members = await getAll();
    return members;
  } catch (error) {
    throw new Error('Failed to retrieve members');
  }
}