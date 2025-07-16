import { ApifyClient } from "apify-client";
import communityMemberData from "../dataLayer/communityMember.data.js";

const { getById, getAll, create , update} = communityMemberData;

// Initialize the ApifyClient with API token
const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN || "<YOUR_API_TOKEN>",
});

export async function getMemberById(id) {
  let parsed=parseAndValidateId(id)
  console.log("parseInt  ID:", parsed);
  const member = await getById(parsed);
  console.log("Found member:", member);
  return member;
}



function parseAndValidateId(id) {
  //if (typeof id !== "string") throw new Error("ID must be a string");
  const parsed = parseInt(id.trim(), 10);
  if (isNaN(parsed) || parsed < 1) throw new Error("Invalid ID");
  return parsed;
}

export async function getMemberForAdmin(id) {
 
  return await getMemberById(id); // מחזיר הכל
}

export async function getMemberForUser(id) {
  
  const full = await getMemberById(id);

  const {
    tags,
    participantEvents,
    groupMemberships,
    ...sanitized
  } = full;

  return sanitized;
}


export async function getAllMembers() {
  try {
    const members = await getAll();
    return members;
  } catch (error) {
    // אפשר להוסיף לוג שגיאות פה
    throw new Error("Failed to retrieve members");
  }
}

/**
 * מקבל מידע מ-LinkedIn באמצעות Apify
 * @param {string} linkedin_url - כתובת הפרופיל בלינקדאין
 * @returns {Promise<Object>} מידע הפרופיל
 */
async function getLinkedInProfileData(linkedin_url) {
  try {
    console.log("🔍 Fetching LinkedIn profile data for:", linkedin_url);

    // הכנת הנתונים עבור Apify Actor
    const input = {
      profileUrls: [linkedin_url],
      includeUnlistedData: true, // כלול נתונים נסתרים
      maxRequestRetries: 3,
      maxProfilesCrawled: 1,
    };

    // הרצת ה-Actor והמתנה לסיום
    const run = await client.actor("2SyF0bVxmgGr8IVCZ").call(input);

    console.log("✅ Apify run completed:", run.id);

    // קבלת התוצאות מהדאטאסט
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    if (!items || items.length === 0) {
      throw new Error("No profile data found");
    }

    const profileData = items[0];
    console.log("📊 Profile data retrieved:", {
      name: profileData.name,
      headline: profileData.headline,
      location: profileData.location,
    });

    return profileData;
  } catch (error) {
    console.error("❌ Error fetching LinkedIn profile:", error);
    throw new Error(`Failed to fetch LinkedIn profile: ${error.message}`);
  }
}

/**
 * מעבד את הנתונים מ-LinkedIn לפורמט של המערכת
 * @param {Object} linkedinData - נתונים גולמיים מ-LinkedIn
 * @returns {Object} נתונים מעובדים
 */
function processLinkedInData(linkedinData) {
  return {
    english_name: linkedinData.name || "Unknown User",
    title: linkedinData.headline || "No Title",
    email: linkedinData.email || null,
    phone: linkedinData.phone || null,
    about: linkedinData.summary || linkedinData.about || null,
    city: linkedinData.location || null,
    linkedin_url: linkedinData.url || linkedinData.profileUrl,
    additional_info: JSON.stringify({
      company: linkedinData.company,
      experience: linkedinData.experience,
      education: linkedinData.education,
      skills: linkedinData.skills,
      connections: linkedinData.connectionsCount,
    }),
    years_of_experience: calculateExperience(linkedinData.experience),
    wants_updates: false,
    active: true,
    admin_notes: `Created from LinkedIn scraping at ${new Date().toISOString()}`,
  };
}

/**
 * מחשב שנות ניסיון על סמך רשימת המשרות
 * @param {Array} experience - רשימת משרות
 * @returns {number} שנות ניסיון
 */
function calculateExperience(experience) {
  if (!experience || !Array.isArray(experience)) {
    return 0;
  }

  let totalYears = 0;
  const currentYear = new Date().getFullYear();

  experience.forEach((job) => {
    if (job.startDate && job.endDate) {
      const startYear = new Date(job.startDate).getFullYear();
      const endYear = job.endDate.toLowerCase().includes("present")
        ? currentYear
        : new Date(job.endDate).getFullYear();
      totalYears += Math.max(0, endYear - startYear);
    }
  });

  return Math.min(totalYears, 50); // מקסימום 50 שנות ניסיון
}

