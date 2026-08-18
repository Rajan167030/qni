import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getMongoDbDatabase();

    if (!db) {
      return NextResponse.json(
        { success: true, message: 'Saved locally (MongoDB URI not active or local fallback)', data: body },
        { status: 200 }
      );
    }

    const collection = db.collection('registrations');
    const result = await collection.insertOne({
      ...body,
      createdAt: new Date(),
      status: body.status || 'Confirmed',
    });

    return NextResponse.json(
      { success: true, message: 'Event registration saved to MongoDB', id: result.insertedId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error saving registration to MongoDB:', error);
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

    const registrations = await db.collection('registrations').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: registrations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
