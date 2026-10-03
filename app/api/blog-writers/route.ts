import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';
import { sendBlogWriterInviteEmail } from '@/lib/email';
import { hasAdminSession } from '@/lib/blog-auth';
import { ensureDefaultBlogWriters, recordWriterActivity, extractClientInfo, VISHRUTI_WRITER_CONFIG } from '@/lib/writer-activity';

/**
 * Blog writer invite schema (MongoDB document)
 * {
 *   id: string,
 *   name: string,
 *   email: string,
 *   password: string,   // auto-generated, emailed to the invitee
 *   role: string,
 *   invitedAt: Date,
 *   status: 'Active' | 'Revoked',
 * }
 */

const PASSWORD_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
function generateSimplePassword(length = 8): string {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += PASSWORD_CHARS[Math.floor(Math.random() * PASSWORD_CHARS.length)];
  }
  return out;
}

export async function GET() {
  try {
    if (!(await hasAdminSession())) {
      return NextResponse.json({ success: false, message: 'Admin authentication required.' }, { status: 401 });
    }
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });
    
    // Automatically ensure vishruti0129@gmail.com is seeded and active
    await ensureDefaultBlogWriters(db);

    const writers = await db.collection('blog_writers').find({}).sort({ invitedAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: writers });
  } catch (error: any) {
    console.error('Error fetching blog writers:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await hasAdminSession())) {
      return NextResponse.json({ success: false, message: 'Admin authentication required.' }, { status: 401 });
    }
    const body = await request.json();
    const { ip, userAgent } = extractClientInfo(request);

    // Support resending invite email
    if (body.action === 'resend_invite') {
      const email = (body.email || '').trim().toLowerCase();
      if (!email) {
        return NextResponse.json({ success: false, message: 'Email required' }, { status: 400 });
      }
      const db = await getMongoDbDatabase();
      let writer = db ? await db.collection('blog_writers').findOne({ email }) : null;
      let password = writer?.password || (email === VISHRUTI_WRITER_CONFIG.email ? VISHRUTI_WRITER_CONFIG.password : generateSimplePassword());
      let name = writer?.name || (email === VISHRUTI_WRITER_CONFIG.email ? VISHRUTI_WRITER_CONFIG.name : email.split('@')[0]);

      if (db && !writer) {
        writer = {
          id: `bw-${Date.now()}`,
          name,
          email,
          password,
          role: 'Blog Writer & Content Contributor',
          invitedAt: new Date(),
          status: 'Active',
        };
        await db.collection('blog_writers').insertOne(writer);
      }

      const emailSent = await sendBlogWriterInviteEmail(email, name, password).catch((err) => {
        console.warn('[Email] Resend invite error:', err);
        return false;
      });

      await recordWriterActivity({
        writerEmail: email,
        writerName: name,
        action: 'ACCESS_GRANTED',
        actionLabel: `Invite email ${emailSent ? 'sent' : 'triggered (SMTP check required)'} by Admin`,
        details: { resend: true, emailSent },
        ip,
        userAgent,
      });

      return NextResponse.json({ success: true, emailSent, password, message: emailSent ? `Invite email sent to ${email}` : `Writer credentials ready. Password: ${password}` });
    }

    const name = (body.name || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const role = (body.role || 'Guest Contributor').trim();

    if (!name || !email) {
      return NextResponse.json({ success: false, message: 'Name and email are required' }, { status: 400 });
    }

    const password = email === VISHRUTI_WRITER_CONFIG.email ? VISHRUTI_WRITER_CONFIG.password : generateSimplePassword();
    const writer = {
      id: email === VISHRUTI_WRITER_CONFIG.email ? VISHRUTI_WRITER_CONFIG.id : `bw-${Date.now()}`,
      name,
      email,
      password,
      role,
      invitedAt: new Date(),
      status: 'Active',
    };

    const db = await getMongoDbDatabase();
    if (db) {
      await db.collection('blog_writers').updateOne(
        { email },
        { $set: writer },
        { upsert: true }
      );
    }

    const emailSent = await sendBlogWriterInviteEmail(email, name, password).catch((err) => {
      console.warn('[Email] Blog writer invite error:', err);
      return false;
    });

    await recordWriterActivity({
      writerEmail: email,
      writerName: name,
      action: 'ACCESS_GRANTED',
      actionLabel: `Granted blog writing access to ${name} (${email})`,
      details: { role, emailSent },
      ip,
      userAgent,
    });

    return NextResponse.json(
      { success: true, data: writer, emailSent, dbConfigured: !!db },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating blog writer invite:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await hasAdminSession())) {
      return NextResponse.json({ success: false, message: 'Admin authentication required.' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');
    if (!id && !email) {
      return NextResponse.json({ success: false, message: 'Missing id or email' }, { status: 400 });
    }
    const { ip, userAgent } = extractClientInfo(request);
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });
    
    await db.collection('blog_writers').deleteOne(id ? { id } : { email });

    await recordWriterActivity({
      writerEmail: email || id || 'unknown',
      action: 'LOGOUT',
      actionLabel: `Revoked blog writing access for ${email || id}`,
      details: { revoked: true },
      ip,
      userAgent,
    });

    return NextResponse.json({ success: true, message: 'Blog writer access revoked' });
  } catch (error: any) {
    console.error('Error revoking blog writer:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
