import communityMemberData from "../dataLayer/communityMember.data.js";
const { create } = communityMemberData;

export async function createMemberWithLinkedIn(linkedin_url) {
  if (typeof linkedin_url !== 'string' || linkedin_url.trim() === '') {
    const error = new Error('linkedin_url is required and must be a non-empty string');
    error.status = 400;
    throw error;
  }

  if (!linkedin_url.startsWith('http')) {
    const error = new Error('linkedin_url must be a valid URL');
    error.status = 400;
    throw error;
  }

  const newMemberData = {
    linkedin_url: linkedin_url.trim(),
    english_name: 'Fictive User',
    title: 'Temporary Title',
    email: 'fakeuser@example.com',
    phone: null,
    about: null,
    city: null,
    facebook_url: null,
    additional_info: null,
    wants_updates: false,
    active: true,
    admin_notes: null,
    years_of_experience: 0
  };

  const newMember = await create(newMemberData);
  return { id_community_member: newMember.id_community_member };
}
