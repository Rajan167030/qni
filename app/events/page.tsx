import { getMongoDbDatabase } from '@/lib/mongodb';
import { getAttendeeCountMap, combineAttendeeCount } from '@/lib/attendee-counts';
import { EventItem } from '@/lib/events-store';
import EventsListClient from './EventsListClient';

// Event data does not need second-level freshness. A ten-minute window keeps
// the public page fast without repeatedly regenerating the page under traffic.
export const revalidate = 600;

async function fetchEvents(): Promise<EventItem[]> {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return [];
    const now = new Date();
    const docs = await db.collection('events').aggregate([
      {
        $addFields: {
          _isPast: {
            $cond: [
              { $and: [{ $ifNull: ['$eventDate', false] }, { $lte: [{ $toDate: '$eventDate' }, now] }] },
              1,
              0,
            ],
          },
          _dateVal: { $ifNull: [{ $toDate: '$eventDate' }, new Date(0)] },
        },
      },
      {
        $sort: {
          _isPast: 1,        // upcoming (0) before past (1)
          _dateVal: 1,       // upcoming: soonest first; past: most recent first (overridden below)
        },
      },
    ]).toArray();

    // For past events specifically, reverse their order so most-recent-past comes first
    const upcoming = docs.filter((d: any) => d._isPast === 0);
    const past     = docs.filter((d: any) => d._isPast === 1).reverse();
    const sorted   = [...upcoming, ...past];

    const events = sorted.map((doc: any) => ({
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
