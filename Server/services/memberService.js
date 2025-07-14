import communityMemberData from "../dataLayer/communityMember.data.js";

const { getById } = communityMemberData;

export async function getMemberById(id) {
  if (typeof id !== "string") {
    const error = new Error("Member ID must be a string");
    error.status = 400;
    throw error;
  }

  const trimmed = id.trim();
  const parsed = parseInt(trimmed, 10);

  if (isNaN(parsed) || parsed < 1) {
    const error = new Error("Invalid member ID");
    error.status = 400;
    throw error;
  }

  console.log('Looking up member ID:', parsed); 
  const member = await getById(parsed);
  console.log('Found member:', member);    return member;
}
