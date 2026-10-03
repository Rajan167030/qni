import { NextResponse } from 'next/server';
import { hasAdminSession } from '@/lib/blog-auth';
import { getMongoDbDatabase } from '@/lib/mongodb';
import {
  getWriterActivities,
  ensureDefaultBlogWriters,
  recordWriterActivity,
  extractClientInfo,
  VISHRUTI_WRITER_CONFIG,
} from '@/lib/writer-activity';
import { sendBlogWriterInviteEmail } from '@/lib/email';
import { DEFAULT_WRITERS } from '@/lib/blog-writers-store';

export async function GET(request: Request) {
  try {
    if (!(await hasAdminSession())) {
      return NextResponse.json(
        { success: false, message: 'Admin authentication required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || undefined;
    const action = searchParams.get('action') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 100;

    const db = await getMongoDbDatabase();
    if (db) {
      await ensureDefaultBlogWriters(db);
    }

    const activities = await getWriterActivities({ email, action, limit });

    // Aggregate writers summary and specific tracking for Vishruti
    let writersList: any[] = [];
    if (db) {
      writersList = await db.collection('blog_writers').find({}).sort({ invitedAt: -1 }).toArray();
    } else {
      writersList = DEFAULT_WRITERS;
    }

    // Build statistics for each writer
    const writerSummaries = writersList.map((w: any) => {
      const writerEmail = (w.email || '').toLowerCase().trim();
      const writerActs = activities.filter((a) => a.writerEmail === writerEmail);
      const blogsCreated = writerActs.filter((a) => a.action === 'BLOG_CREATE').length;
      const logins = writerActs.filter((a) => a.action === 'LOGIN').length;
      const lastAct = writerActs[0]?.timestamp || w.invitedAt || null;

      return {
        id: w.id || String(w._id),
        name: w.name,
        email: w.email,
        role: w.role || 'Guest Contributor',
        status: w.status || 'Active',
        password: w.password || (w.email === VISHRUTI_WRITER_CONFIG.email ? VISHRUTI_WRITER_CONFIG.password : '••••••••'),
        totalActivities: writerActs.length,
        blogsCreated,
        logins,
        lastActive: lastAct,
        isTargetWriter: writerEmail === VISHRUTI_WRITER_CONFIG.email,
      };
    });

    const vishrutiSummary = writerSummaries.find(
      (w) => w.email.toLowerCase() === VISHRUTI_WRITER_CONFIG.email
    ) || {
      name: VISHRUTI_WRITER_CONFIG.name,
      email: VISHRUTI_WRITER_CONFIG.email,
      role: VISHRUTI_WRITER_CONFIG.role,
      status: 'Active',
      password: VISHRUTI_WRITER_CONFIG.password,
      totalActivities: activities.filter((a) => a.writerEmail === VISHRUTI_WRITER_CONFIG.email).length,
      blogsCreated: activities.filter(
        (a) => a.writerEmail === VISHRUTI_WRITER_CONFIG.email && a.action === 'BLOG_CREATE'
      ).length,
      logins: activities.filter(
        (a) => a.writerEmail === VISHRUTI_WRITER_CONFIG.email && a.action === 'LOGIN'
      ).length,
      lastActive: activities.find((a) => a.writerEmail === VISHRUTI_WRITER_CONFIG.email)?.timestamp || null,
      isTargetWriter: true,
    };

    return NextResponse.json({
      success: true,
      activities,
      writers: writerSummaries,
      targetWriter: vishrutiSummary,
      totalCount: activities.length,
    });
  } catch (error: any) {
    console.error('Error in GET /api/admin/writer-activities:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await hasAdminSession())) {
      return NextResponse.json(
        { success: false, message: 'Admin authentication required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { ip, userAgent } = extractClientInfo(request);

    if (body.action === 'send_invite') {
      const email = (body.email || VISHRUTI_WRITER_CONFIG.email).toLowerCase().trim();
      const name = body.name || (email === VISHRUTI_WRITER_CONFIG.email ? VISHRUTI_WRITER_CONFIG.name : email.split('@')[0]);
      
      const db = await getMongoDbDatabase();
      let password = VISHRUTI_WRITER_CONFIG.password;
      if (db) {
        const found = await db.collection('blog_writers').findOne({ email });
        if (found?.password) password = found.password;
      }

      const emailSent = await sendBlogWriterInviteEmail(email, name, password).catch((err) => {
        console.warn('[Email] Admin manual trigger error:', err);
        return false;
      });

      await recordWriterActivity({
        writerEmail: email,
        writerName: name,
        action: 'ACCESS_GRANTED',
        actionLabel: `Admin sent blog writer access credentials email to ${email}`,
        details: { manualTrigger: true, emailSent, passwordPreview: password.slice(0, 3) + '***' },
        ip,
        userAgent,
      });

      return NextResponse.json({
        success: true,
        emailSent,
        email,
        password,
        message: emailSent
          ? `Access invitation and credentials successfully sent to ${email}!`
          : `Credentials generated. Please share them manually if SMTP is unreachable: Email: ${email}, Password: ${password}`,
      });
    }

    return NextResponse.json({ success: false, message: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in POST /api/admin/writer-activities:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
