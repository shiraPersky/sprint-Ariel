import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * ממיר נתון LinkedIn יחיד למבנה CommunityMember ושומר בבסיס הנתונים
 * @param {Object|Array} linkedinData - נתוני LinkedIn (יכול להיות אובייקט או מערך עם אובייקט אחד)
 * @returns {Promise<Object>} - CommunityMember שנוצר
 */
async function convertLinkedInToCommunityMember(linkedinData) {
  try {
    // אם זה מערך, נקח את האובייקט הראשון
    const profile = Array.isArray(linkedinData) ? linkedinData[0] : linkedinData;
    
    if (!profile) {
      throw new Error("No LinkedIn profile data provided");
    }

    console.log("🔄 Converting LinkedIn profile:", profile.fullName || profile.english_name || profile.firstName + ' ' + profile.lastName);

    // חישוב שנות ניסיון מהתפקיד הנוכחי
    const yearsOfExperience = sumExperienceDuration(profile.experiences || profile.years_of_experience || profile.experience || []);
    console.log("📅 Calculated years of experience:", yearsOfExperience)    ;
    console.log("📊 Profile data:",profile)
    // יצירת CommunityMember עם הנתונים הבסיסיים
    const memberData = {
      english_name: profile.fullName || profile.english_name || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Unknown User',
      title: profile.headline || profile.title || profile.jobTitle || null,
      about: profile.about || profile.summary || null,
      phone: profile.mobileNumber || profile.phone || null,
      email: profile.email || null,
      city: extractCity(profile),
      linkedin_url: profile.linkedinUrl || profile.linkedin_url || profile.profileUrl || null,
      facebook_url: null, // לא זמין בנתוני LinkedIn
      additional_info: createAdditionalInfo(profile),
      wants_updates: false,
      active: true,
      admin_notes: `Created from LinkedIn API at ${new Date().toISOString()}`,
      years_of_experience: yearsOfExperience
    };

    console.log("📊 Prepared member data:", {
      name: memberData.english_name,
      title: memberData.title,
      city: memberData.city,
      experience: memberData.years_of_experience
    });

    // יצירת המשתמש בבסיס הנתונים
    const createdMember = await prisma.communityMember.create({
      data: memberData
    });
function sumExperienceDuration(experiences) {
  if (!Array.isArray(experiences)) return 0;

  let totalMonths = 0;

  experiences.forEach(exp => {
    const caption = exp.caption || '';
    const match = caption.match(/(\d+)\s+yrs?/) || [];
    const years = parseInt(match[1]) || 0;

    const matchMonths = caption.match(/(\d+)\s+mos?/) || [];
    const months = parseInt(matchMonths[1]) || 0;

    totalMonths += (years * 12) + months;
  });

  const totalYears = totalMonths / 12;

  return parseFloat(totalYears.toFixed(2)); // לדוגמה: 9.08
}

    // הוספת מיומנויות (Skills) אם קיימות
    await addSkillsToMember(createdMember.id_community_member, profile.skills);

    // הוספת עבודות (Jobs) אם קיימות
    await addJobsToMember(createdMember.id_community_member, profile.experiences);

    // הוספת תגיות על בסיס מיומנויות מובילות
    await addTagsToMember(createdMember.id_community_member, profile.topSkillsByEndorsements);

    console.log(`✅ Created member: ${memberData.english_name}`);
    return createdMember;

  } catch (error) {
    console.error(`❌ Error creating member:`, error);
    throw error;
  }
}

/**
 * מחלץ את העיר מהנתונים השונים
 * @param {Object} profile - פרופיל LinkedIn
 * @returns {string|null} - שם העיר או null
 */
function extractCity(profile) {
  if (profile.city) return profile.city;
  if (profile.addressWithoutCountry) return profile.addressWithoutCountry;
  if (profile.addressWithCountry) {
    // מנסה לחלץ את העיר מהכתובת המלאה
    const parts = profile.addressWithCountry.split(',');
    return parts[0] ? parts[0].trim() : null;
  }
  return null;
}

/**
 * חושב שנות ניסיון על בסיס התפקיד הנוכחי והניסיון
 * @param {Object} profile - פרופיל LinkedIn
 * @returns {number|null} - שנות ניסיון
 */
function calculateYearsOfExperience(profile) {
  // אם יש נתון ישיר של שנות ניסיון
  if (profile.currentJobDurationInYrs && typeof profile.currentJobDurationInYrs === 'number') {
    return Math.round(profile.currentJobDurationInYrs * 100) / 100; // עיגול לשתי ספרות אחרי הנקודה
  }

  // אם יש מערך ניסיון, נחשב את סך הניסיון
  if (profile.experiences && Array.isArray(profile.experiences)) {
    let totalYears = 0;
    const currentYear = new Date().getFullYear();

    profile.experiences.forEach(exp => {
      const duration = extractDurationFromCaption(exp.caption);
      if (duration) {
        totalYears += duration;
      }
    });

    return totalYears > 0 ? Math.round(totalYears * 100) / 100 : null;
  }

  return null;
}

