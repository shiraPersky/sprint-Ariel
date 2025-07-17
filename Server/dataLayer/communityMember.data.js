import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient(); // connection to database

function cleanCreateRelations(data) {
  const relationFields = [
    "jobs",
    "skills",
    "tags",
    "participantEvents",
    "groupMemberships",
    "participantValues",
  ];

  const cleanedData = { ...data };

  for (const field of relationFields) {
    if (Array.isArray(cleanedData[field]) && cleanedData[field].length > 0) {
      // Remove id_community_member from each nested item
      const cleanedNested = cleanedData[field].map((item) => {
        const copy = { ...item };
        delete copy.id_community_member;
        return copy;
      });

      cleanedData[field] = { create: cleanedNested };
    } else {
      delete cleanedData[field]; // Remove empty arrays
    }
  }

  return cleanedData;
}

async function create(data) {

  if (!data || typeof data !== "object") {
    throw new Error("Invalid data provided to create()");
  }

  const clonedData = { ...data };

  console.log("🛠️ Raw clonedData BEFORE deletion:", clonedData);

  delete clonedData["id_community_member"];


  const cleaned = cleanCreateRelations(clonedData);

  if ("id_community_member" in cleaned) {
    console.error("❌ id_community_member still exists after cleanup!", cleaned.id_community_member);
    delete cleaned.id_community_member;
  }



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
      select: selectedFields,
    });
  }

  // Default: return full user info + group memberships + group details
  return await prisma.communityMember.findMany({
    include: {
      groupMemberships: {
        include: {
          group: true, // Include the full group object (e.g. id, name, etc.)
        },
      },
    },
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

async function getMembersNotInGroup(id_group) {
  return await prisma.communityMember.findMany({
    where: {
      groupMemberships: {
        none: {
          id_group: id_group,
        },
      },
    },
  });
}

async function updateMemberAndRelations(id, data) {
  const memberId = Number(id);
  if (isNaN(memberId)) throw new Error("Invalid member ID");

  // Update main member
  const updatedMember = await prisma.communityMember.update({
    where: { id_community_member: memberId },
    data: {
      english_name: data.english_name,
      title: data.title,
      about: data.about,
      phone: data.phone,
      email: data.email,
      city: data.city,
      linkedin_url: data.linkedin_url,
      facebook_url: data.facebook_url,
      additional_info: data.additional_info,
      wants_updates: data.wants_updates,
      active: data.active,
      admin_notes: data.admin_notes,
      years_of_experience: data.years_of_experience,
      community_value_id: data.community_value_id,
    },
  });

  // Replace all nested relations in a transaction
  await prisma.$transaction([
    prisma.job.deleteMany({ where: { id_community_member: memberId } }),
    ...data.jobs.map((job) =>
      prisma.job.create({
        data: {
          id_community_member: memberId,
          company_name: job.company_name,
          start_date: new Date(job.start_date),
          end_date: job.end_date ? new Date(job.end_date) : null,
          icon: job.icon || null,
          description: job.description || null,
        },
      })
    ),

    prisma.skill.deleteMany({ where: { id_community_member: memberId } }),
    ...data.skills.map((skill) =>
      prisma.skill.create({
        data: {
          id_community_member: memberId,
          description: skill.description,
        },
      })
    ),

    prisma.tag.deleteMany({ where: { id_community_member: memberId } }),
    ...data.tags.map((tag) =>
      prisma.tag.create({
        data: {
          id_community_member: memberId,
          tag: tag.tag,
        },
      })
    ),

    prisma.participantEvent.deleteMany({
      where: { id_community_member: memberId },
    }),
    ...data.participantEvents.map((pe) =>
      prisma.participantEvent.create({
        data: {
          id_community_member: memberId,
          id_event: pe.id_event,
        },
      })
    ),

    prisma.groupMember.deleteMany({ where: { id_community_member: memberId } }),
    ...data.groupMemberships.map((gm) =>
      prisma.groupMember.create({
        data: {
          id_community_member: memberId,
          id_group: gm.id_group,
        },
      })
    ),

    prisma.participantCommunityValue.deleteMany({
      where: { id_community_member: memberId },
    }),
    ...data.participantValues.map((pv) =>
      prisma.participantCommunityValue.create({
        data: {
          id_community_member: memberId,
          id_community_value: pv.id_community_value,
          description: pv.description,
        },
      })
    ),
  ]);

  return updatedMember;
}

async function getEmailById(id) {
  return await prisma.communityMember.findUnique({
    where: { id_community_member: id },
    select: {
      email: true
    },
  });
}

export default {
  create,
  getAll,
  getById,
  update,
  remove,
  getMembersNotInGroup,
  updateMemberAndRelations,
  getEmailById,
};