/**
 * יוצר חבר קהילה חדש עם נתוני LinkedIn
 * @param {string} linkedin_url - כתובת הפרופיל בלינקדאין
 * @returns {Promise<Object>} הפרופיל החדש שנוצר
 */
export async function createMemberWithLinkedIn(linkedin_url) {
  // בדיקת תקינות URL
  if (typeof linkedin_url !== "string" || linkedin_url.trim() === "") {
    const error = new Error(
      "linkedin_url is required and must be a non-empty string"
    );
    error.status = 400;
    throw error;
  }

  const cleanUrl = linkedin_url.trim();

  if (!cleanUrl.startsWith("http")) {
    const error = new Error("linkedin_url must be a valid URL");
    error.status = 400;
    throw error;
  }

  // בדיקה שזה באמת URL של LinkedIn
  if (!cleanUrl.includes("linkedin.com")) {
    const error = new Error("URL must be a LinkedIn profile URL");
    error.status = 400;
    throw error;
  }

  try {
    console.log("🚀 Starting LinkedIn member creation process...");

    // שלב 1: קבלת נתונים מ-LinkedIn
    const linkedinData = await getLinkedInProfileData(cleanUrl);

    // שלב 2: עיבוד הנתונים
    const processedData = processLinkedInData(linkedinData);

    console.log("💾 Creating member with processed data:", {
      name: processedData.english_name,
      title: processedData.title,
      city: processedData.city,
      experience: processedData.years_of_experience,
    });

    // שלב 3: יצירת הפרופיל במערכת
    const newMember = await create(processedData);

    console.log(
      "✅ Member created successfully:",
      newMember.id_community_member
    );

    return {
      id_community_member: newMember.id_community_member,
      linkedin_data: linkedinData,
      processed_data: processedData,
    };
  } catch (error) {
    console.error("❌ Error in createMemberWithLinkedIn:", error);

    // אם יש שגיאה בשליפת נתוני LinkedIn, נזרוק את השגיאה
    throw error;
  }
}

/**
 * דוגמה לשימוש
 */
export async function testLinkedInScraping() {
  try {
    const testUrls = [
      "https://www.linkedin.com/in/williamhgates",
      "https://www.linkedin.com/in/jeannie-wyrick-b4760710a",
    ];

    for (const url of testUrls) {
      console.log(`\n🧪 Testing: ${url}`);
      const result = await createMemberWithLinkedIn(url);
      console.log("Result:", result);
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  testLinkedInScraping();
}

function prepareDataForPrisma(data, isUpdate = false) {
  const {
    skills,
    participantValues,
    jobs,
    ...rest
  } = data;

  const prismaData = { ...rest };

  if (Array.isArray(skills)) {
    prismaData.skills = isUpdate
      ? {
          deleteMany: {},
          create: skills.map(description => ({ description })),
        }
      : {
          create: skills.map(description => ({ description })),
        };
  }

  if (Array.isArray(participantValues)) {
    prismaData.participantValues = isUpdate
      ? {
          deleteMany: {},
          create: participantValues.map(({ id_community_value, description }) => ({
            id_community_value,
            description,
          })),
        }
      : {
          create: participantValues.map(({ id_community_value, description }) => ({
            id_community_value,
            description,
          })),
        };
  }

  if (Array.isArray(jobs)) {
    prismaData.jobs = isUpdate
      ? {
          deleteMany: {},
          create: jobs.map(job => ({
            ...job,
            start_date: job.start_date ? new Date(job.start_date) : undefined,
            end_date: job.end_date ? new Date(job.end_date) : undefined,
          })),
        }
      : {
          create: jobs.map(job => ({
            ...job,
            start_date: job.start_date ? new Date(job.start_date) : undefined,
            end_date: job.end_date ? new Date(job.end_date) : undefined,
          })),
        };
  }

  return prismaData;
}

export async function createOrUpdateMember(id, data) {
  let parsedId = null;

  if (typeof id === "string" && id.trim() !== "") {
    parsedId = parseInt(id.trim(), 10);

    if (!isNaN(parsedId) && parsedId > 0) {
      const existing = await getById(parsedId);
      if (existing) {
        const updateData = prepareDataForPrisma(data, true);
        return await update(parsedId, updateData);
      }
    }
  }
console.log("Creating new member with data:", data);
  data.english_name = data.english_name || data.fullName || 'Unknown';
  const createData = prepareDataForPrisma(data, false);
  const newMember = await create(createData);
  return newMember;
}