/**
 * מחלץ משך זמן בשנים מטקסט כמו "1 yr 2 mos"
 * @param {string} caption - טקסט התיאור
 * @returns {number} - שנים כמספר עשרוני
 */
function extractDurationFromCaption(caption) {
  if (!caption) return 0;

  let years = 0;
  let months = 0;

  // חיפוש אחר "X yr" או "X yrs"
  const yearMatch = caption.match(/(\d+)\s*yrs?/);
  if (yearMatch) {
    years = parseInt(yearMatch[1]);
  }

  // חיפוש אחר "X mo" או "X mos"
  const monthMatch = caption.match(/(\d+)\s*mos?/);
  if (monthMatch) {
    months = parseInt(monthMatch[1]);
  }

  return years + (months / 12);
}

/**
 * יוצר מידע נוסף בפורמט JSON
 * @param {Object} profile - פרופיל LinkedIn
 * @returns {string|null} - JSON string או null
 */
function createAdditionalInfo(profile) {
  const additionalInfo = {
    connections: profile.connections || null,
    followers: profile.followers || null,
    companyName: profile.companyName || null,
    companyIndustry: profile.companyIndustry || null,
    companyWebsite: profile.companyWebsite || null,
    companySize: profile.companySize || null,
    publicIdentifier: profile.publicIdentifier || null,
    profilePic: profile.profilePic || null,
    addressCountryOnly: profile.addressCountryOnly || null
  };

  // מחזיר JSON רק אם יש מידע שימושי
  const hasUsefulInfo = Object.values(additionalInfo).some(value => value !== null);
  return hasUsefulInfo ? JSON.stringify(additionalInfo) : null;
}

/**
 * מוסיף מיומנויות לחבר
 * @param {number} memberId - מזהה החבר
 * @param {Array} skills - מערך מיומנויות
 */
async function addSkillsToMember(memberId, skills) {
  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return;
  }

  try {
    const skillsData = skills.map(skill => ({
      id_community_member: memberId,
      description: skill.title || skill.name || skill.description || 'Unknown Skill'
    }));

    await prisma.skill.createMany({
      data: skillsData,
      skipDuplicates: true
    });

    console.log(`📋 Added ${skillsData.length} skills`);
  } catch (error) {
    console.error("Error adding skills:", error);
  }
}

/**
 * מוסיף עבודות לחבר
 * @param {number} memberId - מזהה החבר
 * @param {Array} experiences - מערך ניסיון תעסוקתי
 */
async function addJobsToMember(memberId, experiences) {
  if (!experiences || !Array.isArray(experiences) || experiences.length === 0) {
    return;
  }

  try {
    const jobsData = experiences.map(exp => {
      const { startDate, endDate } = parseDatesFromCaption(exp.caption);
      
      return {
        id_community_member: memberId,
        company_name: extractCompanyName(exp.subtitle) || exp.companyName || 'Unknown Company',
        start_date: startDate,
        end_date: endDate,
        icon: exp.logo || null,
        description: exp.title || exp.position || null
      };
    });

    await prisma.job.createMany({
      data: jobsData,
      skipDuplicates: true
    });

    console.log(`💼 Added ${jobsData.length} jobs`);
  } catch (error) {
    console.error("Error adding jobs:", error);
  }
}

/**
 * מחלץ שם חברה מטקסט כמו "Check Point Software · Full-time"
 * @param {string} subtitle - כותרת משנה
 * @returns {string|null} - שם החברה
 */
function extractCompanyName(subtitle) {
  if (!subtitle) return null;
  
  const parts = subtitle.split(' · ');
  return parts[0] ? parts[0].trim() : null;
}

/**
 * מנתח תאריכים מטקסט כמו "Jun 2024 - Present · 1 yr 2 mos"
 * @param {string} caption - טקסט התיאור
 * @returns {Object} - אובייקט עם startDate ו-endDate
 */
function parseDatesFromCaption(caption) {
  if (!caption) return { startDate: null, endDate: null };

  try {
    const datePart = caption.split(' · ')[0];
    const dates = datePart.split(' - ');
    
    let startDate = null;
    let endDate = null;

    if (dates[0] && dates[0].trim() !== '') {
      try {
        startDate = new Date(dates[0].trim());
        if (isNaN(startDate.getTime())) startDate = null;
      } catch {
        startDate = null;
      }
    }

    if (dates[1] && dates[1].trim() !== '' && !dates[1].includes('Present')) {
      try {
        endDate = new Date(dates[1].trim());
        if (isNaN(endDate.getTime())) endDate = null;
      } catch {
        endDate = null;
      }
    }

    return { startDate, endDate };
  } catch (error) {
    console.error('Error parsing dates:', error);
    return { startDate: null, endDate: null };
  }
}

