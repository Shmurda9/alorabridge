import { Resend } from "resend";
import { logger } from "./logger";

const resend = new Resend(process.env.RESEND_API_KEY);

// Updated display name to "AloraBridge"
const FROM_EMAIL = "AloraBridge <no-reply@alorabridge.com>";

// Define your logo URL here (update if hosted elsewhere)
const LOGO_URL = "https://alorabridge.com/logo.png";

/**
 * Universal SaaS Email Template Builder
 * This ensures all emails share the same premium layout, spacing, and visual identity.
 */
interface EmailTemplateOptions {
  title: string;
  candidateName: string;
  bodyHtml: string;
  infoCardHtml: string;
  timelineHtml?: string;
  ctaText?: string;
  ctaUrl?: string;
}

function generateEmailTemplate(options: EmailTemplateOptions): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${options.title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; padding: 40px 0;">
        <tr>
          <td align="center">
            <!-- Main Container Card -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03), 0 1px 3px rgba(15, 23, 42, 0.02); border: 1px solid #E5E7EB;">
              
              <!-- Premium Hero Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 48px 32px; text-align: center;">
                  <img src="${LOGO_URL}" alt="AloraBridge Logo" style="height: 40px; width: auto; display: block; margin: 0 auto 24px auto; max-width: 100%; border: 0; outline: none; text-decoration: none;" />
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.2;">${options.title}</h1>
                </td>
              </tr>

              <!-- Body Content -->
              <tr>
                <td style="padding: 40px 32px;">
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #111827; font-weight: 500;">Hi <span style="text-transform: capitalize;">${options.candidateName}</span>,</p>
                  
                  ${options.bodyHtml}
                  
                  <!-- Dynamic Info Card -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border-radius: 12px; border: 1px solid #E5E7EB; margin-bottom: 32px;">
                    <tr>
                      <td style="padding: 24px;">
                        ${options.infoCardHtml}
                      </td>
                    </tr>
                  </table>

                  <!-- Optional Timeline -->
                  ${options.timelineHtml ? options.timelineHtml : ""}

                  <!-- Optional Call To Action -->
                  ${options.ctaText && options.ctaUrl ? `
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="padding-top: 8px;">
                        <a href="${options.ctaUrl}" target="_blank" style="display: inline-block; background-color: #2563EB; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">${options.ctaText}</a>
                      </td>
                    </tr>
                  </table>
                  ` : ""}

                  <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 40px 0 24px 0;" />
                  <p style="margin: 0 0 4px 0; font-size: 14px; color: #6B7280;">Best regards,</p>
                  <p style="margin: 0; font-size: 15px; font-weight: 600; color: #0F172A;">The AloraBridge Team</p>
                </td>
              </tr>

              <!-- Premium Footer -->
              <tr>
                <td style="background-color: #F8FAFC; padding: 24px 32px; border-top: 1px solid #E5E7EB; text-align: center;">
                  <p style="margin: 0 0 8px 0; font-size: 13px; color: #6B7280; line-height: 1.5;">This is an automated notification from AloraBridge.</p>
                  <p style="margin: 0; font-size: 13px; color: #6B7280;">Questions or concerns? Contact <a href="mailto:support@alorabridge.com" style="color: #2563EB; text-decoration: none; font-weight: 500;">support@alorabridge.com</a></p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export async function sendApplicationConfirmation(to: string, candidateName: string, jobTitle: string) {
  try {
    const htmlContent = generateEmailTemplate({
      title: "Application Received",
      candidateName: candidateName,
      bodyHtml: `
        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4B5563;">Thank you for your interest in joining AloraBridge. We’ve successfully received your application for the position below and our recruitment team will begin reviewing your profile shortly.</p>
        <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #4B5563;">Your application has been securely submitted and is now under review.</p>
      `,
      infoCardHtml: `
        <div style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Role Applied For</div>
        <div style="font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 16px;">${jobTitle}</div>
        
        <div style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Status</div>
        <div style="display: inline-block; font-size: 13px; font-weight: 600; color: #1D4ED8; background-color: #DBEAFE; padding: 4px 12px; border-radius: 9999px;">Review in Progress</div>
      `,
      timelineHtml: `
        <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 700; color: #0F172A; text-transform: uppercase; letter-spacing: 0.05em;">What happens next?</h3>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px;">
          <tr>
            <td style="padding-bottom: 16px; vertical-align: top;">
              <div style="font-size: 15px; color: #111827; line-height: 1.5;"><strong style="color: #2563EB;">1. Application Review:</strong> Your qualifications and experience will be reviewed against the requirements for this opportunity.</div>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 16px; vertical-align: top;">
              <div style="font-size: 15px; color: #111827; line-height: 1.5;"><strong style="color: #2563EB;">2. Initial Evaluation:</strong> If your profile matches our current hiring needs, you’ll be invited to the next stage of the recruitment process.</div>
            </td>
          </tr>
          <tr>
            <td style="vertical-align: top;">
              <div style="font-size: 15px; color: #111827; line-height: 1.5;"><strong style="color: #2563EB;">3. Next Steps:</strong> If selected, you’ll receive an email with interview details and further instructions.</div>
            </td>
          </tr>
        </table>
      `,
      ctaText: "Visit Careers",
      ctaUrl: "https://alorabridge.com"
    });

    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Application Received: ${jobTitle}`,
      html: htmlContent,
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
    const htmlContent = generateEmailTemplate({
      title: "Interview Invitation",
      candidateName: candidateName,
      bodyHtml: `
        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4B5563;">After carefully reviewing your application, we’d like to invite you to the next stage of our recruitment process.</p>
        <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #4B5563;">We were impressed by your qualifications and believe your experience aligns well with the requirements of this opportunity.</p>
      `,
      infoCardHtml: `
        <div style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Role</div>
        <div style="font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 16px;">${jobTitle}</div>
        
        <div style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Proposed Schedule</div>
        <div style="font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 16px;">${date}</div>

        <div style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Meeting Platform</div>
        <div style="font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 16px;">Google Meet / Remote Video Conference</div>

        <div style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Duration</div>
        <div style="font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 16px;">45 Minutes</div>

        <div style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Recruiter</div>
        <div style="font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 16px;">AloraBridge Recruitment Team</div>

        <div style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Status</div>
        <div style="display: inline-block; font-size: 13px; font-weight: 600; color: #6B21A8; background-color: #F3E8FF; padding: 4px 12px; border-radius: 9999px;">Interview Scheduled</div>
      `,
      ctaText: "Confirm Interview",
      ctaUrl: "https://alorabridge.com"
    });

    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Interview Invitation: ${jobTitle}`,
      html: htmlContent,
    });

    logger.info(`Interview invite sent via Resend to ${to}`);
    return data;
  } catch (error) {
    logger.error("Failed to send interview email via Resend:", error);
    throw error;
  }
}
