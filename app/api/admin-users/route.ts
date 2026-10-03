import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';
import { hasAdminSession } from '@/lib/blog-auth';
import { generateAdminMagicToken } from '@/lib/blog-auth';
import { sendAdminInviteEmail } from '@/lib/email';

/**
 * Admin Users collection schema (MongoDB)
 * {
 *   id: string,
 *   name: string,
 *   email: string,
 *   role: string,          // e.g. "Co-Admin", "Event Manager", "Content Manager"
 *   invitedAt: Date,
 *   status: 'Active' | 'Revoked',
 *   lastLoginAt?: Date,
 * }
 */

export async function GET() {
  try {
    if (!(await hasAdminSession())) {
      return NextResponse.json({ success: false, message: 'Admin authentication required.' }, { status: 401 });
    }
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });

    const users = await db.collection('admin_users').find({}).sort({ invitedAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await hasAdminSession())) {
      return NextResponse.json({ success: false, message: 'Admin authentication required.' }, { status: 401 });
    }
    const body = await request.json();

    // Resend invite action
    if (body.action === 'resend_invite') {
      const email = (body.email || '').trim().toLowerCase();
      if (!email) return NextResponse.json({ success: false, message: 'Email required' }, { status: 400 });

      const db = await getMongoDbDatabase();
      const user = db ? await db.collection('admin_users').findOne({ email }) : null;
      const name = user?.name || email.split('@')[0];

      const magicToken = generateAdminMagicToken({ email, name });
      const emailSent = await sendAdminInviteEmail(email, name, user?.role || 'Co-Admin', magicToken).catch(() => false);

      return NextResponse.json({
        success: true,
        emailSent,
        message: emailSent ? `Invite re-sent to ${email}` : `Could not send email — SMTP may not be configured.`,
      });
    }

    const name = (body.name || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const role = (body.role || 'Co-Admin').trim();

    if (!name || !email) {
      return NextResponse.json({ success: false, message: 'Name and email are required' }, { status: 400 });
    }

    const adminUser = {
      id: `au-${Date.now()}`,
      name,
      email,
      role,
      invitedAt: new Date(),
      status: 'Active',
    };

    const db = await getMongoDbDatabase();
    if (db) {
      // Check if already exists → update, otherwise insert
      const existing = await db.collection('admin_users').findOne({ email });
      if (existing) {
        await db.collection('admin_users').updateOne(
          { email },
          { $set: { name, role, status: 'Active', updatedAt: new Date() } }
        );
      } else {
        await db.collection('admin_users').insertOne(adminUser);
      }
    }

    // Generate 1-click magic login token and send invite email
    const magicToken = generateAdminMagicToken({ email, name });
    const emailSent = await sendAdminInviteEmail(email, name, role, magicToken).catch((err) => {
      console.warn('[Email] Admin invite email error:', err);
      return false;
    });

    return NextResponse.json(
      { success: true, data: adminUser, emailSent, magicToken },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await hasAdminSession())) {
      return NextResponse.json({ success: false, message: 'Admin authentication required.' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    if (!email && !id) {
      return NextResponse.json({ success: false, message: 'Missing email or id' }, { status: 400 });
    }

    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });

    // Revoke: set status to Revoked (keep record for audit)
    const filter = email ? { email } : { id };
    await db.collection('admin_users').updateOne(filter, { $set: { status: 'Revoked', revokedAt: new Date() } });

    return NextResponse.json({ success: true, message: 'Admin access revoked' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
