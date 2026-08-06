/**
 * QNexus India — Email Service (Nodemailer + Gmail SMTP)
 *
 * Setup: Add these to your .env.local file:
 *   EMAIL_FROM=your-gmail@gmail.com
 *   EMAIL_PASS=your-gmail-app-password   (NOT your Gmail login password — use App Password)
 *   EMAIL_TO=admin@qnexusindia.com       (where contact form notifications go)
 *   WHATSAPP_LINK=https://chat.whatsapp.com/your-group-invite-code
 *
 * How to get Gmail App Password:
 *   1. Go to your Google Account → Security
 *   2. Enable 2-Step Verification
 *   3. Go to App Passwords → Create one for "Mail"
 *   4. Copy the 16-character password
 */

async function createTransporter() {
  const user = process.env.EMAIL_FROM;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  try {
    // Dynamic import — prevents build error when nodemailer is not yet installed
    const nodemailer = await import('nodemailer');
    return nodemailer.default.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  } catch {
    console.warn('[Email] nodemailer not installed. Run: npm install');
    return null;
  }

}

// ─────────────────────────────────────────────────────────────────
// 1. Welcome Email → sent to user after they fill the Join Us form
// ─────────────────────────────────────────────────────────────────
export async function sendWelcomeEmail(to: string, name: string) {
  const transporter = await createTransporter();
  if (!transporter) {
    console.warn('[Email] Skipping welcome email — EMAIL_FROM/EMAIL_PASS not configured.');
    return false;
  }

  const whatsappLink = process.env.WHATSAPP_LINK || 'https://chat.whatsapp.com/';
  const from = process.env.EMAIL_FROM!;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to QNexus India</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#111118;border-radius:16px;overflow:hidden;border:1px solid rgba(139,92,246,0.2);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a0a2e 0%,#0d1a3a 100%);padding:48px 40px 32px;text-align:center;">
              <div style="display:inline-block;background:linear-gradient(135deg,#8b5cf6,#06b6d4);-webkit-background-clip:text;color:transparent;font-size:28px;font-weight:800;letter-spacing:-0.5px;">QNexus India</div>
              <div style="color:#a78bfa;font-size:13px;letter-spacing:3px;text-transform:uppercase;margin-top:4px;">Quantum Computing Community</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 8px;">Welcome, ${name}! 🎉</h1>
              <p style="color:#a1a1aa;font-size:16px;line-height:1.7;margin:0 0 24px;">
                We're thrilled to have you as a part of <strong style="color:#8b5cf6;">QNexus India</strong> — India's premier quantum computing community bridging research, innovation, and enterprise.
              </p>

              <p style="color:#a1a1aa;font-size:16px;line-height:1.7;margin:0 0 32px;">
                Your application has been received and is under review. Our team will reach out to you shortly with next steps.
              </p>

              <!-- WhatsApp CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#0d2b1f,#0a2010);border:1px solid rgba(34,197,94,0.3);border-radius:12px;padding:24px;">
                    <div style="display:flex;align-items:center;margin-bottom:12px;">
                      <span style="font-size:24px;margin-right:10px;">💬</span>
                      <strong style="color:#22c55e;font-size:16px;">Join our WhatsApp Community</strong>
                    </div>
                    <p style="color:#86efac;font-size:14px;margin:0 0 16px;line-height:1.6;">
                      Connect with fellow quantum enthusiasts, researchers, and developers. Get real-time updates on events, workshops, and opportunities.
                    </p>
                    <a href="${whatsappLink}"
                       style="display:inline-block;background:linear-gradient(135deg,#16a34a,#15803d);color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.5px;">
                      Join WhatsApp Group →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What to expect -->
          <tr>
            <td style="padding:0 40px 32px;">
              <h2 style="color:#ffffff;font-size:16px;font-weight:600;margin:0 0 16px;letter-spacing:0.5px;">WHAT'S NEXT</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 0 12px;">
                    <div style="display:flex;">
                      <span style="color:#8b5cf6;font-size:18px;margin-right:12px;min-width:24px;">✦</span>
                      <span style="color:#a1a1aa;font-size:14px;line-height:1.6;">Our team will review your profile within <strong style="color:#e4e4e7;">2–3 business days</strong>.</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 12px;">
                    <div style="display:flex;">
                      <span style="color:#8b5cf6;font-size:18px;margin-right:12px;min-width:24px;">✦</span>
                      <span style="color:#a1a1aa;font-size:14px;line-height:1.6;">You'll receive a personalized onboarding email with resources and community guidelines.</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 12px;">
                    <div style="display:flex;">
                      <span style="color:#8b5cf6;font-size:18px;margin-right:12px;min-width:24px;">✦</span>
                      <span style="color:#a1a1aa;font-size:14px;line-height:1.6;">Join our <a href="${whatsappLink}" style="color:#8b5cf6;">WhatsApp group</a> in the meantime to start networking.</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0d0d14;padding:24px 40px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
              <p style="color:#52525b;font-size:12px;margin:0 0 8px;">
                This email was sent to you because you applied to join QNexus India.
              </p>
              <p style="color:#52525b;font-size:12px;margin:0;">
                © 2025 QNexus India · <a href="https://qnexusindia.com" style="color:#6d28d9;text-decoration:none;">qnexusindia.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    await transporter.sendMail({
      from: `"QNexus India" <${from}>`,
      to,
      subject: `Welcome to QNexus India, ${name}! 🚀`,
      html,
    });
    console.log(`[Email] Welcome email sent to ${to}`);
    return true;
  } catch (err) {
    console.error('[Email] Failed to send welcome email:', err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────
// 2. Contact Notification → sent to admin when someone contacts us
// ─────────────────────────────────────────────────────────────────
export async function sendContactNotification(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
  organization?: string;
}) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[Email] Skipping contact notification — EMAIL_FROM/EMAIL_PASS not configured.');
    return false;
  }

  const from = process.env.EMAIL_FROM!;
  const adminEmail = process.env.EMAIL_TO || from;
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>New Contact Inquiry — QNexus India</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#111118;border-radius:16px;overflow:hidden;border:1px solid rgba(239,68,68,0.2);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a0a0a 0%,#1a0d0d 100%);padding:32px 40px;text-align:center;">
              <div style="color:#ef4444;font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">📬 New Contact Inquiry</div>
              <div style="color:#ffffff;font-size:22px;font-weight:700;">QNexus India — Admin Alert</div>
              <div style="color:#6b7280;font-size:12px;margin-top:8px;">${timestamp} IST</div>
            </td>
          </tr>

          <!-- Sender Info -->
          <tr>
            <td style="padding:32px 40px 0;">
              <h2 style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px;">SENDER INFORMATION</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(255,255,255,0.06);border-radius:10px;overflow:hidden;">
                <tr style="background:rgba(255,255,255,0.03);">
                  <td style="padding:12px 16px;color:#9ca3af;font-size:13px;width:120px;border-bottom:1px solid rgba(255,255,255,0.05);">Name</td>
                  <td style="padding:12px 16px;color:#ffffff;font-size:14px;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.05);">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;color:#9ca3af;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.05);">Email</td>
                  <td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <a href="mailto:${data.email}" style="color:#60a5fa;text-decoration:none;font-size:14px;">${data.email}</a>
                  </td>
                </tr>
                ${data.phone ? `
                <tr style="background:rgba(255,255,255,0.03);">
                  <td style="padding:12px 16px;color:#9ca3af;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.05);">Phone</td>
                  <td style="padding:12px 16px;color:#e4e4e7;font-size:14px;border-bottom:1px solid rgba(255,255,255,0.05);">${data.phone}</td>
                </tr>` : ''}
                ${data.organization ? `
                <tr>
                  <td style="padding:12px 16px;color:#9ca3af;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.05);">Organization</td>
                  <td style="padding:12px 16px;color:#e4e4e7;font-size:14px;border-bottom:1px solid rgba(255,255,255,0.05);">${data.organization}</td>
                </tr>` : ''}
                <tr style="background:rgba(255,255,255,0.03);">
                  <td style="padding:12px 16px;color:#9ca3af;font-size:13px;">Subject</td>
                  <td style="padding:12px 16px;color:#e4e4e7;font-size:14px;">${data.subject || 'General Inquiry'}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding:24px 40px 0;">
              <h2 style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px;">MESSAGE</h2>
              <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:20px;">
                <p style="color:#d4d4d8;font-size:15px;line-height:1.8;margin:0;white-space:pre-wrap;">${data.message}</p>
              </div>
            </td>
          </tr>

          <!-- Reply CTA -->
          <tr>
            <td style="padding:24px 40px 32px;">
              <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject || 'Your Inquiry to QNexus India')}"
                 style="display:inline-block;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:14px;font-weight:600;">
                Reply to ${data.name} →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0d0d14;padding:20px 40px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
              <p style="color:#52525b;font-size:12px;margin:0;">
                QNexus India Admin Dashboard · Auto-generated notification
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    await transporter.sendMail({
      from: `"QNexus India Contact Form" <${from}>`,
      to: adminEmail,
      replyTo: `"${data.name}" <${data.email}>`,   // ← reply directly to the person
      subject: `[Contact] ${data.subject || 'General Inquiry'} — from ${data.name}`,
      html,
    });
    console.log(`[Email] Contact notification sent to admin for ${data.email}`);
    return true;
  } catch (err) {
    console.error('[Email] Failed to send contact notification:', err);
    return false;
  }
}
