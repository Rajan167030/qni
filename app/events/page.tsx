import { getMongoDbDatabase } from '@/lib/mongodb';
import { getAttendeeCountMap, combineAttendeeCount } from '@/lib/attendee-counts';
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
    const events = docs.map((doc: any) => ({
      ...doc,
      id: doc.id || String(doc._id),
      eventDate: doc.eventDate ? new Date(doc.eventDate).toISOString() : doc.eventDate,
      createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
    })) as EventItem[];

    // Add live registrations on top of the admin-set seed number — never drops below it.
    const countMap = await getAttendeeCountMap(events.map((e) => e.id));
    events.forEach((e) => { e.attendees = String(combineAttendeeCount(e.attendees, countMap[e.id] || 0)); });

    return events;
  } catch {
    return [];
  }
}

export default async function EventsPage() {
  const events = await fetchEvents();
  return <EventsListClient initialEvents={events} />;
}
