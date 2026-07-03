import { Resend } from "resend";
import { logger } from "./logger";

// Initialize Resend with your API key from Render environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Your brand new professional email address!
const FROM_EMAIL = "AloraBridge.com <no-reply@alorabridge.com>";

export async function sendApplicationConfirmation(to: string, candidateName: string, jobTitle: string) {
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Application Received: ${jobTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Application Received</title>
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
                      <div style="font-size: 14px; font-weight: 700; color: #2563EB; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px;">Alora Bridge</div>
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.2;">Application Received</h1>
                    </td>
                  </tr>

                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 40px 32px;">
                      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #111827; font-weight: 500;">Hi <span style="text-transform: capitalize;">${candidateName}</span>,</p>
                      <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #6B7280;">Thank you for applying to join our team. We have safely received your profile and application data.</p>
                      
                      <!-- Job Details Info Card -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border-radius: 12px; border: 1px solid #E5E7EB; margin-bottom: 32px;">
                        <tr>
                          <td style="padding: 20px 24px;">
                            <div style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Role Applied For</div>
                            <div style="font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 16px;">${jobTitle}</div>
                            
                            <div style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Application Status</div>
                            <div style="display: inline-block; font-size: 13px; font-weight: 600; color: #22C55E; background-color: #DCFCE7; padding: 4px 12px; border-radius: 9999px;">Under Review</div>
                          </td>
                        </tr>
                      </table>

                      <!-- Timeline Section -->
                      <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 700; color: #0F172A; text-transform: uppercase; letter-spacing: 0.05em;">What happens next?</h3>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px;">
                        <tr>
                          <td style="padding-bottom: 16px;">
                            <div style="font-size: 15px; color: #111827; line-height: 1.5;"><strong style="color: #2563EB;">1. Profile Review:</strong> Our recruiting team checks your background against the core role criteria.</div>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-bottom: 16px;">
                            <div style="font-size: 15px; color: #111827; line-height: 1.5;"><strong style="color: #2563EB;">2. Team Alignment:</strong> We coordinate with the hiring managers to evaluate project alignment.</div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div style="font-size: 15px; color: #111827; line-height: 1.5;"><strong style="color: #2563EB;">3. Outreach:</strong> We will reach out via email within a few business days regarding next steps.</div>
                          </td>
                        </tr>
                      </table>

                      <!-- Call To Action Button -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center" style="padding-top: 8px;">
                            <a href="https://alorabridge.com" target="_blank" style="display: inline-block; background-color: #2563EB; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">Visit Careers</a>
                          </td>
                        </tr>
                      </table>

                      <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 40px 0 24px 0;" />
                      <p style="margin: 0 0 4px 0; font-size: 14px; color: #6B7280;">Best regards,</p>
                      <p style="margin: 0; font-size: 15px; font-weight: 600; color: #0F172A;">The AloraBridge Team</p>
                    </td>
                  </tr>

                  <!-- Premium Footer Footer -->
                  <tr>
                    <td style="background-color: #F8FAFC; padding: 24px 32px; border-top: 1px solid #E5E7EB; text-align: center;">
                      <p style="margin: 0 0 8px 0; font-size: 13px; color: #6B7280; line-height: 1.5;">This is an automated notification tracking your application status.</p>
                      <p style="margin: 0; font-size: 13px; color: #6B7280;">Questions or concerns? Contact <a href="mailto:support@alorabridge.com" style="color: #2563EB; text-decoration: none; font-weight: 500;">support@alorabridge.com</a></p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
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
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Interview Invitation</title>
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
                      <div style="font-size: 14px; font-weight: 700; color: #2563EB; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px;">Alora Bridge</div>
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.2;">Interview Invitation</h1>
                    </td>
                  </tr>

                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 40px 32px;">
                      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #111827; font-weight: 500;">Hi <span style="text-transform: capitalize;">${candidateName}</span>,</p>
                      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #111827; font-weight: 600;">Congratulations!</p>
                      <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #6B7280;">Our team was incredibly impressed by your background and experience. We would love to move your application forward and invite you to a formal interview session.</p>
                      
                      <!-- Interview Details Info Card -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #EFF6FF; border-radius: 12px; border: 1px solid #DBEAFE; margin-bottom: 32px;">
                        <tr>
                          <td style="padding: 24px; border-left: 4px solid #2563EB;">
                            <div style="font-size: 12px; font-weight: 600; color: #1D4ED8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Role Profile</div>
                            <div style="font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 16px;">${jobTitle}</div>
                            
                            <div style="font-size: 12px; font-weight: 600; color: #1D4ED8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Proposed Schedule</div>
                            <div style="font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 16px;">${date}</div>

                            <div style="font-size: 12px; font-weight: 600; color: #1D4ED8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Meeting Platform</div>
                            <div style="font-size: 15px; font-weight: 600; color: #111827;">Google Meet / Remote Video Conference</div>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 0 0 32px 0; font-size: 15px; line-height: 1.6; color: #6B7280;">Please confirm your availability by selecting the action button below. Our coordination team will finalize calendar events right after tracking your reply.</p>

                      <!-- Call To Action Button -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center" style="padding-top: 8px;">
                            <a href="https://alorabridge.com" target="_blank" style="display: inline-block; background-color: #2563EB; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">Confirm Attendance</a>
                          </td>
                        </tr>
                      </table>

                      <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 40px 0 24px 0;" />
                      <p style="margin: 0 0 4px 0; font-size: 14px; color: #6B7280;">Best regards,</p>
                      <p style="margin: 0; font-size: 15px; font-weight: 600; color: #0F172A;">The AloraBridge Team</p>
                    </td>
                  </tr>

                  <!-- Premium Footer Footer -->
                  <tr>
                    <td style="background-color: #F8FAFC; padding: 24px 32px; border-top: 1px solid #E5E7EB; text-align: center;">
                      <p style="margin: 0 0 8px 0; font-size: 13px; color: #6B7280; line-height: 1.5;">This scheduling notification is powered by AloraBridge.com.</p>
                      <p style="margin: 0; font-size: 13px; color: #6B7280;">Need to reschedule? Reply or ping <a href="mailto:support@alorabridge.com" style="color: #2563EB; text-decoration: none; font-weight: 500;">support@alorabridge.com</a></p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    logger.info(`Interview invite sent via Resend to ${to}`);
    return data;
  } catch (error) {
    logger.error("Failed to send interview email via Resend:", error);
    throw error;
  }
}
