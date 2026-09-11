import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';

/**
 * Announcement posts — composed once in the admin dashboard, then shared
 * out to LinkedIn/Twitter/WhatsApp/Facebook via each platform's share-intent
 * link. Each post gets a public page (/announcements/[id]) with Open Graph
 * tags so those share links show a proper title/description/image preview.
 */

export async function GET() {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });
    const docs = await db.collection('announcements').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: docs });
  } catch (error: any) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });

    const body = await request.json();
    if (!body.title || !String(body.title).trim() || !body.message || !String(body.message).trim()) {
      return NextResponse.json({ success: false, message: 'Title and message are required.' }, { status: 400 });
    }

    const doc = {
      id: `post-${Date.now()}`,
      title: String(body.title).trim(),
      message: String(body.message).trim(),
      imageUrl: body.imageUrl ? String(body.imageUrl).trim() : '',
      linkUrl: body.linkUrl ? String(body.linkUrl).trim() : '',
      createdAt: new Date(),
    };

    await db.collection('announcements').insertOne(doc);
    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating announcement:', error);
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
    await db.collection('announcements').deleteOne({ id });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
