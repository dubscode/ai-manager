import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendManagerEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  try {
    const data = await resend.emails.send({
      from: 'AI Manager <notifications@aimgr.dev>',
      to,
      subject,
      text,
      html: html || text,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
