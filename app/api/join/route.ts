import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email } = body;

    // 1. Save to MongoDB (if configured)
    const db = await getMongoDbDatabase();
    let savedId = null;

    if (db) {
      const collection = db.collection('joins');
      const result = await collection.insertOne({
        ...body,
        createdAt: new Date(),
        status: 'Pending',
      });
      savedId = result.insertedId;
    }

    // 2. Send welcome email to the applicant
    if (email && name) {
      await sendWelcomeEmail(email, name);
    }

    return NextResponse.json(
      {
        success: true,
        message: db
          ? 'Application saved to database. Welcome email sent!'
          : 'Application received. Welcome email sent! (Database not configured)',
        id: savedId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error processing join application:', error);
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

    const joins = await db.collection('joins').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: joins });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
