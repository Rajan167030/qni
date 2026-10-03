import { NextResponse } from 'next/server';
import { verifyWriterMagicToken, createBlogSession, setBlogSession } from '@/lib/blog-auth';
import { recordWriterActivity, extractClientInfo, ensureDefaultBlogWriters } from '@/lib/writer-activity';
import { getMongoDbDatabase } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/team-portal?error=missing_token', request.url));
    }

    const payload = verifyWriterMagicToken(token);
    if (!payload || !payload.email) {
      return NextResponse.redirect(new URL('/team-portal?error=invalid_token', request.url));
    }

    const { ip, userAgent } = extractClientInfo(request);

    // Ensure database has writer provisioned
    const db = await getMongoDbDatabase();
    if (db) {
      await ensureDefaultBlogWriters(db);
    }

    // Record login activity
    await recordWriterActivity({
      writerEmail: payload.email,
      writerName: payload.name || 'Writer',
      action: 'LOGIN',
      actionLabel: `Signed into Writer Portal via 1-Click Access Link (Passwordless)`,
      details: {
        method: '1-click-magic-link',
        role: payload.role,
      },
      ip,
      userAgent,
    });

    const redirectUrl = new URL('/team-portal?autologin=success', request.url);
    const response = NextResponse.redirect(redirectUrl);

    // Set the authentication session cookie
    setBlogSession(
      response,
      createBlogSession({
        id: payload.id || `bw-${payload.email}`,
        email: payload.email,
        name: payload.name || 'Writer',
        role: payload.role || 'Blog Writer & Content Contributor',
      })
    );

    return response;
  } catch (error: any) {
    console.error('Error in writer magic login:', error);
    return NextResponse.redirect(new URL('/team-portal?error=login_failed', request.url));
  }
}
