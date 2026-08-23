/**
 * QNexus — Email Service (Nodemailer + Gmail SMTP)
 *
 * Clean, modern white-themed templates designed for maximum readability,
 * authentic human tone, and email client compatibility.
 */

async function createTransporter() {
  const user = process.env.EMAIL_FROM;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  try {
    const nodemailer = await import('nodemailer');
    return nodemailer.default.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  } catch {
    console.warn('[Email] nodemailer not installed or unavailable.');
    return null;
  }
}

function escapeHtml(str?: string | null): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ─────────────────────────────────────────────────────────────────
// 1. Welcome Email → Sent to applicant after filling the Join Us form
// ─────────────────────────────────────────────────────────────────
export async function sendWelcomeEmail(to: string, name: string) {
  const transporter = await createTransporter();
  if (!transporter) {
    console.warn('[Email] Skipping welcome email — EMAIL_FROM/EMAIL_PASS not configured.');
    return false;
  }

  const whatsappLink = process.env.WHATSAPP_LINK || 'https://chat.whatsapp.com/your-group-invite';
  const from = process.env.EMAIL_FROM!;
  const safeName = escapeHtml(name);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Quantum Nexus Global</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f8; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 36px 24px; border-bottom: 1px solid #f1f5f9;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <img src="https://www.quantumnexusglobal.org/logo-mark.png" alt="Quantum Nexus Global" width="140" style="display: block; max-width: 140px; height: auto;" />
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background-color: #eef2ff; color: #4338ca; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; padding: 4px 10px; border-radius: 9999px;">
                      Community
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 36px 24px;">
              <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 16px; line-height: 1.3;">
                Welcome to Quantum Nexus Global, ${safeName}
              </h1>
              
              <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 18px;">
                Thank you for applying to join <strong>Quantum Nexus Global (QNexus)</strong>. We are a student-first, open quantum computing initiative bringing together learners, researchers, and professionals to build real-world quantum literacy.
              </p>

              <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 28px;">
                Your application has been received by our community team. In the meantime, you are warmly invited to connect with members and get real-time updates on upcoming sessions, talks, and research grants.
              </p>

              <!-- WhatsApp Action Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <div style="font-size: 15px; font-weight: 600; color: #166534; margin-bottom: 4px;">
                            Join our Community Group
                          </div>
                          <div style="font-size: 13px; color: #15803d; line-height: 1.5; margin-bottom: 16px;">
                            Meet other quantum enthusiasts, join live paper discussions, and receive event announcements directly.
                          </div>
                          <a href="${whatsappLink}" target="_blank" style="display: inline-block; background-color: #16a34a; color: #ffffff; font-size: 13px; font-weight: 600; text-decoration: none; padding: 10px 20px; border-radius: 6px;">
                            Join WhatsApp Community &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- What's Next Section -->
              <div style="border-top: 1px solid #f1f5f9; padding-top: 24px;">
                <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 14px;">
                  What to expect next
                </div>
                
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align: top; width: 24px; font-size: 14px; color: #4338ca; font-weight: bold; line-height: 1.6;">1.</td>
                    <td style="padding-bottom: 12px; font-size: 14px; line-height: 1.6; color: #475569;">
                      Our team reviews each application within <strong>1–2 business days</strong>.
                    </td>
                  </tr>
                  <tr>
                    <td style="vertical-align: top; width: 24px; font-size: 14px; color: #4338ca; font-weight: bold; line-height: 1.6;">2.</td>
                    <td style="padding-bottom: 12px; font-size: 14px; line-height: 1.6; color: #475569;">
                      You'll receive onboarding details, session invites, and curated learning roadmaps.
                    </td>
                  </tr>
                  <tr>
                    <td style="vertical-align: top; width: 24px; font-size: 14px; color: #4338ca; font-weight: bold; line-height: 1.6;">3.</td>
                    <td style="font-size: 14px; line-height: 1.6; color: #475569;">
                      If you have specific questions or ideas for collaboration, you can reply directly to this email.
                    </td>
                  </tr>
                </table>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 36px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="font-size: 12px; color: #64748b; margin: 0 0 6px; line-height: 1.5;">
                You received this email because you submitted an application on <a href="https://www.quantumnexusglobal.org" style="color: #2563eb; text-decoration: none;">quantumnexusglobal.org</a>.
              </p>
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">
                &copy; 2026 Quantum Nexus Global &middot; Advancing Quantum Computing
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Welcome to Quantum Nexus Global, ${name}!

Thank you for applying to join Quantum Nexus Global (QNexus). We are a student-first quantum computing community bringing together learners, researchers, and professionals.

Your application has been received and is under review.

Join our community WhatsApp group here:
${whatsappLink}

What to expect next:
1. Application review within 1-2 business days.
2. Direct invitations to webinars, mentorship sessions, and workshops.
3. Access to community projects and collaboration channels.

If you have any questions, feel free to reply directly to this email.

— The Quantum Nexus Global Team
https://www.quantumnexusglobal.org`;

  try {
    await transporter.sendMail({
      from: `"Quantum Nexus Global" <${from}>`,
      to,
      subject: `Welcome to Quantum Nexus Global, ${name}`,
      html,
      text,
    });
    console.log(`[Email] Welcome email sent to ${to}`);
    return true;
  } catch (err) {
    console.error('[Email] Failed to send welcome email:', err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────
// 2. Admin Form Submission Notification → Handles both Join & Contact
// ─────────────────────────────────────────────────────────────────
export interface FormSubmissionPayload {
  formType: 'Join Us Application' | 'Contact Us Inquiry' | 'Research Grant Proposal';
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  position?: string;
  expertise?: string;
  experience?: string;
  country?: string;
  subject?: string;
  inquiryType?: string;
  message?: string;
}

export async function sendAdminNotification(data: FormSubmissionPayload) {
  const transporter = await createTransporter();
  if (!transporter) {
    console.warn('[Email] Skipping admin notification — EMAIL_FROM/EMAIL_PASS not configured.');
    return false;
  }

  const from = process.env.EMAIL_FROM!;
  const adminEmail = process.env.EMAIL_TO || from;
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // Badge theming per form type
  const isJoin = data.formType === 'Join Us Application';
  const isResearch = data.formType === 'Research Grant Proposal';
  const badgeBg = isJoin ? '#eef2ff' : isResearch ? '#faf5ff' : '#f0fdf4';
  const badgeColor = isJoin ? '#4338ca' : isResearch ? '#7c3aed' : '#15803d';
  const badgeBorder = isJoin ? '#c7d2fe' : isResearch ? '#ddd6fe' : '#bbf7d0';

  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safePhone = escapeHtml(data.phone);
  const safeOrg = escapeHtml(data.organization);
  const safePosition = escapeHtml(data.position);
  const safeExpertise = escapeHtml(data.expertise);
  const safeExperience = escapeHtml(data.experience);
  const safeCountry = escapeHtml(data.country);
  const fallbackSubject = isJoin ? 'Community Application' : isResearch ? 'Research Grant Proposal' : 'Inquiry';
  const safeSubject = escapeHtml(data.subject || data.inquiryType || fallbackSubject);
  const safeMessage = escapeHtml(data.message);

  const subjectLine = `[${data.formType}] ${safeSubject} — ${safeName}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.formType} — Notification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f8; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 28px 36px 20px; border-bottom: 1px solid #f1f5f9;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 4px;">
                      QNexus Admin Alert
                    </div>
                    <div style="font-size: 18px; font-weight: 700; color: #0f172a;">
                      New Submission Received
                    </div>
                  </td>
                  <td align="right" style="vertical-align: top;">
                    <span style="display: inline-block; background-color: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeBorder}; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; padding: 5px 10px; border-radius: 9999px;">
                      ${data.formType}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Summary Meta Box -->
          <tr>
            <td style="padding: 24px 36px 8px;">
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #94a3b8; margin-bottom: 12px;">
                Submission Details
              </div>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; border-collapse: collapse;">
                
                <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #64748b; width: 130px;">Form Source</td>
                  <td style="padding: 10px 14px; font-size: 13px; font-weight: 700; color: ${badgeColor};">${data.formType}</td>
                </tr>

                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #64748b;">Full Name</td>
                  <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #0f172a;">${safeName}</td>
                </tr>

                <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #64748b;">Email Address</td>
                  <td style="padding: 10px 14px; font-size: 13px;">
                    <a href="mailto:${safeEmail}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${safeEmail}</a>
                  </td>
                </tr>

                ${data.phone ? `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #64748b;">Phone / WhatsApp</td>
                  <td style="padding: 10px 14px; font-size: 13px; color: #0f172a;">${safePhone}</td>
                </tr>` : ''}

                ${data.organization ? `
                <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #64748b;">Organization / College</td>
                  <td style="padding: 10px 14px; font-size: 13px; color: #0f172a;">${safeOrg}</td>
                </tr>` : ''}

                ${data.position ? `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #64748b;">Role / Position</td>
                  <td style="padding: 10px 14px; font-size: 13px; color: #0f172a;">${safePosition}</td>
                </tr>` : ''}

                ${data.expertise ? `
                <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #64748b;">Area of Interest</td>
                  <td style="padding: 10px 14px; font-size: 13px; color: #0f172a;">${safeExpertise}</td>
                </tr>` : ''}

                ${data.experience ? `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #64748b;">Experience Level</td>
                  <td style="padding: 10px 14px; font-size: 13px; color: #0f172a;">${safeExperience}</td>
                </tr>` : ''}

                ${data.country ? `
                <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #64748b;">Country</td>
                  <td style="padding: 10px 14px; font-size: 13px; color: #0f172a;">${safeCountry}</td>
                </tr>` : ''}

                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #64748b;">Subject / Topic</td>
                  <td style="padding: 10px 14px; font-size: 13px; color: #0f172a;">${safeSubject}</td>
                </tr>

                <tr>
                  <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #64748b;">Timestamp</td>
                  <td style="padding: 10px 14px; font-size: 12px; color: #64748b;">${timestamp} IST</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Block (if present) -->
          ${data.message ? `
          <tr>
            <td style="padding: 16px 36px 8px;">
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #94a3b8; margin-bottom: 8px;">
                User Message / Statement
              </div>
              <div style="background-color: #f8fafc; border-left: 3px solid #2563eb; border-radius: 0 6px 6px 0; padding: 14px 18px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${safeMessage}</div>
            </td>
          </tr>` : ''}

          <!-- Quick Action Reply Button -->
          <tr>
            <td style="padding: 24px 36px 28px;">
              <a href="mailto:${safeEmail}?subject=Re: ${encodeURIComponent(data.subject || `Your ${data.formType} with QNexus`)}"
                 style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 11px 22px; border-radius: 6px; font-size: 13px; font-weight: 600;">
                Reply via Email &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 18px 36px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                Automated admin notification from QNexus Portal &middot; ${data.formType}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `[QNG Notification] New ${data.formType}

Form: ${data.formType}
Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}\n` : ''}${data.organization ? `Organization: ${data.organization}\n` : ''}${data.position ? `Position: ${data.position}\n` : ''}${data.expertise ? `Area: ${data.expertise}\n` : ''}${data.experience ? `Experience: ${data.experience}\n` : ''}${data.country ? `Country: ${data.country}\n` : ''}Subject: ${data.subject || data.inquiryType || 'N/A'}
Timestamp: ${timestamp} IST

Message:
${data.message || 'No additional message provided.'}

— Quantum nexus global Admin Notification`;

  try {
    await transporter.sendMail({
      from: `"Quantum Nexus Global" <${from}>`,
      to: adminEmail,
      replyTo: `"${data.name}" <${data.email}>`,
      subject: subjectLine,
      html,
      text,
    });
    console.log(`[Email] Admin notification sent for [${data.formType}] from ${data.email}`);
    return true;
  } catch (err) {
    console.error(`[Email] Failed to send admin notification for ${data.formType}:`, err);
    return false;
  }
}

// Contact Form Notification alias
export async function sendContactNotification(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
  organization?: string;
  inquiryType?: string;
}) {
  return sendAdminNotification({
    formType: 'Contact Us Inquiry',
    name: data.name,
    email: data.email,
    phone: data.phone,
    organization: data.organization,
    subject: data.subject || data.inquiryType || 'Contact Inquiry',
    inquiryType: data.inquiryType,
    message: data.message,
  });
}

// ─────────────────────────────────────────────────────────────────
// 4. Newsletter Welcome Email → Sent immediately upon email subscription
// ─────────────────────────────────────────────────────────────────
export async function sendNewsletterWelcomeEmail(to: string) {
  const transporter = await createTransporter();
  if (!transporter) {
    console.warn('[Email] Skipping newsletter email — EMAIL_FROM/EMAIL_PASS not configured.');
    return false;
  }

  const from = process.env.EMAIL_FROM!;
  const safeTo = escapeHtml(to);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're in — QNG</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2328; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #ffffff; border: 1px solid #d0d7de; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(140, 149, 159, 0.1);">
          
          <!-- Header Bar -->
          <tr>
            <td style="padding: 28px 32px 20px; border-bottom: 1px solid #eaeef2; background-color: #ffffff;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size: 16px; font-weight: 800; color: #0969da; letter-spacing: -0.3px;">
                      QNG
                    </div>
                    <div style="font-size: 12px; color: #656d76; margin-top: 2px;">
                      Student-First Quantum Community
                    </div>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; background-color: #dafbe1; color: #1a7f37; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 9999px;">
                      Subscribed
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding: 32px 32px 28px;">
              <p style="font-size: 16px; line-height: 1.5; color: #1f2328; margin: 0 0 18px;">
                Hey there,
              </p>
              
              <p style="font-size: 15px; line-height: 1.65; color: #32383f; margin: 0 0 16px;">
                Thanks for dropping your email. You're now on our personal list for everything happening at <strong>QNexus India</strong>.
              </p>

              <p style="font-size: 15px; line-height: 1.65; color: #32383f; margin: 0 0 20px;">
                We started this initiative with a straightforward goal: give Indian students and researchers direct, no-cost access to real quantum hardware, practical circuit coding, and experienced mentors.
              </p>

              <!-- What to expect block -->
              <div style="background-color: #f8fafc; border: 1px solid #d0d7de; border-radius: 8px; padding: 18px 20px; margin-bottom: 24px;">
                <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #57606a; margin-bottom: 12px;">
                  What you will actually get from us:
                </div>
                
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align: top; width: 20px; font-size: 14px; color: #0969da; line-height: 1.6;">•</td>
                    <td style="padding-bottom: 10px; font-size: 14px; line-height: 1.6; color: #24292f;">
                      <strong>Direct invitations</strong> to our 4-Part Online Quantum Masterclasses (Qiskit 1.0, VQE, QML, and real QPU hardware execution).
                    </td>
                  </tr>
                  <tr>
                    <td style="vertical-align: top; width: 20px; font-size: 14px; color: #0969da; line-height: 1.6;">•</td>
                    <td style="padding-bottom: 10px; font-size: 14px; line-height: 1.6; color: #24292f;">
                      <strong>Compute Grant alerts</strong> for free cloud QPU time and 1-on-1 PhD research mentorship.
                    </td>
                  </tr>
                  <tr>
                    <td style="vertical-align: top; width: 20px; font-size: 14px; color: #0969da; line-height: 1.6;">•</td>
                    <td style="font-size: 14px; line-height: 1.6; color: #24292f;">
                      <strong>Curated breakdowns</strong> of quantum papers and open-source repos — written in plain, practical language.
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Quick action links -->
              <p style="font-size: 15px; line-height: 1.65; color: #32383f; margin: 0 0 24px;">
                No spam, no promotional junk. Just honest updates and real learning opportunities.
              </p>

              <div style="margin-bottom: 28px;">
                <a href="https://www.quantumnexusglobal.org/events" target="_blank" style="display: inline-block; background-color: #0969da; color: #ffffff; font-size: 13px; font-weight: 600; text-decoration: none; padding: 11px 22px; border-radius: 6px;">
                  View Online Masterclasses &rarr;
                </a>
              </div>

              <p style="font-size: 14px; line-height: 1.6; color: #57606a; margin: 0 0 16px;">
                If you're currently working on a quantum circuit, paper, or just exploring where to start, feel free to reply directly to this email. We read and respond to every note.
              </p>

              <p style="font-size: 15px; line-height: 1.6; color: #1f2328; margin: 0;">
                Warmly,<br />
                <strong>Sharvan Kumar Sharma</strong><br />
                <span style="font-size: 13px; color: #656d76;">Founder, QNexus India</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #eaeef2; text-align: center;">
              <p style="font-size: 12px; color: #656d76; margin: 0 0 4px; line-height: 1.5;">
                Sent to <strong style="color: #24292f;">${safeTo}</strong> because you joined the QNexus community newsletter.
              </p>
              <p style="font-size: 12px; color: #8c959f; margin: 0;">
                &copy; 2026 QNexus India &middot; Advancing Quantum Computing in India
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Hey there,

Thanks for dropping your email. You're now on our personal list for everything happening at QNG.

We started this initiative with a straightforward goal: give students and researchers direct, no-cost access to real quantum hardware, practical circuit coding, and experienced mentors.

What you'll get from us (and only this):
• Direct invitations to our 4-Part Online Quantum Masterclasses (Qiskit 1.0, VQE, QML, Real QPU Runs).
• Compute Grant alerts for free cloud QPU time and 1-on-1 PhD mentorship.
• Curated breakdowns of quantum papers and open-source tools.

No spam, ever.

Explore our upcoming online sessions here:
https://www.quantumnexusglobal.org/events

If you're working on a quantum project or have questions, simply reply directly to this email. We read every message.

Warmly,
Sharvan Kumar Sharma
Founder, QNexus nexus global
https://www.quantumnexusglobal.org`;

  try {
    await transporter.sendMail({
      from: `"Sharvan Kumar Sharma (Quantum nexus global)" <${from}>`,
      to,
      subject: `You're in — Welcome to Quantum nexus global`,
      html,
      text,
    });
    console.log(`[Email] Newsletter welcome email sent to ${to}`);
    return true;
  } catch (err) {
    console.error('[Email] Failed to send newsletter welcome email:', err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────
// 5. Blog Writer Invite Email → Sent when admin grants someone blog access
// ─────────────────────────────────────────────────────────────────
export async function sendBlogWriterInviteEmail(to: string, name: string, password: string) {
  const transporter = await createTransporter();
  if (!transporter) {
    console.warn('[Email] Skipping blog writer invite email — EMAIL_FROM/EMAIL_PASS not configured.');
    return false;
  }

  const from = process.env.EMAIL_FROM!;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(to);
  const safePassword = escapeHtml(password);
  const portalUrl = 'https://www.quantumnexusglobal.org/team-portal';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You've been given blog access — QNG</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f8; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 32px 36px 24px; border-bottom: 1px solid #f1f5f9;">
              <div style="font-size: 16px; font-weight: 800; color: #0f172a; letter-spacing: -0.3px; margin-bottom: 8px;">QNG</div>
              <span style="display: inline-block; background-color: #faf5ff; color: #7c3aed; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 4px 10px; border-radius: 9999px;">
                Blog Writer Access Granted
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 36px 8px;">
              <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 16px; line-height: 1.3;">
                Hi ${safeName}, you can now write for the QNG Blog
              </h1>
              <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 20px;">
                The QNG admin has given you access to the Team Writer Portal — you can write, edit, and publish blog articles directly to the QNG blog.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 14px;">
                      Your Writer Portal Login
                    </div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom: 10px; font-size: 13px; color: #64748b; width: 110px;">Portal URL</td>
                        <td style="padding-bottom: 10px; font-size: 13px; font-weight: 600;"><a href="${portalUrl}" style="color: #2563eb; text-decoration: none;">quantumnexusglobal.org/team-portal</a></td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px; font-size: 13px; color: #64748b;">Email</td>
                        <td style="padding-bottom: 10px; font-size: 13px; font-weight: 700; color: #0f172a; font-family: monospace;">${safeEmail}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #64748b;">Password</td>
                        <td style="font-size: 13px; font-weight: 700; color: #0f172a; font-family: monospace;">${safePassword}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <a href="${portalUrl}" target="_blank" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 13px; font-weight: 600; text-decoration: none; padding: 11px 22px; border-radius: 6px; margin-bottom: 20px;">
                Open Writer Portal &rarr;
              </a>

              <p style="font-size: 13px; line-height: 1.6; color: #94a3b8; margin: 20px 0 0;">
                Keep this password private. This access can be revoked by the admin at any time.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 36px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">&copy; 2026 QNG</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Hi ${name}, you can now write for the QNG Blog

The QNG admin has given you access to the Team Writer Portal.

Portal URL: ${portalUrl}
Email: ${to}
Password: ${password}

Keep this password private. This access can be revoked by the admin at any time.

— QNG`;

  try {
    await transporter.sendMail({
      from: `"QNG" <${from}>`,
      to,
      subject: "You've been given blog access — QNG",
      html,
      text,
    });
    console.log(`[Email] Blog writer invite sent to ${to}`);
    return true;
  } catch (err) {
    console.error('[Email] Failed to send blog writer invite email:', err);
    return false;
  }
}
