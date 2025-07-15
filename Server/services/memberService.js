import { getById, update, create } from "../dataLayer/communityMember.data.js";

const { getById, getAll } = communityMemberData;

//Removes leading/trailing whitespace from the string
export async function getMemberById(id) {
  if (typeof id !== "string") {
    const error = new Error("Member ID must be a string");
    error.status = 400;
    throw error;
  }

  const trimmed = id.trim(); //Removes leading/trailing whitespace from the string
  const parsed = parseInt(trimmed, 10); //ensures it parses in base 10

  if (isNaN(parsed) || parsed < 1) {
    //If parsed is not a number or if the ID is less than 1
    const error = new Error("Invalid member ID");
    error.status = 400;
    throw error;
  }

  console.log("Looking up member ID:", parsed);
  const member = await getById(parsed);
  console.log("Found member:", member);

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

export async function createOrUpdateMember(id, data) {
  let parsedId = null;

  // Try to parse the ID if provided
  if (typeof id === "string" && id.trim() !== "") {
    parsedId = parseInt(id.trim(), 10); //onverts the id string into an integer, using base 10

    if (!isNaN(parsedId) && parsedId > 0) {
      const existing = await getById(parsedId);

      if (existing) {
        //already have a member with this ID
        // Update the existing member
        return await update(parsedId, data);
      }
    }
  }

  // If no valid ID or not found -> create a new member
  const newMember = await create(data);

  //remove unwanted fields before returning
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
  } = newMember;

  return safeData;
}

export async function getAllMembers() {
  try {
    const members = await getAll();
    return members;
  } catch (error) {
    throw new Error("Failed to retrieve members");
  }
}
