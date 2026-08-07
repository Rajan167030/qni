import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';

/**
 * Event schema (MongoDB document)
 * {
 *   title: string,
 *   description: string,
 *   dateTime: ISODate string,
 *   location: string,
 *   imageUrl?: string,
 *   registrationLink?: string,
 *   createdAt: Date,
 * }
 */

export async function GET() {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });
    const events = await db.collection('events').find({}).sort({ dateTime: 1 }).toArray();
    return NextResponse.json({ success: true, data: events });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });
    const body = await request.json();
    const { title, description, dateTime, location, imageUrl, registrationLink } = body;
    const event = {
      title,
      description,
      dateTime: new Date(dateTime),
      location,
      imageUrl: imageUrl || null,
      registrationLink: registrationLink || null,
      createdAt: new Date(),
    };
    const result = await db.collection('events').insertOne(event);
    return NextResponse.json({ success: true, insertedId: result.insertedId }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
