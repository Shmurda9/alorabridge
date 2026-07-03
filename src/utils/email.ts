import { Resend } from "resend";
import { logger } from "./logger";

const resend = new Resend(process.env.RESEND_API_KEY);

// Updated display name to "AloraBridge" (no space, no .com)
const FROM_EMAIL = "AloraBridge <no-reply@alorabridge.com>";

// Standardized Premium SaaS HTML Header & Wrapper with an explicit white header heading and custom 3-color gradient divider
const emailHeader = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 10px; margin: 0; width: 100%;">
    <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e2e8f0;">
      <div style="background-color: #1e293b; padding: 32px 32px 28px 32px; text-align: center;">
        <img src="https://alorabridge.com/logo.png" alt="AloraBridge Logo" style="height: 40px; width: auto; display: block; margin: 0 auto 16px auto; max-width: 100%; border: 0; outline: none; text-decoration: none;" />
        <div style="height: 4px; background: linear-gradient(90deg, #00D4FF 0%, #7B61FF 50%, #FF6B9D 100%); width: 100%; border-radius: 2px;"></div>
      </div>
      <div style="padding: 40px 32px; color: #334155; line-height: 1.6; font-size: 16px;">
`;

// Standardized HTML Footer with support link
const emailFooter = `
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
        <p style="font-size: 14px; color: #64748b; margin: 0 0 8px 0;">Best regards,</p>
        <p style="font-size: 16px; font-weight: 600; color: #1e293b; margin: 0 0 24px 0;">The AloraBridge Team</p>
        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px; text-align: center; font-size: 13px; color: #64748b;">
          This is an automated message. Need help? Contact <a href="mailto:support@alorabridge.com" style="color: #2563eb; text-decoration: none; font-weight: 500;">support@alorabridge.com</a>
        </div>
      </div>
    </div>
  </div>
`;

export async function sendApplicationConfirmation(to: string, candidateName: string, jobTitle: string) {
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Application Received: ${jobTitle}`,
      html: `
        ${emailHeader}
        <h2 style="color: #ffffff !important; background-color: #1e293b; font-size: 24px; font-weight: 700; text-align: center; margin-top: -40px; margin-left: -32px; margin-right: -32px; margin-bottom: 32px; padding: 20px 32px; border-bottom: 1px solid #e2e8f0;">Application Received</h2>
        <p style="margin-bottom: 16px;">Hi <span style="text-transform: capitalize; font-weight: 500;">${candidateName}</span>,</p>
        <p style="margin-bottom: 16px;">Thank you for applying for the <strong style="color: #1e293b;">${jobTitle}</strong> position at AloraBridge. We have successfully received your application data.</p>
        <p style="margin-bottom: 0;">Our hiring team will carefully review your profile, and we will be in touch soon regarding the next steps in our process.</p>
        ${emailFooter}
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
        ${emailHeader}
        <h2 style="color: #ffffff !important; background-color: #1e293b; font-size: 24px; font-weight: 700; text-align: center; margin-top: -40px; margin-left: -32px; margin-right: -32px; margin-bottom: 32px; padding: 20px 32px; border-bottom: 1px solid #e2e8f0;">Interview Invitation</h2>
        <p style="margin-bottom: 16px;">Hi <span style="text-transform: capitalize; font-weight: 500;">${candidateName}</span>,</p>
        <p style="margin-bottom: 16px;">We were very impressed with your background and application for the <strong style="color: #1e293b;">${jobTitle}</strong> role.</p>
        <p style="margin-bottom: 24px;">We would love to invite you to an interview to discuss your experience further and explore how you fit into the team.</p>
        
        <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 16px; margin-bottom: 24px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-size: 14px; color: #1e3a8a; font-weight: 600;">Proposed Date & Time:</p>
          <p style="margin: 4px 0 0 0; font-size: 16px; color: #1d4ed8; font-weight: 500;">${date}</p>
        </div>

        <p style="margin-bottom: 0;">A member of our team will be reaching out shortly with calendar links and scheduling instructions.</p>
        ${emailFooter}
      `,
    });

    logger.info(`Interview invite sent via Resend to ${to}`);
    return data;
  } catch (error) {
    logger.error("Failed to send interview email via Resend:", error);
    throw error;
  }
}
