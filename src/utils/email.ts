import { Resend } from "resend";
import { logger } from "./logger";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "AloraBridge <no-reply@alorabridge.com>";
const LOGO_URL = "https://alorabridge.com/my-logo/alorabridge-logo.jpg";
/**
 * AloraBridge Brand Colors
 * Strictly enforced palette for all email templates.
 */
const COLORS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  primary: "#0F172A",
  secondary: "#1E293B",
  accent: "#2563EB",
  border: "#E5E7EB",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
};

/**
 * EMAIL COMPONENT BUILDERS
 * Reusable HTML generators to ensure strict visual consistency across all communications.
 */

function createHero(title: string): string {
  return `
    <tr>
      <td style="background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%); background-color: ${COLORS.primary}; padding: 48px 32px; text-align: center;">
        <img src="${LOGO_URL}" alt="AloraBridge" style="color: ${COLORS.card}; font-size: 24px; font-weight: bold; font-family: sans-serif; height: 36px; width: auto; display: block; margin: 0 auto 24px auto; max-width: 100%; border: 0; outline: none; text-decoration: none;" />
        <h1 style="color: ${COLORS.card}; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.2;">${title}</h1>
      </td>
    </tr>
  `;
}

interface InfoItem {
  label: string;
  value: string;
  statusColor?: string;
}

function createInfoCard(items: InfoItem[]): string {
  const rows = items.map((item, index) => {
    const isLast = index === items.length - 1;
    const margin = isLast ? "0" : "16px";
    
    const valueHtml = item.statusColor
      ? `<div style="display: inline-block; font-size: 13px; font-weight: 600; color: ${item.statusColor}; border: 1px solid ${item.statusColor}; padding: 4px 12px; border-radius: 9999px; margin-bottom: ${margin};">${item.value}</div>`
      : `<div style="font-size: 15px; font-weight: 600; color: ${COLORS.primary}; margin-bottom: ${margin};">${item.value}</div>`;

    return `
      <div style="font-size: 12px; font-weight: 600; color: ${COLORS.secondary}; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">${item.label}</div>
      ${valueHtml}
    `;
  }).join("");

  return `
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${COLORS.bg}; border-radius: 12px; border: 1px solid ${COLORS.border}; margin-bottom: 32px;">
      <tr>
        <td style="padding: 24px;">
          ${rows}
        </td>
      </tr>
    </table>
  `;
}

interface TimelineStep {
  number: number;
  title: string;
  description: string;
}

function createTimeline(steps: TimelineStep[]): string {
  const stepRows = steps.map(step => `
    <tr>
      <td style="padding-bottom: 16px; vertical-align: top;">
        <div style="font-size: 15px; color: ${COLORS.secondary}; line-height: 1.5;">
          <strong style="color: ${COLORS.primary};">${step.number}. ${step.title}:</strong> ${step.description}
        </div>
      </td>
    </tr>
  `).join("");

  return `
    <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 700; color: ${COLORS.primary}; text-transform: uppercase; letter-spacing: 0.05em;">Next Steps</h3>
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px;">
      ${stepRows}
    </table>
  `;
}

function createButton(text: string, url: string): string {
  return `
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px;">
      <tr>
        <td align="left">
          <a href="${url}" target="_blank" style="display: inline-block; background-color: ${COLORS.accent}; color: ${COLORS.card}; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; border: 1px solid ${COLORS.accent};">${text}</a>
        </td>
      </tr>
    </table>
  `;
}

function createDivider(): string {
  return `<hr style="border: 0; border-top: 1px solid ${COLORS.border}; margin: 0 0 24px 0;" />`;
}

function createFooter(): string {
  return `
    <tr>
      <td style="background-color: ${COLORS.bg}; padding: 24px 32px; border-top: 1px solid ${COLORS.border}; text-align: center;">
        <p style="margin: 0 0 8px 0; font-size: 13px; color: ${COLORS.secondary}; line-height: 1.5;">This is an automated notification from AloraBridge.</p>
        <p style="margin: 0; font-size: 13px; color: ${COLORS.secondary};">Replies to this address are not monitored. For assistance, contact <a href="mailto:support@alorabridge.com" style="color: ${COLORS.accent}; text-decoration: none; font-weight: 500;">support@alorabridge.com</a></p>
      </td>
    </tr>
  `;
}

/**
 * MASTER TEMPLATE GENERATOR
 * Wraps all components into a compliant, responsive email-safe structure.
 */
interface EmailOptions {
  title: string;
  candidateName: string;
  bodyHtml: string;
  infoCardHtml?: string;
  timelineHtml?: string;
  ctaHtml?: string;
}

function generateEmailTemplate(options: EmailOptions): string {
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
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; background-color: ${COLORS.card}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03), 0 1px 3px rgba(15, 23, 42, 0.02); border: 1px solid ${COLORS.border};">
              ${createHero(options.title)}
              <tr>
                <td style="padding: 40px 32px;">
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: ${COLORS.primary}; font-weight: 500;">Hi <span style="text-transform: capitalize;">${options.candidateName}</span>,</p>
                  
                  ${options.bodyHtml}
                  ${options.infoCardHtml || ""}
                  ${options.timelineHtml || ""}
                  ${options.ctaHtml || ""}
                  
                  ${createDivider()}
                  <p style="margin: 0 0 4px 0; font-size: 14px; color: ${COLORS.secondary};">Best regards,</p>
                  <p style="margin: 0; font-size: 15px; font-weight: 600; color: ${COLORS.primary};">The AloraBridge Team</p>
                </td>
              </tr>
              ${createFooter()}
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * EXPORTED EMAIL FUNCTIONS
 */

export async function sendApplicationConfirmation(to: string, candidateName: string, jobTitle: string) {
  try {
    const htmlContent = generateEmailTemplate({
      title: "Application Received",
      candidateName: candidateName,
      bodyHtml: `
        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: ${COLORS.secondary};">Your application for the <strong>${jobTitle}</strong> position has been received.</p>
        <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: ${COLORS.secondary};">Our recruitment team will now review your profile against the requirements of this role. All future updates regarding your application status will be communicated via email. Please note that due to application volume, only selected candidates may be contacted for the next stage.</p>
      `,
      infoCardHtml: createInfoCard([
        { label: "Role", value: jobTitle },
        { label: "Status", value: "Review in Progress", statusColor: COLORS.primary }
      ]),
      ctaHtml: createButton("View Application Details", "https://alorabridge.com"),
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
        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: ${COLORS.secondary};">Your application for the <strong>${jobTitle}</strong> position has been reviewed.</p>
        <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: ${COLORS.secondary};">We would like to invite you to the next stage of our recruitment process. Please review the interview details below and confirm your availability to proceed.</p>
      `,
      infoCardHtml: createInfoCard([
        { label: "Role", value: jobTitle },
        { label: "Interview Date", value: date },
        { label: "Format", value: "Remote Video Conference" },
        { label: "Duration", value: "45 Minutes" },
        { label: "Hiring Team", value: "AloraBridge Recruitment" },
        { label: "Status", value: "Action Required", statusColor: COLORS.warning }
      ]),
      timelineHtml: createTimeline([
        { number: 1, title: "Confirm Availability", description: "Select the action button below to confirm your attendance." },
        { number: 2, title: "Calendar Invitation", description: "A formal meeting link will be dispatched to this email address." },
        { number: 3, title: "Interview Session", description: "Meet with our team to discuss your background and potential alignment." }
      ]),
      ctaHtml: createButton("Confirm Interview", "https://alorabridge.com"),
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
