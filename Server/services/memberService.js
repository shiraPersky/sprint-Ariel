import { ApifyClient } from "apify-client";
import communityMemberData from "../dataLayer/communityMember.data.js";
import linkedinDataLayer from "../dataLayer/linkedin.data.js";

const { getById, getAll, create, update } = communityMemberData;
const { convertLinkedInToCommunityMember, processLinkedInProfile, findMemberByLinkedIn } = linkedinDataLayer;

// Initialize the ApifyClient with API token
const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN || "<YOUR_API_TOKEN>",
});

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

  console.log("Looking up member ID:", parsed);
  const member = await getById(parsed);
  console.log("Found member:", member);
  return member;
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
  console.log("Processing LinkedIn data for:", linkedinData);
  return {
    english_name: linkedinData.fullName || "Unknown User",
    title: linkedinData.headline || "No Title",
    email: linkedinData.email || null,
    phone: linkedinData.phone || null,
    about: linkedinData.summary || linkedinData.about || null,
    city: linkedinData.location || null,
    linkedin_url: linkedinData.linkedinUrl || linkedinData.profileUrl,
    additional_info: JSON.stringify({
      company: linkedinData.company,
      experience: linkedinData.experience,
      education: linkedinData.education,
      skills: formatSkills(linkedinData.skills),
      connections: linkedinData.connectionsCount,
    }),
    years_of_experience: linkedinData.experiences,
    wants_updates: false,
    active: true,
    admin_notes: `Created from LinkedIn scraping at ${new Date().toISOString()}`,
  };
}



function formatSkills(profile) {
  if (!profile.skills || !Array.isArray(profile.skills)) return '';

  return profile.skills.map(skill => skill.title).join(', ');
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

    // שלב 1: בדיקה אם החבר כבר קיים
    const existingMember = await findMemberByLinkedIn(cleanUrl);
    if (existingMember) {
      console.log("👤 Member already exists:", existingMember.english_name);
      return {
        id_community_member: existingMember.id_community_member,
        action: 'already_exists',
        member: existingMember,
        message: `Member already exists: ${existingMember.english_name}`
      };
    }

    // שלב 2: קבלת נתונים מ-LinkedIn
    const linkedinData = await getLinkedInProfileData(cleanUrl);

    // שלב 3: עיבוד הנתונים
    const processedData = processLinkedInData(linkedinData);

    console.log("💾 Creating member with processed data:", {
      name: processedData.english_name,
      title: processedData.title,
      city: processedData.city,
      experience: processedData.years_of_experience,
    });

    // שלב 4: יצירת הפרופיל במערכת באמצעות הפונקציה המעודכנת
    const result = await processLinkedInProfile(processedData);

    console.log("✅ Member creation completed:", result.message);

    return {
      id_community_member: result.member.id_community_member,
      linkedin_data: linkedinData,
      processed_data: processedData,
      action: result.action,
      member: result.member
    };
  } catch (error) {
    console.error("❌ Error in createMemberWithLinkedIn:", error);
    throw error;
  }
}

/**
 * יוצר או מעדכן חבר קהילה עם נתוני LinkedIn מעובדים
 * @param {Object} processedLinkedInData - נתוני LinkedIn מעובדים
 * @returns {Promise<Object>} תוצאת הפעולה
 */
export async function createMemberWithProcessedLinkedInData(processedLinkedInData) {
  try {
    console.log("🔄 Processing LinkedIn data for:", processedLinkedInData.english_name);

    // בדיקה אם החבר כבר קיים
    if (processedLinkedInData.linkedin_url) {
      const existingMember = await findMemberByLinkedIn(processedLinkedInData.linkedin_url);
      if (existingMember) {
        console.log("👤 Member already exists, updating...");
      }
    }

    // שימוש בפונקציה המעודכנת של linkedin.data.js
    const result = await processLinkedInProfile(processedLinkedInData);

    console.log("✅ LinkedIn data processing completed:", result.message);
    return result;

  } catch (error) {
    console.error("❌ Error processing LinkedIn data:", error);
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

export async function createOrUpdateMember(id, data) {
  let parsedId = null;

  // Try to parse the ID if provided
  if (typeof id === "string" && id.trim() !== "") {
    parsedId = parseInt(id.trim(), 10);

    if (!isNaN(parsedId) && parsedId > 0) {
      const existing = await getById(parsedId);

      if (existing) {
        // אם יש נתוני LinkedIn, נעבד אותם דרך הפונקציה המתאימה
        if (data.linkedin_url || data.url || data.profileUrl) {
          try {
            const result = await processLinkedInProfile(data);
            return result.member;
          } catch (error) {
            console.error("Error processing LinkedIn data for update:", error);
            // נמשיך עם העדכון הרגיל אם יש שגיאה
          }
        }
        
        // עדכון רגיל
        return await update(parsedId, data);
      }
    }
  }

  // הכנת השם
  data.english_name = data.english_name || data.fullName || data.name || 'Unknown';

  // אם יש נתוני LinkedIn, נשתמש בפונקציה המתמחה
  if (data.linkedin_url || data.url || data.profileUrl) {
    try {
      const result = await processLinkedInProfile(data);
      return result.member;
    } catch (error) {
      console.error("Error processing LinkedIn data for creation:", error);
      // נמשיך עם היצירה הרגילה אם יש שגיאה
    }
  }

  // יצירה רגילה
  const newMember = await create(data);

  // הסרת שדות לא רצויים לפני החזרה
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
    throw new Error('Failed to retrieve members');
  }
}