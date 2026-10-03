import { NextResponse } from 'next/server';
import { getBlogSession } from '@/lib/blog-auth';

export async function GET() {
  try {
    const session = await getBlogSession();
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({
      authenticated: true,
      writer: {
        id: session.id,
        name: session.name,
        email: session.email,
        role: session.role || 'Blog Writer & Content Contributor',
      },
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
