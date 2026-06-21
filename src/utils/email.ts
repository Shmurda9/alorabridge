import nodemailer from "nodemailer";
import { logger } from "./logger";

// 1. Configure the Gmail transporter using environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, // Your Gmail address
    pass: process.env.SMTP_PASS, // Your 16-letter Gmail App Password
  },
});

// Since you are testing, you can change this to false if you want it to go to the real candidate's email
const USE_TEST_RECEIVER = true; 
const TEMPORARY_TEST_RECEIVER = "orchardglenbernie@gmail.com"; 

/**
 * Sends a premium HTML confirmation email when a user applies for a job
 */
export async function sendApplicationConfirmation(email: string, name: string, jobTitle: string) {
  try {
    const targetEmail = USE_TEST_RECEIVER ? TEMPORARY_TEST_RECEIVER : email;

    await transporter.sendMail({
      from: `AloraBridge <${process.env.SMTP_USER}>`, // MUST be your Gmail account
      to: targetEmail,
      subject: `Application Received: ${jobTitle} at AloraBridge`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Application Received</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f3f4f6; margin: 0; padding: 40px 20px;">
            <div style="max-width: 550px; margin: 0 auto; bg-color: #111827; background-color: #111827; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);">
              
              <div style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); padding: 32px 24px; text-align: center;">
                <div style="width: 40px; height: 40px; background-color: rgba(255,255,255,0.1); border-radius: 8px; display: inline-block; line-height: 40px; font-weight: bold; color: #ffffff; margin-bottom: 12px; font-size: 18px;">R</div>
                <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.025em;">AloraBridge Workspace</h1>
              </div>

              <div style="padding: 32px 24px;">
                <p style="font-size: 16px; line-height: 24px; color: #f3f4f6; margin-top: 0;">Hi <strong>${name}</strong>,</p>
                
                <p style="font-size: 15px; line-height: 24px; color: #9ca3af;">
                  Thank you for submitting your application for the position of <span style="color: #3b82f6; font-weight: 600;">${jobTitle}</span>. Our talent acquisition team has successfully received your profile.
                </p>

                <div style="background-color: #1f2937; border: 1px solid #374151; border-radius: 12px; padding: 16px; margin: 24px 0; text-align: center;">
                  <span style="font-size: 13px; color: #9ca3af; display: block; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Application Status</span>
                  <strong style="font-size: 16px; color: #10b981;">Under Review</strong>
                </div>

                <p style="font-size: 15px; line-height: 24px; color: #9ca3af; margin-bottom: 0;">
                  We carefully review every premium candidate against our active structural performance benchmarks. If your background aligns with our engineering ecosystem requirements, an HR panel member will reach out to schedule an interview assessment dashboard route.
                </p>
              </div>

              <div style="padding: 24px; border-top: 1px solid #1f2937; background-color: #0f172a; text-align: center;">
                <p style="font-size: 12px; color: #6b7280; margin: 0;">&copy; 2026 AloraBridge Inc. All tier rights reserved.</p>
                <p style="font-size: 11px; color: #4b5563; margin: 4px 0 0 0;">This is an automated system confirmation alert message.</p>
              </div>

            </div>
          </body>
        </html>
      `,
    });

    logger.info(`Automated confirmation email successfully dispatched to ${targetEmail}`);
  } catch (err) {
    logger.error("Failed executing sendApplicationConfirmation utility:", err);
  }
}

/**
 * Sends a premium interview invite email
 */
export async function sendInterviewInvitation(email: string, name: string, jobTitle: string, date: string) {
  try {
    const targetEmail = USE_TEST_RECEIVER ? TEMPORARY_TEST_RECEIVER : email;

    await transporter.sendMail({
      from: `AloraBridge <${process.env.SMTP_USER}>`,
      to: targetEmail,
      subject: `Interview Invitation: ${jobTitle} at AloraBridge`,
      html: `<p>Hi ${name}, we would love to interview you for the ${jobTitle} role on ${date}.</p>`,
    });
    logger.info(`Interview invite email sent to ${targetEmail}`);
  } catch (err) {
    logger.error("Failed sending interview invite email:", err);
  }
}
