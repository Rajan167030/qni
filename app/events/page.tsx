import { getMongoDbDatabase } from '@/lib/mongodb';
import { EventItem } from '@/lib/events-store';
import EventsListClient from './EventsListClient';

// Cache the rendered page for 30s so repeat visits are served instantly
// instead of round-tripping to MongoDB on every request (ISR).
export const revalidate = 30;

async function fetchEvents(): Promise<EventItem[]> {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return [];
    const docs = await db.collection('events').find({}).sort({ eventDate: 1 }).toArray();
    return docs.map((doc: any) => ({
      ...doc,
      id: doc.id || String(doc._id),
      eventDate: doc.eventDate ? new Date(doc.eventDate).toISOString() : doc.eventDate,
      createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
    })) as EventItem[];
  } catch {
    return [];
  }
}

export default async function EventsPage() {
  const events = await fetchEvents();
  return <EventsListClient initialEvents={events} />;
}
