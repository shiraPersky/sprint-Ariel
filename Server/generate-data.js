// const { PrismaClient } = require('@prisma/client');
// const https = require('https');
// const http = require('http');
import https from 'https';
import http from 'http';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// English names and data
const englishNames = [
  'John Smith', 'Emma Johnson', 'Michael Brown', 'Sophia Davis', 'William Wilson',
  'Olivia Moore', 'James Taylor', 'Isabella Anderson', 'Benjamin Thomas', 'Ava Jackson',
  'Lucas White', 'Mia Harris', 'Henry Martin', 'Charlotte Thompson', 'Alexander Garcia',
  'Amelia Martinez', 'Daniel Robinson', 'Harper Clark', 'Matthew Rodriguez', 'Evelyn Lewis',
  'David Lee', 'Abigail Walker', 'Joseph Hall', 'Emily Allen', 'Samuel Young',
  'Elizabeth Hernandez', 'Christopher King', 'Sofia Wright', 'Andrew Lopez', 'Avery Hill'
];

const jobTitles = [
  'Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer',
  'DevOps Engineer', 'Marketing Manager', 'Sales Representative', 'HR Manager',
  'Financial Analyst', 'Project Manager', 'Business Analyst', 'QA Engineer',
  'Software Architect', 'Team Lead', 'CTO', 'CEO', 'VP Engineering', 'Technical Consultant',
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile Developer',
  'Cloud Engineer', 'Security Engineer', 'Database Administrator', 'IT Manager'
];

const companies = [
  'Google', 'Microsoft', 'Apple', 'Meta', 'Amazon', 'Netflix', 'Tesla',
  'Salesforce', 'Adobe', 'Intel', 'Nvidia', 'Oracle', 'IBM', 'Cisco',
  'Spotify', 'Uber', 'Airbnb', 'Twitter', 'LinkedIn', 'GitHub',
  'TechCorp Solutions', 'Innovation Labs', 'Digital Dynamics', 'CloudFirst Inc',
  'DataStream Ltd', 'NextGen Systems', 'Quantum Computing Co'
];

const cities = [
  'New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Boston',
  'Seattle', 'Austin', 'Denver', 'Atlanta', 'Portland',
  'Miami', 'Dallas', 'San Diego', 'Phoenix', 'Philadelphia',
  'Toronto', 'London', 'Berlin', 'Amsterdam', 'Barcelona'
];

const skills = [
  'JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker',
  'Kubernetes', 'SQL', 'NoSQL', 'Machine Learning', 'Artificial Intelligence',
  'Project Management', 'Leadership', 'Communication', 'Problem Solving',
  'Teamwork', 'Agile', 'Scrum', 'DevOps', 'Cloud Computing',
  'TypeScript', 'Java', 'C#', 'Go', 'Rust', 'Vue.js', 'Angular',
  'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'REST APIs'
];

const tags = [
  'Senior', 'Junior', 'Mid-level', 'Expert', 'Beginner', 'Mentor',
  'Leader', 'Innovator', 'Problem Solver', 'Team Player', 'Creative',
  'Analytical', 'Strategic', 'Technical', 'Business Oriented', 'Startup Enthusiast',
  'Enterprise', 'Freelancer', 'Consultant', 'Entrepreneur', 'Open Source Contributor'
];

const groupNames = [
  'JavaScript Developers', 'Product Managers Network', 'UX/UI Designers Guild', 'Data Scientists Alliance',
  'DevOps Professionals', 'Project Management Community', 'Tech Entrepreneurs', 'Engineering Leaders',
  'Full Stack Developers', 'Cybersecurity Experts', 'Digital Marketing Pros', 'Mobile App Developers',
  'Cloud Computing Specialists', 'AI/ML Researchers', 'Startup Founders Circle', 'Women in Tech',
  'Remote Workers Unite', 'Tech Mentors Network'
];

const eventTypes = [
  'Meetup', 'Workshop', 'Conference', 'Networking Event', 'Hackathon',
  'Webinar', 'Panel Discussion', 'Tech Talk', 'Training Session', 'Social Event',
  'Code Review Session', 'Lightning Talks', 'Demo Day', 'Career Fair'
];

