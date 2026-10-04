import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';
import { sendManualEventReminderEmail } from '@/lib/email';

// Allow longer execution for large registrant lists
export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, dryRun } = body as { eventId?: string; dryRun?: boolean };

    const db = await getMongoDbDatabase();
    if (!db) {
      return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });
    }

    // 1. Find upcoming events (eventDate > now), optionally filtered by eventId
    const now = new Date();
    const eventFilter: Record<string, any> = { eventDate: { $gt: now } };
    if (eventId) eventFilter.id = eventId;

    const upcomingEvents = await db.collection('events').find(eventFilter).toArray();

    if (upcomingEvents.length === 0) {
      return NextResponse.json({ success: false, message: 'No upcoming events found.' }, { status: 404 });
    }

    // 2. For each upcoming event, collect registrants
    interface ReminderJob {
      event: any;
      registrants: any[];
    }

    const jobs: ReminderJob[] = [];
    for (const event of upcomingEvents) {
      const registrants = await db
        .collection('registrations')
        .find({
          eventId: event.id,
          status: { $ne: 'Cancelled' },
          email: { $exists: true, $ne: '' },
        })
        .toArray();
      if (registrants.length > 0) {
        jobs.push({ event, registrants });
      }
    }

    const totalRegistrants = jobs.reduce((sum, j) => sum + j.registrants.length, 0);

    // 3. Dry-run: just return counts
    if (dryRun) {
      return NextResponse.json({
        success: true,
        eventsCount: jobs.length,
        totalRegistrants,
        events: jobs.map((j) => ({
          id: j.event.id,
          title: j.event.title,
          date: j.event.eventDate,
          registrantsCount: j.registrants.length,
          sample: j.registrants.slice(0, 5).map((r: any) => r.email),
        })),
      });
    }

    // 4. Send reminders
    let totalSent = 0;
    let totalFailed = 0;
    const errors: string[] = [];
    const eventResults: { eventId: string; title: string; sent: number; failed: number }[] = [];

    for (const { event, registrants } of jobs) {
      let sent = 0;
      let failed = 0;

      // Format event date nicely
      let formattedDate: string | undefined;
      if (event.eventDate) {
        try {
          formattedDate = new Date(event.eventDate).toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
        } catch {
          formattedDate = String(event.eventDate);
        }
      }

      for (const reg of registrants) {
        try {
          const ok = await sendManualEventReminderEmail(
            reg.email,
            reg.name || 'there',
            event.title || 'Quantum Event',
            formattedDate,
            event.time,
            event.location,
            event.id,
            event.imageUrl || undefined,
            event.meetingLink || undefined
          );
          if (ok) sent++;
          else {
            failed++;
            errors.push(`${reg.email}: send failed (provider/config error)`);
          }
        } catch (err: any) {
          failed++;
          errors.push(`${reg.email}: ${err.message || 'unknown error'}`);
        }
        // Gentle delay between sends to respect SMTP rate limits
        await new Promise((resolve) => setTimeout(resolve, 150));
      }

      totalSent += sent;
      totalFailed += failed;
      eventResults.push({ eventId: event.id, title: event.title, sent, failed });
    }

    return NextResponse.json({
      success: true,
      eventsCount: jobs.length,
      totalRegistrants,
      totalSent,
      totalFailed,
      events: eventResults,
      errors: errors.slice(0, 30),
    });
  } catch (error: any) {
    console.error('[Event Reminder] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
