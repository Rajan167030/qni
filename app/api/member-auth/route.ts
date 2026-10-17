import { NextResponse } from 'next/server';
import { sendMemberOtpEmail } from '@/lib/email';
import {
  OTP_RESEND_COOLDOWN_MS,
  clearMemberSession,
  createMemberSession,
  findCommunityMember,
  getMemberSession,
  issueOtp,
  normalizeEmail,
  setMemberSession,
  verifyOtp,
} from '@/lib/member-auth';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Current member session, if any. */
export async function GET() {
  const session = await getMemberSession();
  if (!session) return NextResponse.json({ authenticated: false });
  return NextResponse.json({ authenticated: true, member: { email: session.email, name: session.name, role: session.role } });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email);
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ success: false, error: 'Enter a valid email address.' }, { status: 400 });
    }

    const member = await findCommunityMember(email);
    if (!member) {
      return NextResponse.json(
        {
          success: false,
          notMember: true,
          error: 'This email is not registered with QNG. Join QNG or register for an event first, using this email.',
        },
        { status: 404 }
      );
    }

    if (body.action === 'request') {
      const issued = await issueOtp(email);
      if (!issued.ok) {
        return NextResponse.json({ success: false, error: issued.error, retryAfterMs: issued.retryAfterMs }, { status: 429 });
      }
      const sent = await sendMemberOtpEmail(email, member.name, issued.code);
      if (!sent) {
        if (process.env.NODE_ENV !== 'production') {
          // Local development without SMTP credentials: print the code instead.
          console.log(`[member-auth] Sign-in code for ${email}: ${issued.code}`);
        } else {
          return NextResponse.json({ success: false, error: 'Could not send the email right now. Please try again shortly.' }, { status: 502 });
        }
      }
      return NextResponse.json({ success: true, resendAfterMs: OTP_RESEND_COOLDOWN_MS });
    }

    if (body.action === 'verify') {
      const code = typeof body.code === 'string' ? body.code.replace(/\s+/g, '') : '';
      if (!/^\d{6}$/.test(code)) {
        return NextResponse.json({ success: false, error: 'Enter the 6-digit code from the email.' }, { status: 400 });
      }
      const result = await verifyOtp(email, code);
      if (!result.ok) return NextResponse.json({ success: false, error: result.error }, { status: 401 });

      const response = NextResponse.json({ success: true, member: { email, name: member.name, role: member.role } });
      setMemberSession(response, createMemberSession({ email, name: member.name, role: member.role }));
      return response;
    }

    return NextResponse.json({ success: false, error: 'Unknown action.' }, { status: 400 });
  } catch (error) {
    console.error('Error in member auth:', error);
    return NextResponse.json({ success: false, error: 'Sign-in failed. Please try again.' }, { status: 500 });
  }
}

/** Sign out. */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  clearMemberSession(response);
  return response;
}
