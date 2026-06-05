import { Router } from "express";
import { Resend } from "resend";

const router = Router();
// Using process.env directly with a string cast bypasses the strict env typing error
const resend = new Resend(process.env.RESEND_API_KEY as string); 

router.post("/", async (req, res) => {
  try {
    const { name, email, company, phone, service, message } = req.body;

    // Safely construct the subject line
    const emailSubject = service 
      ? `New Lead: ${service.toUpperCase()} from ${name}` 
      : `New Lead: GENERAL INQUIRY from ${name}`;

    // Safely construct the HTML body using template literals
    const emailHtml = `
      <h2>New Contact Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
      <p><strong>Company:</strong> ${company || "Not provided"}</p>
      <p><strong>Service Interest:</strong> ${service || "Not specified"}</p>
      <br/>
      <h3>Message:</h3>
      <p>${message}</p>
    `;

    // Send the email notification to your support inbox
    await resend.emails.send({
      from: "AloraBridge System <onboarding@resend.dev>",
      to: "support@alorabridge.com", 
      subject: emailSubject,
      html: emailHtml,
    });

    res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({ error: "Failed to process contact request" });
  }
});

export default router;
