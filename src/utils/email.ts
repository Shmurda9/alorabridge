import { Resend } from "resend";
import { logger } from "./logger";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "AloraBridge <no-reply@alorabridge.com>";
const SUPPORT_EMAIL = "support@alorabridge.com";

/**
 * AloraBridge Premium Brand Colors
 */
const COLORS = {
  bg: "#FAFAFA",
  card: "#FFFFFF",
  textMain: "#111827",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  accent: "#2563EB",
};

/**
 * REUSABLE EMAIL COMPONENTS
 */

function createHeader(title: string): string {
  return `
    <div style="padding: 32px 32px 24px 32px; border-bottom: 1px solid ${COLORS.border};">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="left" valign="middle" width="32">
            <img src="https://i.postimg.cc/HLSPWLQq/IMG-2510.png" alt="AloraBridge" width="24" height="24" style="display: block; margin-right: 12px;" />
          </td>
          <td align="left" valign="middle">
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; color: ${COLORS.textMain}; letter-spacing: -0.02em; line-height: 1;">AloraBridge</div>
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 9px; font-weight: 600; color: ${COLORS.textMuted}; letter-spacing: 0.1em; margin-top: 4px;">CONNECTING WORLDS</div>
          </td>
        </tr>
      </table>
      <h1 style="margin: 24px 0 0 0; font-size: 20px; font-weight: 600; color: ${COLORS.textMain}; letter-spacing: -0.02em;">${title}</h1>
    </div>
  `;
}

interface InfoItem { label: string; value: string; }

function createInfoCard(items: InfoItem[]): string {
  const rows = items.map((item, index) => {
    const margin = index === items.length - 1 ? "0" : "12px";
    return `
      <div style="margin-bottom: ${margin};">
        <div style="font-size: 12px; font-weight: 500; color: ${COLORS.textMuted}; margin-bottom: 4px;">${item.label}</div>
        <div style="font-size: 14px; font-weight: 500; color: ${COLORS.textMain};">${item.value}</div>
      </div>
    `;
  }).join("");

  return `
    <div style="background-color: #F9FAFB; border: 1px solid ${COLORS.border}; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      ${rows}
    </div>
  `;
}

// FIX: Added "standard" to the allowed types to stop the TypeScript error
type FooterType = "none" | "standard" | "careers" | "hr" | "operations" | "internal";

function createFooter(type: FooterType): string {
  let contactText = "";

  switch (type) {
    case "careers":
      contactText = `
        <div style="margin-bottom: 12px;">Questions regarding your recruitment process?<br>Simply reply to this email or contact <a href="mailto:careers@alorabridge.com" style="color: ${COLORS.textMuted};">careers@alorabridge.com</a>.</div>
        <div>For technical issues with the application platform, contact <a href="mailto:${SUPPORT_EMAIL}" style="color: ${COLORS.textMuted};">${SUPPORT_EMAIL}</a>.</div>
      `;
      break;
    case "hr":
      contactText = `
        <div style="margin-bottom: 12px;">Questions regarding onboarding or employment documentation?<br>Simply reply to this email or contact <a href="mailto:hr@alorabridge.com" style="color: ${COLORS.textMuted};">hr@alorabridge.com</a>.</div>
        <div>For technical issues with the application platform, contact <a href="mailto:${SUPPORT_EMAIL}" style="color: ${COLORS.textMuted};">${SUPPORT_EMAIL}</a>.</div>
      `;
      break;
    case "operations":
      contactText = `
        <div style="margin-bottom: 12px;">Questions regarding equipment, company accounts or your first day?<br>Reply directly to this email or contact <a href="mailto:operations@alorabridge.com" style="color: ${COLORS.textMuted};">operations@alorabridge.com</a>.</div>
        <div>For technical platform issues, contact <a href="mailto:${SUPPORT_EMAIL}" style="color: ${COLORS.textMuted};">${SUPPORT_EMAIL}</a>.</div>
      `;
      break;
    case "internal":
      contactText = `<div>This is an internal automated alert from the AloraBridge ATS.</div>`;
      break;
    case "none":
      // FIX: When set to "none", no contact block is added
      contactText = "";
      break;
    case "standard":
    default:
      // FIX: When set to "standard", it renders the default automated text + support email
      contactText = `
        <div style="margin-bottom: 12px;">This is an automated notification from AloraBridge.</div>
        <div>For technical assistance regarding your application, please contact <a href="mailto:${SUPPORT_EMAIL}" style="color: ${COLORS.textMuted};">${SUPPORT_EMAIL}</a>.</div>
      `;
      break;
  }

  const year = new Date().getFullYear();
  return `
    <div style="padding: 24px 32px; background-color: ${COLORS.bg}; border-top: 1px solid ${COLORS.border}; font-size: 12px; color: ${COLORS.textMuted}; line-height: 1.6;">
      ${contactText}
      <div style="margin-top: ${contactText ? '24px' : '0'};">&copy; ${year} AloraBridge LLC. All rights reserved.</div>
    </div>
  `;
}

