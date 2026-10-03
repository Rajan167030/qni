import { NextResponse } from 'next/server';
import { clearBlogSession, getBlogSession } from '@/lib/blog-auth';
import { recordWriterActivity, extractClientInfo } from '@/lib/writer-activity';

export async function POST(request: Request) {
  try {
    const session = await getBlogSession();
    if (session) {
      const { ip, userAgent } = extractClientInfo(request);
      await recordWriterActivity({
        writerEmail: session.email,
        writerName: session.name,
        action: 'LOGOUT',
        actionLabel: 'Logged out of Writer Portal',
        ip,
        userAgent,
      });
    }
  } catch (err) {
    console.warn('[Logout API] Notice logging activity:', err);
  }

  const response = NextResponse.json({ success: true });
  clearBlogSession(response);
  return response;
}
