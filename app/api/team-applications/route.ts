import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';

/**
 * Applications to join the QNexus team (not the general community —
 * see /api/join for that). Reviewed from /admin/team-applications.
 */

export async function GET() {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });
    const docs = await db.collection('team_applications').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: docs });
  } catch (error: any) {
    console.error('Error fetching team applications:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });

    const body = await request.json();
    if (!body.fullName?.trim() || !body.email?.trim() || !body.role?.trim()) {
      return NextResponse.json({ success: false, message: 'Name, email, and role are required.' }, { status: 400 });
    }

    const doc = {
      id: `ta-${Date.now()}`,
      fullName: String(body.fullName).trim(),
      email: String(body.email).trim(),
      phone: body.phone ? String(body.phone).trim() : '',
      role: String(body.role).trim(),
      portfolioUrl: body.portfolioUrl ? String(body.portfolioUrl).trim() : '',
      availability: body.availability ? String(body.availability).trim() : '',
      message: body.message ? String(body.message).trim() : '',
      status: 'Pending' as const,
      createdAt: new Date(),
    };

    await db.collection('team_applications').insertOne(doc);
    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving team application:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });

    const body = await request.json();
    const { id, status } = body;
    if (!id || !['Pending', 'Shortlisted', 'Rejected', 'Hired'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Missing or invalid id/status.' }, { status: 400 });
    }

    const result = await db.collection('team_applications').updateOne({ id }, { $set: { status } });
    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating team application:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'Missing id' }, { status: 400 });
    await db.collection('team_applications').deleteOne({ id });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting team application:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