/**
 * מוסיף תגיות לחבר על בסיס מיומנויות מובילות
 * @param {number} memberId - מזהה החבר
 * @param {string} topSkills - מיומנויות מובילות מופרדות בפסיק
 */
async function addTagsToMember(memberId, topSkills) {
  if (!topSkills || typeof topSkills !== 'string') {
    return;
  }

  try {
    const skillsList = topSkills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    
    if (skillsList.length === 0) return;

    const tagsData = skillsList.map(skill => ({
      id_community_member: memberId,
      tag: skill
    }));

    await prisma.tag.createMany({
      data: tagsData,
      skipDuplicates: true
    });

    console.log(`🏷️ Added ${tagsData.length} tags`);
  } catch (error) {
    console.error("Error adding tags:", error);
  }
}

/**
 * פונקציה עזר לחיפוש חבר קהילה לפי LinkedIn URL
 * @param {string} linkedinUrl - כתובת LinkedIn
 * @returns {Promise<Object|null>} - חבר קהילה או null
 */
async function findMemberByLinkedIn(linkedinUrl) {
  if (!linkedinUrl) return null;

  return await prisma.communityMember.findFirst({
    where: {
      linkedin_url: linkedinUrl
    },
    include: {
      skills: true,
      jobs: true,
      tags: true
    }
  });
}

/**
 * פונקציה עזר לעדכון חבר קהילה קיים
 * @param {number} memberId - מזהה החבר
 * @param {Object} linkedinProfile - פרופיל LinkedIn
 * @returns {Promise<Object>} - חבר קהילה מעודכן
 */
async function updateExistingMember(memberId, linkedinProfile) {
  const profile = Array.isArray(linkedinProfile) ? linkedinProfile[0] : linkedinProfile;
  
  const updateData = {
    english_name: profile.fullName || profile.english_name || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Unknown User',
    title: profile.headline || profile.title || profile.jobTitle || null,
    about: profile.about || profile.summary || null,
    phone: profile.mobileNumber || profile.phone || null,
    email: profile.email || null,
    city: extractCity(profile),
    years_of_experience: calculateYearsOfExperience(profile),
    additional_info: createAdditionalInfo(profile),
    admin_notes: `Updated from LinkedIn API at ${new Date().toISOString()}`
  };

  return await prisma.communityMember.update({
    where: {
      id_community_member: memberId
    },
    data: updateData
  });
}

/**
 * פונקציה ראשית לעיבוד פרופיל LinkedIn יחיד - יוצרת חדש או מעדכנת קיים
 * @param {Object|Array} linkedinData - פרופיל LinkedIn (יכול להיות אובייקט או מערך)
 * @returns {Promise<Object>} - תוצאת הפעולה
 */
async function processLinkedInProfile(linkedinData) {
  try {
    const profile = Array.isArray(linkedinData) ? linkedinData[0] : linkedinData;
    
    if (!profile) {
      throw new Error("No LinkedIn profile data provided");
    }

    const linkedinUrl = profile.linkedinUrl || profile.linkedin_url || profile.profileUrl;
    
    if (linkedinUrl) {
      const existingMember = await findMemberByLinkedIn(linkedinUrl);
      
      if (existingMember) {
        const updatedMember = await updateExistingMember(existingMember.id_community_member, profile);
        console.log(`🔄 Updated member: ${updatedMember.english_name}`);
        return {
          action: 'updated',
          member: updatedMember,
          message: `Updated existing member: ${updatedMember.english_name}`
        };
      }
    }

    // אם לא נמצא חבר קיים, ניצור חדש
    const createdMember = await convertLinkedInToCommunityMember(profile);
    return {
      action: 'created',
      member: createdMember,
      message: `Created new member: ${createdMember.english_name}`
    };

  } catch (error) {
    console.error(`❌ Error processing LinkedIn profile:`, error);
    throw error;
  }
}

/**
 * פונקציה לעיבוד מערך של פרופילי LinkedIn (לשמירה על תאימות לאחור)
 * @param {Array|Object} linkedinData - נתוני LinkedIn
 * @returns {Promise<Object>} - סטטיסטיקות על הפעולה
 */
async function processLinkedInData(linkedinData) {
  let created = 0;
  let updated = 0;
  let errors = 0;

  // אם זה לא מערך, נהפוך אותו למערך
  const profiles = Array.isArray(linkedinData) ? linkedinData : [linkedinData];

  for (const profile of profiles) {
    try {
      const result = await processLinkedInProfile(profile);
      
      if (result.action === 'created') {
        created++;
      } else if (result.action === 'updated') {
        updated++;
      }
      
    } catch (error) {
      console.error(`❌ Error processing profile:`, error);
      errors++;
    }
  }

  return {
    created,
    updated,
    errors,
    total: profiles.length
  };
}

export default {
  convertLinkedInToCommunityMember,
  processLinkedInData,
  processLinkedInProfile,
  findMemberByLinkedIn,
  updateExistingMember
};