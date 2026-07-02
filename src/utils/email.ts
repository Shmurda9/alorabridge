import { Resend } from "resend";
import { logger } from "./logger";

// Initialize Resend with your API key from Render environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Your brand new professional email address!
const FROM_EMAIL = "Alora Bridge <no-reply@alorabridge.com>";

export async function sendApplicationConfirmation(to: string, candidateName: string, jobTitle: string) {
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Application Received: ${jobTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h2>Application Received</h2>
          <p>Hi ${candidateName},</p>
          <p>Thank you for applying for the <strong>${jobTitle}</strong> position at Alora Bridge. We have successfully received your application.</p>
          <p>Our hiring team will review your profile, and we will be in touch soon with the next steps.</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>The Alora Bridge Team</strong></p>
        </div>
      `,
    });
    
    logger.info(`Confirmation email sent via Resend to ${to}`);
    return data;
  } catch (error) {
    logger.error("Failed to send confirmation email via Resend:", error);
    throw error;
  }
}

export async function sendInterviewInvitation(to: string, candidateName: string, jobTitle: string, date: string) {
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Interview Invitation: ${jobTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h2>Interview Invitation</h2>
          <p>Hi ${candidateName},</p>
          <p>We were very impressed with your application for the <strong>${jobTitle}</strong> position.</p>
          <p>We would love to invite you to an interview to discuss your background and how you might fit into the team at Alora Bridge.</p>
          <p>We will be reaching out shortly with scheduling details.</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>The Alora Bridge Team</strong></p>
        </div>
      `,
    });

    logger.info(`Interview invite sent via Resend to ${to}`);
    return data;
  } catch (error) {
    logger.error("Failed to send interview email via Resend:", error);
    throw error;
  }
}
