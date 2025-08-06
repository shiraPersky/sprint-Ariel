import { Resend } from 'resend';
import { format } from 'date-fns';
import communityMemberData from '../dataLayer/communityMember.data.js';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateICSContentSimple({ time, description }) {
  const date = new Date(time);

  if (isNaN(date)) {
    throw new Error(`Invalid time provided to generateICSContentSimple: ${time}`);
  }

  const start = format(date, "yyyyMMdd'T'HHmmss'Z'");
  const end = format(new Date(date.getTime() + 60 * 60 * 1000), "yyyyMMdd'T'HHmmss'Z'");

  return `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Community App//EN
BEGIN:VEVENT
UID:event-${start}@community-app.com
DTSTAMP:${start}
DTSTART:${start}
DTEND:${end}
SUMMARY:${description || 'some event'}
DESCRIPTION:
END:VEVENT
END:VCALENDAR
`.trim();
}

export async function sendInviteWithResend(toEmail, event) {
  const icsContent = generateICSContentSimple(event);

  await resend.emails.send({
    from: 'Community Events <onboarding@resend.dev>', 
    to: [toEmail],
    subject: `You're invited: ${event.description}`,
    html: `<p>Hello,<br/>You're invited to: <strong>${event.description}</strong><br/>Time: ${new Date(event.time).toLocaleString()}</p>`,
    attachments: [
      {
        filename: 'invite.ics',
        content: Buffer.from(icsContent).toString('base64'),
        type: 'text/calendar',
      }
    ]
  });
}


export async function getMemberEmailById(id) {
  const result = await communityMemberData.getEmailById(id);
  return result?.email || null;
}