interface EmailOptions { 
  title: string; 
  candidateName: string; 
  bodyHtml: string; 
  infoCardHtml?: string; 
  hideGreeting?: boolean; 
  footerType: FooterType; 
}

function generateEmailTemplate(options: EmailOptions): string {
  const greeting = options.hideGreeting ? "" : `<p style="margin: 0 0 24px 0; font-size: 15px; color: ${COLORS.textMain};">Hi <span style="text-transform: capitalize;">${options.candidateName}</span>,</p>`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${options.title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: ${COLORS.bg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${COLORS.bg}; padding: 40px 0;">
        <tr>
          <td align="center">
            <div style="max-width: 560px; width: 100%; background-color: ${COLORS.card}; border: 1px solid ${COLORS.border}; border-radius: 12px; overflow: hidden; text-align: left;">
              ${createHeader(options.title)}
              <div style="padding: 32px;">
                ${greeting}
                ${options.bodyHtml}
                ${options.infoCardHtml || ""}
                <p style="margin: 32px 0 0 0; font-size: 14px; color: ${COLORS.textMuted};">Best regards,<br><span style="color: ${COLORS.textMain}; font-weight: 500;">The AloraBridge Team</span></p>
              </div>
              ${createFooter(options.footerType)}
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

const pStyle = `style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: ${COLORS.textMain};"`;

/**
 * EXPORTED EMAIL FUNCTIONS (9 Pipeline Statuses)
 */

// 1. New Applicant
export async function sendApplicationConfirmation(to: string, candidateName: string, jobTitle: string) {
  const htmlContent = generateEmailTemplate({
    title: "Application Received",
    candidateName,
    bodyHtml: `
      <p ${pStyle}>Thank you for applying to AloraBridge.</p>
      <p ${pStyle}>We have successfully received your application. Our recruitment team will review your qualifications and reach out if your background is a match for our current needs.</p>
    `,
    infoCardHtml: createInfoCard([
      { label: "Role Applied For", value: jobTitle },
      { label: "Current Status", value: "Application Received" }
    ]),
    footerType: "standard" // FIX: Automatically uses standard support footer
  });
  return await resend.emails.send({ from: FROM_EMAIL, to: [to], subject: `Application Received: ${jobTitle}`, html: htmlContent });
}

// 2. Under Review
export async function sendUnderReviewEmail(to: string, candidateName: string, jobTitle: string) {
  const htmlContent = generateEmailTemplate({
    title: "Application Under Review",
    candidateName,
    bodyHtml: `
      <p ${pStyle}>Your application is currently being reviewed by our team.</p>
      <p ${pStyle}>We are evaluating your qualifications for the position and will notify you as soon as the review process is complete.</p>
    `,
    infoCardHtml: createInfoCard([
      { label: "Role Applied For", value: jobTitle },
      { label: "Current Status", value: "Under Review" }
    ]),
    footerType: "standard" // FIX: Automatically uses standard support footer
  });
  return await resend.emails.send({ from: FROM_EMAIL, to: [to], subject: `Update: Application Under Review`, html: htmlContent });
}

// 3. Interview Scheduled
export async function sendInterviewInvitation(to: string, candidateName: string, jobTitle: string) {
  const htmlContent = generateEmailTemplate({
    title: "Interview Invitation",
    candidateName,
    bodyHtml: `
      <p ${pStyle}>We would like to invite you to the next stage of the recruitment process.</p>
      <p ${pStyle}>Please review the provided interview details. If you have any questions or need to request a different time, simply reply to this email.</p>
    `,
    infoCardHtml: createInfoCard([
      { label: "Role Applied For", value: jobTitle },
      { label: "Current Status", value: "Interview Scheduled" }
    ]),
    footerType: "careers"
  });
  return await resend.emails.send({ from: FROM_EMAIL, to: [to], replyTo: "careers@alorabridge.com", subject: `Interview Invitation: ${jobTitle}`, html: htmlContent });
}

// 4. Interview Completed
export async function sendInterviewCompletedEmail(to: string, candidateName: string, jobTitle: string) {
  const htmlContent = generateEmailTemplate({
    title: "Interview Completed",
    candidateName,
    bodyHtml: `
      <p ${pStyle}>Thank you for taking the time to speak with our team.</p>
      <p ${pStyle}>We appreciate the opportunity to learn more about your background. Our recruitment team is finalizing their evaluation and will contact you shortly with an update.</p>
    `,
    infoCardHtml: createInfoCard([
      { label: "Role Applied For", value: jobTitle },
      { label: "Current Status", value: "Pending Final Decision" }
    ]),
    footerType: "careers"
  });
  return await resend.emails.send({ from: FROM_EMAIL, to: [to], replyTo: "careers@alorabridge.com", subject: `Interview Completed: ${jobTitle}`, html: htmlContent });
}

// 5. Approved
export async function sendApprovedEmail(to: string, candidateName: string, jobTitle: string) {
  const htmlContent = generateEmailTemplate({
    title: "Conditional Employment Approval",
    candidateName,
    bodyHtml: `
      <p ${pStyle}>We are pleased to inform you that your application has been approved.</p>
      <p ${pStyle}>You have successfully completed the recruitment process. Our Human Resources department will follow up with you directly regarding the required employment documentation and next steps.</p>
    `,
    infoCardHtml: createInfoCard([
      { label: "Role Applied For", value: jobTitle },
      { label: "Current Status", value: "Approved - Pending Documentation" }
    ]),
    footerType: "hr"
  });
  return await resend.emails.send({ from: FROM_EMAIL, to: [to], replyTo: "hr@alorabridge.com", subject: `Application Approved: ${jobTitle}`, html: htmlContent });
}

// 6. HR Onboard
export async function sendHROnboarding(to: string, candidateName: string, jobTitle: string) {
  const htmlContent = generateEmailTemplate({
    title: "Onboarding Documentation",
    candidateName,
    bodyHtml: `
      <p ${pStyle}>Your formal onboarding process has begun.</p>
      <p ${pStyle}>Please complete the necessary employment documentation provided by our HR team. Once verified, we will proceed with preparing your operational setup.</p>
    `,
    infoCardHtml: createInfoCard([
      { label: "Role", value: jobTitle },
      { label: "Current Status", value: "HR Onboarding Active" }
    ]),
    footerType: "hr"
  });
  return await resend.emails.send({ from: FROM_EMAIL, to: [to], replyTo: "hr@alorabridge.com", subject: `Onboarding Steps: ${jobTitle}`, html: htmlContent });
}

// 7a. Ops Onboarding (Candidate Email)
export async function sendOpsOnboardingCandidateEmail(to: string, candidateName: string, jobTitle: string) {
  const htmlContent = generateEmailTemplate({
    title: "Preparing Your Setup",
    candidateName,
    bodyHtml: `
      <p ${pStyle}>Your HR documentation has been verified.</p>
      <p ${pStyle}>Our Operations team is now preparing your accounts, systems access, and schedule. You will receive further instructions prior to your official start date.</p>
    `,
    infoCardHtml: createInfoCard([
      { label: "Role", value: jobTitle },
      { label: "Current Status", value: "Operations Provisioning" }
    ]),
    footerType: "operations"
  });
  return await resend.emails.send({ from: FROM_EMAIL, to: [to], replyTo: "operations@alorabridge.com", subject: `Preparing Your First Day: ${jobTitle}`, html: htmlContent });
}

// 7b. Ops Onboarding (Internal Checklist Alert)
export async function sendOperationsInternalAlert(candidateName: string, jobTitle: string) {
  const htmlContent = generateEmailTemplate({
    title: "Provisioning Required",
    candidateName: "Operations Team",
    hideGreeting: true,
    bodyHtml: `
      <p ${pStyle}>A new employee has completed HR verification and requires standard provisioning.</p>
    `,
    infoCardHtml: createInfoCard([
      { label: "Candidate Name", value: candidateName },
      { label: "Role", value: jobTitle },
      { label: "Status", value: "Ready for Setup" }
    ]),
    footerType: "internal"
  });
  return await resend.emails.send({ from: FROM_EMAIL, to: ["operations@alorabridge.com"], subject: `Provisioning Required: ${candidateName}`, html: htmlContent });
}

// 8. Employee Active
export async function sendEmployeeActiveEmail(to: string, candidateName: string, jobTitle: string) {
  const htmlContent = generateEmailTemplate({
    title: "Welcome to AloraBridge",
    candidateName,
    bodyHtml: `
      <p ${pStyle}>Your onboarding process is complete and your status is now active.</p>
      <p ${pStyle}>We are excited to have you on board. Please refer to your final schedule and reach out to your team lead for your first set of tasks.</p>
    `,
    infoCardHtml: createInfoCard([
      { label: "Role", value: jobTitle },
      { label: "Current Status", value: "Active Employee" }
    ]),
    footerType: "hr"
  });
  return await resend.emails.send({ from: FROM_EMAIL, to: [to], replyTo: "hr@alorabridge.com", subject: `Welcome to the Team!`, html: htmlContent });
}

// 9. Declined
export async function sendRejectionEmail(to: string, candidateName: string, jobTitle: string) {
  const htmlContent = generateEmailTemplate({
    title: "Application Update",
    candidateName,
    bodyHtml: `
      <p ${pStyle}>Thank you for applying to AloraBridge.</p>
      <p ${pStyle}>After careful consideration, we have decided to proceed with other candidates whose profiles align more closely with our current requirements for this role.</p>
      <p ${pStyle}>We appreciate your interest in our company and wish you the best in your professional endeavors.</p>
    `,
    infoCardHtml: createInfoCard([
      { label: "Role Applied For", value: jobTitle },
      { label: "Current Status", value: "Declined" }
    ]),
    footerType: "standard" // FIX: Automatically uses standard support footer
  });
  return await resend.emails.send({ from: FROM_EMAIL, to: [to], subject: `Application Update: ${jobTitle}`, html: htmlContent });
}
