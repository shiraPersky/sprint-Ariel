// services/analyzeCvWithGPT.js
import { config } from 'dotenv';
import { OpenAI } from 'openai';

config(); 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeCvText(cvText) {
 const prompt = `
You will be given raw text of a CV. Extract the relevant fields for the following Prisma model and return as a valid JSON object for database insertion.

If any field is not found in the text, DO NOT include it in the output at all — leave it out entirely.

model CommunityMember {
  english_name        String
  title               String?
  about               String?
  phone               String?
  email               String?
  city                String?
  linkedin_url        String?
  facebook_url        String?
  additional_info     String?
  wants_updates       Boolean
  active              Boolean
  admin_notes         String?
  years_of_experience Float?
  jobs                Job[]
  skills              Skill[]
  tags                Tag[]
}

Each job in "jobs" should include:
- company_name: string
- start_date: string (format: YYYY-MM-DD)
- end_date: string or null
- icon: null
- description: string

Each skill in "skills" should include:
- description: string

Each tag in "tags" should include:
- tag: string

Return ONLY a clean JSON object without extra text.

CV TEXT:
---
${cvText}
---
`;



  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are an assistant that extracts structured data from CVs for database entry.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.2,
  });

  const content = completion.choices[0].message.content;

  try {
  const parsed = JSON.parse(content);

  // 🔧 נוודא ש-wants_updates הוא באמת boolean
  if ('wants_updates' in parsed) {
    parsed.wants_updates =
      parsed.wants_updates === true || parsed.wants_updates === 'true';

    if (typeof parsed.wants_updates !== 'boolean') {
      delete parsed.wants_updates;
    }
  }

  return parsed;
} catch (e) {
  console.error('Failed to parse GPT response as JSON:', content);
  throw new Error('Failed to parse GPT response');
}
}