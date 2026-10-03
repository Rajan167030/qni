import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';
import { createBlogSession, setBlogSession } from '@/lib/blog-auth';
import { ensureDefaultBlogWriters, recordWriterActivity, extractClientInfo, VISHRUTI_WRITER_CONFIG } from '@/lib/writer-activity';
import { DEFAULT_WRITERS } from '@/lib/blog-writers-store';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!normalizedEmail || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required.' }, { status: 400 });
    }

    const { ip, userAgent } = extractClientInfo(request);
    const db = await getMongoDbDatabase();
    
    let writer: any = null;

    if (db) {
      // Ensure vishruti0129@gmail.com is seeded
      await ensureDefaultBlogWriters(db);
      writer = await db.collection('blog_writers').findOne({ email: normalizedEmail, status: 'Active' });
    }

    // Fallback if MongoDB is not responding or writer not in db yet
    if (!writer) {
      const match = DEFAULT_WRITERS.find(
        (w) => w.email.toLowerCase() === normalizedEmail && w.status === 'Active'
      );
      if (match) {
        writer = match;
      }
    }

    if (!writer || writer.password !== password) {
      return NextResponse.json({ success: false, message: 'Invalid writer email or password.' }, { status: 401 });
    }

    // Log the successful LOGIN activity
    await recordWriterActivity({
      writerEmail: writer.email,
      writerName: writer.name,
      action: 'LOGIN',
      actionLabel: `Signed into Team Writer Portal`,
      details: { role: writer.role },
      ip,
      userAgent,
    });

    const response = NextResponse.json({
      success: true,
      writer: { name: writer.name, email: writer.email, role: writer.role || 'Guest Contributor' },
    });

    setBlogSession(
      response,
      createBlogSession({
        id: writer.id || String(writer._id || 'writer-id'),
        email: writer.email,
        name: writer.name,
        role: writer.role || 'Guest Contributor',
      })
    );

    return response;
  } catch (error: any) {
    console.error('Error in writer login:', error);
    return NextResponse.json({ success: false, message: 'Unable to sign in.' }, { status: 500 });
  }
}
