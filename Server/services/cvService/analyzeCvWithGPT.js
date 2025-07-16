// services/analyzeCvWithGPT.js
import { config } from 'dotenv';
import { OpenAI } from 'openai';

config(); 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeCvText(cvText) {
  const prompt = `
You will be given a raw text of a CV. Please extract the relevant fields for the following Prisma model:

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

Please return the result as JSON ready to be inserted into the database.

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
    return JSON.parse(content); 
  } catch (e) {
    console.error('Failed to parse GPT response as JSON:', content);
    throw new Error('Failed to parse GPT response');
  }
}
