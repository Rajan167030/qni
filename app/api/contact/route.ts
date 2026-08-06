import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';
import { sendContactNotification } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, phone, organization } = body;

    // 1. Save to MongoDB (if configured)
    const db = await getMongoDbDatabase();
    let savedId = null;

    if (db) {
      const collection = db.collection('contacts');
      const result = await collection.insertOne({
        ...body,
        createdAt: new Date(),
        status: 'New',
      });
      savedId = result.insertedId;
    }

    // 2. Send notification email to admin (with reply-to set to the person's email)
    if (name && email && message) {
      await sendContactNotification({ name, email, subject, message, phone, organization });
    }

    return NextResponse.json(
      {
        success: true,
        message: db
          ? 'Inquiry saved. Our team has been notified!'
          : 'Inquiry received. Our team has been notified! (Database not configured)',
        id: savedId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error processing contact inquiry:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await getMongoDbDatabase();
    if (!db) {
      return NextResponse.json({ success: false, message: 'MongoDB connection not active' }, { status: 400 });
    }

    const contacts = await db.collection('contacts').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: contacts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
