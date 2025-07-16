import { extractTextFromPdfBuffer } from './extractText.js';
import { analyzeCvText } from './analyzeCvWithGPT.js';
import communityMemberData from '../../dataLayer/communityMember.data.js';

export async function createMemberFromCvBuffer(buffer) {
  //  Extract raw text from PDF
  const text = await extractTextFromPdfBuffer(buffer);

  // Send text to ChatGPT for analysis
  const analyzedData = await analyzeCvText(text);

  // Create a new CommunityMember in the database
  const createdMember = await communityMemberData.create(analyzedData);

  return {
    extractedText: text,
    analyzedData,
    createdMember,
  };
}
