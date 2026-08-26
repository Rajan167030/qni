// Shared Events Store — used by both admin dashboard and public events page

export interface EventItem {
  id: string;
  month: string;
  day: string;
  dayLabel: string;
  title: string;
  description: string;
  location: string;
  time: string;
  attendees: string;
  badge: string;
  category: string;
  fullDescription: string;
  speakers: string[];
  price: string;
  schedule: { time: string; title: string; speaker: string }[];
  createdAt: string;
  // Extended fields
  imageUrl?: string;
  eventDate?: string; // ISO date string — used to compute upcoming vs past
  status?: 'upcoming' | 'past';
}

const STORAGE_KEY = 'qni_events_v4';

// No seed/dummy events — only events created via the admin dashboard should ever appear.
const DEFAULT_EVENTS: EventItem[] = [];

function loadEvents(): EventItem[] {
  if (typeof window === 'undefined') return DEFAULT_EVENTS;
  try {
    // Clear old storage keys from previous builds (including the old hardcoded seed data)
    localStorage.removeItem('qni_events');
    localStorage.removeItem('qni_events_v2');
    localStorage.removeItem('qni_events_v3');

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_EVENTS;
    const parsed = JSON.parse(raw) as EventItem[];
    if (!Array.isArray(parsed)) return DEFAULT_EVENTS;
    return parsed;
  } catch {
    return DEFAULT_EVENTS;
  }
}

function persist(events: EventItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

/** Normalize a raw event document from the admin-managed API/database into an EventItem. */
function normalizeApiEvent(doc: any): EventItem {
  return {
    ...doc,
    id: doc.id || (doc._id ? String(doc._id) : Date.now().toString()),
    eventDate: doc.eventDate ? new Date(doc.eventDate).toISOString() : doc.eventDate,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
  };
}

/** Fetch events created via the admin dashboard (stored in MongoDB). Returns null on failure. */
async function fetchApiEvents(): Promise<EventItem[] | null> {
  try {
    const res = await fetch('/api/events', { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) return null;
    return json.data.map(normalizeApiEvent);
  } catch {
    return null;
  }
}

/**
 * Source of truth is the admin-managed database. Falls back to the local cache
 * (last known API result) only when the API is unreachable, e.g. offline.
 */
export async function getEvents(): Promise<EventItem[]> {
  const apiEvents = await fetchApiEvents();
  if (apiEvents) {
    persist(apiEvents);
    return apiEvents;
  }
  return loadEvents();
}

export function saveEvent(event: EventItem): void {
  const all = loadEvents();
  const idx = all.findIndex((e) => e.id === event.id);
  if (idx >= 0) {
    all[idx] = event;
  } else {
    all.push(event);
  }
  persist(all);
}

export function deleteEvent(id: string): void {
  const all = loadEvents().filter((e) => e.id !== id);
  persist(all);
}

/** Determine if event is upcoming or past based on eventDate field */
export function resolveEventStatus(event: EventItem): 'upcoming' | 'past' {
  if (event.status) return event.status;
  if (event.eventDate) {
    return new Date(event.eventDate) >= new Date() ? 'upcoming' : 'past';
  }
  return 'upcoming';
}

export function createBlankEvent(): EventItem {
  return {
    id: Date.now().toString(),
    month: '',
    day: '',
    dayLabel: '',
    title: '',
    description: '',
    location: '',
    time: '',
    attendees: '',
    badge: 'In person',
    category: 'Workshop',
    fullDescription: '',
    speakers: [''],
    price: 'Free',
    schedule: [{ time: '', title: '', speaker: '' }],
    imageUrl: '',
    eventDate: '',
    status: 'upcoming',
    createdAt: new Date().toISOString(),
  };
}
