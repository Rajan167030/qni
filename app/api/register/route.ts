import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!clientPromise) {
      return NextResponse.json(
        { success: true, message: 'Saved locally (MongoDB URI not configured yet)', data: body },
        { status: 200 }
      );
    }

    const client = await clientPromise;
    const db = client.db('qnexus');
    const collection = db.collection('registrations');

    const result = await collection.insertOne({
      ...body,
      createdAt: new Date(),
      status: 'Confirmed',
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
    if (!clientPromise) {
      return NextResponse.json({ success: false, message: 'MongoDB URI not set' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('qnexus');
    const registrations = await db.collection('registrations').find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ success: true, data: registrations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
