import { ApifyClient } from "apify-client";
import communityMemberData from "../dataLayer/communityMember.data.js";
import groupData from "../dataLayer/group.data.js";
import axios from "axios";
const { getById, getAll, create, update } = communityMemberData;

// Initialize the ApifyClient with API token
const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN || "<YOUR_API_TOKEN>",
});

export async function updateGroupName(id_group, new_name) {
  if (!id_group || !new_name) {
    throw new Error("Group ID and new name are required");
  }

  const group = await groupData.getById(id_group);
  if (!group) {
    throw new Error("Group not found");
  }

  const updated = await groupData.update(id_group, {
    group_name: new_name,
  });

  return updated;
}

export async function getMemberById(id) {
  let parsed = parseAndValidateId(id);
  console.log("parseInt ID:", parsed);
  const member = await getById(parsed);
  console.log("Found member:", member);
  return member;
}

function parseAndValidateId(id) {
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

    const input = {
      profileUrls: [linkedin_url],
      includeUnlistedData: true,
      maxRequestRetries: 3,
      maxProfilesCrawled: 1,
    };

    const run = await client.actor("2SyF0bVxmgGr8IVCZ").call(input);
    console.log("✅ Apify run completed:", run.id);

    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    if (!items || items.length === 0) {
      throw new Error("No profile data found");
    }

    const profileData = items[0];
    console.log("📊 Profile data retrieved:", {
      name: profileData.fullName,
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
 * מעבד skills מ-LinkedIn
 * @param {Array} skills - רשימת skills
 * @returns {Array} skills מעובדים
 */
function processSkills(skills) {
  if (!skills || !Array.isArray(skills)) return [];
  
  return skills.map(skill => {
    if (typeof skill === 'string') {
      return { description: skill };
    }
    
    // אם זה אובייקט מורכב עם title
    if (skill && typeof skill === 'object' && skill.title) {
      return { description: skill.title };
    }
    
    // אם זה אובייקט עם name או description
    if (skill && typeof skill === 'object') {
      return { description: skill.name || skill.description || 'Unknown Skill' };
    }
    
    return { description: 'Unknown Skill' };
  });
}

/**
 * מעבד jobs מ-LinkedIn experiences
 * @param {Array} experiences - רשימת משרות
 * @returns {Array} jobs מעובדים
 */
function processJobs(experiences) {
  if (!experiences || !Array.isArray(experiences)) return [];
  
  const jobs = [];
  console.log("Processing jobs from experiences:", experiences);
  experiences.forEach(exp => {
    // חילוץ שם החברה
    console.log("Processing experience:", exp);
    let companyName = "Unknown Company";
    if (exp.subtitle && typeof exp.subtitle === 'string') {
      companyName = exp.subtitle +" " + exp.title;
    } else if (exp.companyName) {
      companyName = exp.subtitle +" " + exp.title;
    }
    
    // אם יש subComponents (תפקידים מרובים באותה חברה)
    if (exp.subComponents && Array.isArray(exp.subComponents)) {
      exp.subComponents.forEach(subJob => {
        console.log("Processing subJob:", subJob);
        const startDate = parseLinkedInDate(subJob.caption) || new Date();
        const endDate = parseLinkedInEndDate(subJob.caption);
        const description = extractJobDescription(subJob);
        
        jobs.push({
          company_name: companyName,
          start_date: startDate,
          end_date: endDate,
          description: description
        });
      });
    } else {
      // תפקיד יחיד
      const startDate = parseLinkedInDate(exp.caption || exp.subtitle) || new Date();
      const endDate = parseLinkedInEndDate(exp.caption || exp.subtitle);
      const description = extractJobDescription(exp.title);
      const companyName = extractJobDescription(exp.subtitle) + description || "Unknown Company";
      jobs.push({
        company_name: companyName,
        start_date: startDate,
        end_date: endDate,
        description: description
      });
    }
  });
  
  return jobs;
}

/**
 * מחלץ תיאור משרה מהמבנה המורכב
 * @param {Object} jobData - נתוני המשרה
 * @returns {string|null} תיאור המשרה
 */
function extractJobDescription(jobData) {
  // אם יש title פשוט
  if (jobData.title && typeof jobData.title === 'string') {
    return jobData.title;
  }
  
  // אם יש subtitle
  if (jobData.subtitle && typeof jobData.subtitle === 'string') {
    return jobData.subtitle;
  }
  
  // אם יש description כarray של אובייקטים
  if (jobData.description && Array.isArray(jobData.description)) {
    const textComponents = jobData.description
      .filter(item => item && item.type === 'textComponent' && item.text)
      .map(item => item.text);
    
    if (textComponents.length > 0) {
      return textComponents.join(' ').trim();
    }
  }
  
  // אם יש description כstring
  if (typeof jobData.description === 'string') {
    return jobData.description;
  }
  
  // אם יש subComponents עם description
  if (jobData.subComponents && Array.isArray(jobData.subComponents)) {
    for (const subComp of jobData.subComponents) {
      if (subComp.description && Array.isArray(subComp.description)) {
        const textComponents = subComp.description
          .filter(item => item && item.type === 'textComponent' && item.text)
          .map(item => item.text);
        
        if (textComponents.length > 0) {
          return textComponents.join(' ').trim();
        }
      }
    }
  }
  
  return null;
}

/**
 * מנתח תאריכים מ-LinkedIn בפורמט caption
 * @param {string} caption - טקסט עם תאריך (כמו "Feb 2025 - Present · 6 mos")
 * @returns {Date|null} תאריך התחלה
 */
function parseLinkedInDate(caption) {
  if (!caption || typeof caption !== 'string') return null;
  
  // חיפוש פטרן של תאריך התחלה
  const startDateMatch = caption.match(/([A-Za-z]{3})\s+(\d{4})/);
  if (startDateMatch) {
    const [, month, year] = startDateMatch;
    return new Date(`${month} 1, ${year}`);
  }
  
  // אם לא נמצא, ננסה פורמט אחר
  const yearMatch = caption.match(/(\d{4})/);
  if (yearMatch) {
    return new Date(`Jan 1, ${yearMatch[1]}`);
  }
  
  return null;
}

/**
 * מנתח תאריך סיום מ-LinkedIn caption
 * @param {string} caption - טקסט עם תאריך
 * @returns {Date|null} תאריך סיום או null אם עדיין עובד
 */
function parseLinkedInEndDate(caption) {
  if (!caption || typeof caption !== 'string') return null;
  
  // אם יש "Present" זה אומר שעדיין עובד
  if (caption.includes('Present')) return null;
  
  // חיפוש פטרן של תאריך סיום
  const endDateMatch = caption.match(/([A-Za-z]{3})\s+(\d{4})\s*-\s*([A-Za-z]{3})\s+(\d{4})/);
  if (endDateMatch) {
    const [, , , endMonth, endYear] = endDateMatch;
    return new Date(`${endMonth} 1, ${endYear}`);
  }
  
  return null;
}

/**
 * מנתח תאריכים מ-LinkedIn (פונקציה מקורית לתאריכים פשוטים)
 * @param {string} dateString - תאריך בפורמט string
 * @returns {Date|null} תאריך מפורסר
 */
function parseDate(dateString) {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * מעבד את הנתונים מ-LinkedIn לפורמט של המערכת
 * @param {Object} linkedinData - נתונים גולמיים מ-LinkedIn
 * @returns {Object} נתונים מעובדים
 */
async  function processLinkedInData(linkedinData) {
  const profilePictureBase64 = await encodeImageToBase64(
    linkedinData.profilePic || linkedinData.profilePicture || null
  );
  console.log("📷 Profile picture encoded to Base64:", linkedinData.fullName);
  console.log(linkedinData)
  if (typeof linkedinData.wants_updates !== 'boolean') {
  delete linkedinData.wants_updates;
  }
  const baseData = {
    english_name: linkedinData.fullName || "Unknown User",
    title: linkedinData.headline || "No Title",
    email: linkedinData.email || null,
    phone: linkedinData.phone || null,
    profile_picture_url:  profilePictureBase64 ,
    about: linkedinData.summary || linkedinData.about || null,
    city: linkedinData.addressWithCountry || linkedinData.addressCountryOnly || linkedinData.addressWithoutCountry || null,
    linkedin_url: linkedinData.linkedinUrl || linkedinData.profileUrl,
    additional_info: JSON.stringify({
      company: linkedinData.company,
      education: linkedinData.education,
      connections: linkedinData.connectionsCount,
    }),
    years_of_experience: calculateExperience(linkedinData.experiences || linkedinData.experience),
    wants_updates:
  typeof linkedinData.wants_updates === 'boolean'
    ? linkedinData.wants_updates
    : typeof linkedinData.wants_updates === 'string' &&
      (linkedinData.wants_updates.toLowerCase() === 'true' ||
       linkedinData.wants_updates.toLowerCase() === 'false')
      ? linkedinData.wants_updates.toLowerCase() === 'true'
      : undefined,

    active: true,
    admin_notes: `Created from LinkedIn scraping at ${new Date().toISOString()}`,
  };

  // הוספת skills אם קיימים
  if (linkedinData.skills && linkedinData.skills.length > 0) {
    baseData.skills = {
      create: processSkills(linkedinData.skills)
    };
  }

  // הוספת jobs אם קיימים
  const experiences = linkedinData.experiences || linkedinData.experience;
  console
  if (experiences && experiences.length > 0) {
    baseData.jobs = {
      create: processJobs(experiences)
    };
  }

  return baseData;
}

async function encodeImageToBase64(imageUrl) {
  if (!imageUrl) return null;
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:image/jpeg;base64,${base64}`;
}


/**
 * מחשב שנות ניסיון על סמך רשימת המשרות
 * @param {Array} experience - רשימת משרות
 * @returns {number} שנות ניסיון
 */
function calculateExperience(experience) {
  if (!experience || !Array.isArray(experience)) {
    return 0.0;
  }
  
  console.log("Calculating experience from:", experience);
  let totalYears = 0.0;

  experience.forEach((job) => {
    // אם יש subtitle עם פורמט ישן
    if (job.subtitle) {
      const yearsMatch = job.subtitle.match(/(\d+)\s*yrs?/);
      const monthsMatch = job.subtitle.match(/(\d+)\s*mos?/);
      
      let years = 0;
      let months = 0;
      
      if (yearsMatch) {
        years = parseInt(yearsMatch[1], 10);
      }
      
      if (monthsMatch) {
        months = parseInt(monthsMatch[1], 10);
      }
      
      totalYears += years + (months / 12);
    }
    
    // אם יש subComponents - מחשב לכל תפקיד
    if (job.subComponents && Array.isArray(job.subComponents)) {
      job.subComponents.forEach(subJob => {
        if (subJob.caption) {
          const duration = calculateJobDuration(subJob.caption);
          totalYears += duration;
        }
      });
    } else if (job.caption) {
      // תפקיד יחיד
      const duration = calculateJobDuration(job.caption);
      totalYears += duration;
    }
  });

  return parseFloat(Math.min(totalYears, 50.0).toFixed(1)); // מקסימום 50 שנות ניסיון
}

/**
 * מחשב משך זמן של תפקיד על סמך caption
 * @param {string} caption - טקסט כמו "Feb 2024 - Feb 2025 · 1 yr 1 mo"
 * @returns {number} שנות ניסיון עבור התפקיד הזה
 */
function calculateJobDuration(caption) {
  if (!caption) return 0;
  
  // חיפוש פטרן של משך זמן בסגנון "1 yr 6 mos"
  const durationMatch = caption.match(/(\d+)\s*yrs?\s*(?:(\d+)\s*mos?)?|(\d+)\s*mos?/);
  
  if (durationMatch) {
    let years = 0;
    let months = 0;
    
    if (durationMatch[1]) {
      years = parseInt(durationMatch[1], 10);
    }
    if (durationMatch[2]) {
      months = parseInt(durationMatch[2], 10);
    }
    if (durationMatch[3] && !durationMatch[1]) {
      months = parseInt(durationMatch[3], 10);
    }
    
    return years + (months / 12);
  }
  
  // אם לא נמצא פטרן, ננסה לחשב מהתאריכים
  const startDate = parseLinkedInDate(caption);
  const endDate = parseLinkedInEndDate(caption) || new Date(); // אם אין תאריך סיום, זה עדיין עובד
  
  if (startDate) {
    const diffMs = endDate - startDate;
    const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
    return Math.max(0, diffYears);
  }
  
  return 0;
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
    console.log("📥 LinkedIn data retrieved:", linkedinData);
    
    // שלב 2: עיבוד הנתונים
    const processedData = await processLinkedInData(linkedinData);

    console.log("💾 Creating member with processed data:", {
      name: processedData.english_name,
      title: processedData.title,
      city: processedData.city,
      experience: processedData.years_of_experience,
    });

    // שלב 3: יצירת הפרופיל במערכת
    const prismaReadyData = prepareDataForPrisma(processedData, false);
    const newMember = await create(prismaReadyData);

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
    throw error;
  }
}

/**
 * מכין נתונים לפריזמה עם relations
 * @param {Object} data - נתונים גולמיים
 * @param {boolean} isUpdate - האם זה עדכון
 * @returns {Object} נתונים מוכנים לפריזמה
 */
function prepareDataForPrisma(data, isUpdate = false) {
  const {
    skills,
    participantValues,
    jobs,
    ...rest
  } = data;

  const prismaData = { ...rest };

  const rawWantsUpdates = data.wants_updates;

if (typeof rawWantsUpdates === 'boolean') {
  prismaData.wants_updates = rawWantsUpdates;
} else if (typeof rawWantsUpdates === 'string') {
  const lowered = rawWantsUpdates.toLowerCase();
  if (lowered === 'true') {
    prismaData.wants_updates = true;
  } else if (lowered === 'false') {
    prismaData.wants_updates = false;
  } 
}



  if (Array.isArray(skills)) {
    prismaData.skills = isUpdate
      ? {
          deleteMany: {},
          create: skills.map(skill => {
            if (typeof skill === 'object' && skill.description) {
              return { description: skill.description };
            }
            return { description: typeof skill === 'string' ? skill : skill.title || skill.name || 'Unknown Skill' };
          }),
        }
      : {
          create: skills.map(skill => {
            if (typeof skill === 'object' && skill.description) {
              return { description: skill.description };
            }
            return { description: typeof skill === 'string' ? skill : skill.title || skill.name || 'Unknown Skill' };
          }),
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
            company_name: job.company_name || "Unknown Company",
            start_date: job.start_date ? new Date(job.start_date) : new Date(),
            end_date: job.end_date ? new Date(job.end_date) : null,
            description: extractJobDescription(job) || job.description || null
          })),
        }
      : {
          create: jobs.map(job => ({
            company_name: job.company_name || "Unknown Company",
            start_date: job.start_date ? new Date(job.start_date) : new Date(),
            end_date: job.end_date ? new Date(job.end_date) : null,
            description: extractJobDescription(job) || job.description || null
          })),
        };
  }

  return prismaData;
}

/**
 * יוצר או מעדכן חבר קהילה
 * @param {string|number} id - מזהה החבר
 * @param {Object} data - נתוני החבר
 * @returns {Promise<Object>} החבר שנוצר או עודכן
 */
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