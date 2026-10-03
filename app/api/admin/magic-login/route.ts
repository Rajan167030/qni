import { NextResponse } from 'next/server';
import { verifyAdminMagicToken } from '@/lib/blog-auth';

/**
 * GET /api/admin/magic-login?token=<admin_magic_token>
 *
 * Validates the admin magic token and sets the admin magic session cookie,
 * then redirects to /admin. Works exactly like the blog writer magic login
 * but for admin access.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token') || undefined;

  const adminData = verifyAdminMagicToken(token);

  if (!adminData) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.quantumnexusglobal.org';
    return NextResponse.redirect(`${siteUrl}/admin?error=invalid_token`);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.quantumnexusglobal.org';
  const response = NextResponse.redirect(`${siteUrl}/admin`);

  // Set the admin magic session cookie (30-day life)
  const maxAge = 60 * 60 * 24 * 30;
  response.cookies.set('qni_admin_magic_session', token!, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge,
    secure: process.env.NODE_ENV === 'production',
  });

  // Also set the standard admin session flag so existing checks pass
  response.cookies.set('qni_admin_session', 'true', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge,
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