const communityValues = [
  'Innovation', 'Collaboration', 'Continuous Learning', 'Excellence', 'Integrity',
  'Diversity & Inclusion', 'Growth Mindset', 'Community Support', 'Impact-Driven',
  'Transparency', 'Creativity', 'Mentorship', 'Open Source', 'Sustainability'
];

// Available avatar styles from DiceBear API
const avatarStyles = [
  'adventurer', 'adventurer-neutral', 'avataaars', 'avataaars-neutral',
  'big-ears', 'big-ears-neutral', 'big-smile', 'bottts', 'bottts-neutral',
  'croodles', 'croodles-neutral', 'fun-emoji', 'icons', 'identicon',
  'initials', 'lorelei', 'lorelei-neutral', 'micah', 'miniavs',
  'notionists', 'notionists-neutral', 'open-peeps', 'personas', 'pixel-art',
  'pixel-art-neutral', 'rings', 'shapes', 'thumbs'
];

// Function to fetch image and convert to base64
function fetchImageAsBase64(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const base64 = buffer.toString('base64');
        const mimeType = response.headers['content-type'] || 'image/svg+xml';
        const dataUrl = `data:${mimeType};base64,${base64}`;
        resolve(dataUrl);
      });
    }).on('error', reject);
  });
}

// Function to generate profile picture using DiceBear API
async function generateProfilePicture(name, id) {
  try {
    // Use different avatar styles for variety
    const style = avatarStyles[id % avatarStyles.length];
    const seed = encodeURIComponent(name);
    
    // DiceBear API URL - using SVG format for better quality and smaller size
    const url = `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&size=200`;
    
    console.log(`Generating avatar for ${name} using style: ${style}`);
    
    const base64Image = await fetchImageAsBase64(url);
    return base64Image;
  } catch (error) {
    console.warn(`Failed to generate avatar for ${name}:`, error.message);
    
    // Fallback: create a simple data URL with initials
    const initials = name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2);
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8E8', '#F7DC6F'];
    const bgColor = colors[id % colors.length];
    
    const svg = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="${bgColor}"/>
        <text x="100" y="120" font-family="Arial, sans-serif" font-size="60" font-weight="bold" 
              text-anchor="middle" fill="white">${initials}</text>
      </svg>
    `;
    
    const base64 = Buffer.from(svg).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
  }
}

// Utility functions
function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateEmail(name) {
  const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'company.com', 'tech.co'];
  const sanitizedName = name.toLowerCase().replace(/[^a-z ]/g, '').replace(/ /g, '.');
  return `${sanitizedName}@${getRandomItem(domains)}`;
}

function generatePhone() {
  const areaCodes = ['555', '646', '212', '415', '650', '408', '510', '925'];
  const areaCode = getRandomItem(areaCodes);
  const exchange = Math.floor(Math.random() * 900) + 100;
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `+1-${areaCode}-${exchange}-${number}`;
}

async function generateData() {
  console.log('🚀 Starting to generate fake data...');
  
  try {
    // Create/update database schema
    console.log('🏗️ Creating/updating database schema...');
    try {
      const { execSync } = require('child_process');
      
      // Run Prisma commands to ensure database is up to date
      console.log('   📋 Generating Prisma client...');
      execSync('npx prisma generate', { stdio: 'inherit' });
      
      console.log('   🔄 Pushing schema to database...');
      execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
      
      console.log('   ✅ Database schema is ready!');
    } catch (schemaError) {
      console.log('   ⚠️ Schema setup had issues, continuing with existing database...');
      console.log('   💡 Make sure your DATABASE_URL is correct in .env file');
    }

    // Clean existing data
    console.log('🗑️ Cleaning existing data...');
    await prisma.participantEvent.deleteMany();
    await prisma.participantCommunityValue.deleteMany();
    await prisma.groupMember.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.job.deleteMany();
    await prisma.communityMember.deleteMany();
    await prisma.event.deleteMany();
    await prisma.group.deleteMany();
    await prisma.communityValue.deleteMany();

    // Create Community Values
    console.log('📝 Creating Community Values...');
    const createdValues = [];
    for (const value of communityValues) {
      const communityValue = await prisma.communityValue.create({
        data: { type: value }
      });
      createdValues.push(communityValue);
    }

    // Create Groups
    console.log('👥 Creating Groups...');
    const createdGroups = [];
    for (const groupName of groupNames) {
      const group = await prisma.group.create({
        data: { group_name: groupName }
      });
      createdGroups.push(group);
    }

    // Create Events
    console.log('🎉 Creating Events...');
    const createdEvents = [];
    const eventDescriptions = [
      'AI in Practice: Real-world Applications', 'Future of Web Development', 
      'Leadership in Tech Workshop', 'Innovation Summit 2025', 'Startup Pitch Night',
      'Code Review Best Practices', 'Career Development Masterclass', 'Product Launch Strategy',
      'Team Building & Collaboration', 'Industry Trends Analysis', 'Remote Work Excellence',
      'Cybersecurity Awareness', 'Cloud Computing Deep Dive', 'Data Science Bootcamp',
      'Mobile Development Trends', 'Open Source Contribution Guide', 'Women in Tech Panel',
      'Entrepreneurship 101', 'DevOps Transformation', 'UX Design Thinking Workshop'
    ];

    for (let i = 0; i < 20; i++) {
      const event = await prisma.event.create({
        data: {
          description: getRandomItem(eventDescriptions),
          type: getRandomItem(eventTypes),
          time: getRandomDate(new Date('2024-01-01'), new Date('2025-12-31')),
          location: `${getRandomItem(cities)} - ${getRandomItem(['Tech Hub', 'Convention Center', 'University Campus', 'Google Office', 'Microsoft HQ', 'WeWork Space', 'Innovation Center', 'Business District', 'Startup Incubator', 'Conference Hall'])}`
        }
      });
      createdEvents.push(event);
    }

    // Create Community Members with profile pictures
    console.log('👤 Creating Community Members with avatars...');
    const createdMembers = [];
    
    for (let i = 0; i < englishNames.length; i++) {
      const name = englishNames[i];
      console.log(`Creating member ${i + 1}/${englishNames.length}: ${name}`);
      
      // Generate profile picture
      const profilePictureBase64 = await generateProfilePicture(name, i + 1);
      
      // Add a small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const member = await prisma.communityMember.create({
        data: {
          english_name: name,
          title: getRandomItem(jobTitles),
          about: `${getRandomItem(['Passionate', 'Experienced', 'Creative', 'Innovative', 'Dedicated', 'Results-driven', 'Strategic'])} ${getRandomItem(jobTitles).toLowerCase()} with ${Math.floor(Math.random() * 15) + 1} years of experience in the tech industry. ${getRandomItem(['Love working with cutting-edge technologies', 'Enjoy solving complex problems', 'Passionate about mentoring others', 'Always eager to learn new technologies', 'Focused on delivering high-quality solutions', 'Committed to continuous improvement', 'Believe in collaborative team work'])}. ${getRandomItem(['Open to new challenges', 'Looking for exciting opportunities', 'Ready to make an impact', 'Eager to contribute to innovative projects'])}.`,
          phone: generatePhone(),
          email: generateEmail(name),
          city: getRandomItem(cities),
          linkedin_url: `https://linkedin.com/in/${name.toLowerCase().replace(' ', '-')}`,
          facebook_url: Math.random() > 0.6 ? `https://facebook.com/${name.toLowerCase().replace(' ', '.')}` : null,
          additional_info: Math.random() > 0.4 ? `${getRandomItem(['Available for freelance projects', 'Looking for new opportunities', 'Open to collaboration', 'Interested in startup ventures', 'Available for mentoring', 'Seeking remote work', 'Interested in speaking opportunities', 'Open to consulting work'])}` : null,
          wants_updates: Math.random() > 0.2,
          active: Math.random() > 0.05,
          admin_notes: Math.random() > 0.7 ? `${getRandomItem(['VIP member', 'Event organizer', 'Mentor', 'Speaker', 'Community leader', 'Early adopter', 'Regular contributor', 'Thought leader'])}` : null,
          profile_picture_url: profilePictureBase64,
          years_of_experience: Math.floor(Math.random() * 20) + 1,
          community_value_id: Math.random() > 0.4 ? getRandomItem(createdValues).id_community_value : null
        }
      });
      createdMembers.push(member);
      
      // Create jobs for member
      const numJobs = Math.floor(Math.random() * 4) + 1;
      let currentDate = new Date();
      
      for (let j = 0; j < numJobs; j++) {
        const yearsBack = Math.random() * 10 + (j * 2);
        const startDate = new Date(currentDate.getTime() - yearsBack * 365 * 24 * 60 * 60 * 1000);
        const jobDuration = Math.random() * 4 + 0.5; // 6 months to 4.5 years
        const endDate = j === 0 ? null : new Date(startDate.getTime() + jobDuration * 365 * 24 * 60 * 60 * 1000);
        
        const jobDescriptions = [
          'Developed and maintained web applications using modern technologies',
          'Led cross-functional teams to deliver high-quality software solutions',
          'Designed and implemented scalable cloud infrastructure',
          'Created data-driven insights and machine learning models',
          'Managed product roadmap and stakeholder communications',
          'Built responsive user interfaces with focus on user experience',
          'Implemented DevOps practices and CI/CD pipelines',
          'Conducted security audits and vulnerability assessments',
          'Mentored junior developers and established coding standards',
          'Collaborated with clients to understand and deliver business requirements'
        ];
        
        await prisma.job.create({
          data: {
            company_name: getRandomItem(companies),
            id_community_member: member.id_community_member,
            start_date: startDate,
            end_date: endDate,
            description: `${getRandomItem(jobDescriptions)}. Utilized ${getRandomItems(skills, 3).join(', ')} to achieve project goals.`
          }
        });
        
        currentDate = startDate;
      }
      
      // Create skills
      const memberSkills = getRandomItems(skills, Math.floor(Math.random() * 10) + 4);
      for (const skill of memberSkills) {
        await prisma.skill.create({
          data: {
            id_community_member: member.id_community_member,
            description: skill
          }
        });
      }
      
      // Create tags
      const memberTags = getRandomItems(tags, Math.floor(Math.random() * 5) + 2);
      for (const tag of memberTags) {
        await prisma.tag.create({
          data: {
            id_community_member: member.id_community_member,
            tag: tag
          }
        });
      }
    }

    // Create group memberships
    console.log('🔗 Creating group memberships...');
    for (const member of createdMembers) {
      const memberGroups = getRandomItems(createdGroups, Math.floor(Math.random() * 5) + 1);
      for (const group of memberGroups) {
        await prisma.groupMember.create({
          data: {
            id_community_member: member.id_community_member,
            id_group: group.id_group
          }
        });
      }
    }

    // Create event participations
    console.log('🎪 Creating event participations...');
    for (const member of createdMembers) {
      const memberEvents = getRandomItems(createdEvents, Math.floor(Math.random() * 8) + 2);
      for (const event of memberEvents) {
        await prisma.participantEvent.create({
          data: {
            id_community_member: member.id_community_member,
            id_event: event.id_event
          }
        });
      }
    }

    // Create community value associations
    console.log('💎 Creating community value associations...');
    for (const member of createdMembers) {
      const memberValues = getRandomItems(createdValues, Math.floor(Math.random() * 4) + 1);
      for (const value of memberValues) {
        const descriptions = [
          `Strong believer in ${value.type.toLowerCase()} and apply it in all my work`,
          `Passionate advocate for ${value.type.toLowerCase()} in tech communities`,
          `Committed to promoting ${value.type.toLowerCase()} through mentorship and leadership`,
          `Focus on ${value.type.toLowerCase()} as a core principle in my career`,
          `Dedicated to advancing ${value.type.toLowerCase()} in the workplace`
        ];
        
        await prisma.participantCommunityValue.create({
          data: {
            id_community_member: member.id_community_member,
            id_community_value: value.id_community_value,
            description: getRandomItem(descriptions)
          }
        });
      }
    }

    console.log('✅ Successfully completed generating fake data!');
    console.log(`📊 Created: ${createdMembers.length} community members, ${createdGroups.length} groups, ${createdEvents.length} events`);
    console.log(`🖼️ Profile pictures generated using DiceBear API and stored as base64 data URLs`);
    console.log(`🌟 All data is now ready for use in your application!`);
    
  } catch (error) {
    console.error('❌ Error generating data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
generateData();