import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getMongoDbDatabase } from '@/lib/mongodb';
import { saveServerSubmission, getServerSubmissions, updateServerSubmissionStatus } from '@/lib/server-storage';
import { sendEventRegistrationEmail, sendEventCertificateEmail, sendAdminNotification } from '@/lib/email';
import { isRegistrationOpen } from '@/lib/events-store';

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Looks for an earlier registration by the same email (any letter case) for the same event. */
async function findExistingRegistration(eventId: unknown, email: string): Promise<any | null> {
  const local = getServerSubmissions('registrations').find(
    (r: any) => r.eventId === eventId && typeof r.email === 'string' && r.email.trim().toLowerCase() === email
  );
  if (local) return local;
  try {
    const db = await getMongoDbDatabase();
    if (db) {
      return await db.collection('registrations').findOne({
        eventId,
        email: { $regex: `^\\s*${escapeRegex(email)}\\s*$`, $options: 'i' },
      });
    }
  } catch (dbErr) {
    console.warn('[MongoDB Registration] duplicate check warn:', dbErr);
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Re-check the registration cutoff server-side — the client-side check
    // guides the UI, but it can be bypassed by calling this endpoint directly.
    if (body.eventId) {
      try {
        const db = await getMongoDbDatabase();
        if (db) {
          const event = await db.collection('events').findOne({ id: body.eventId });
          if (event && !isRegistrationOpen(event as any)) {
            return NextResponse.json(
              { success: false, error: 'Registration is closed for this event' },
              { status: 403 }
            );
          }
        }
      } catch (dbErr) {
        console.warn('[MongoDB Registration] deadline check warn:', dbErr);
      }
    }

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const regRecord = {
      ...body,
      email,
      id: body.id || `r-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: body.status || 'Confirmed',
    };

    // 1. One registration per email per event. A repeat submit (double click,
    // retry, registering again) returns the existing pass and sends no emails.
    const existing = email ? await findExistingRegistration(regRecord.eventId, email) : null;
    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyRegistered: true,
        message: 'You are already registered for this event',
        id: existing.id || String(existing._id),
        data: { ...existing, _id: undefined },
      });
    }

    // 2. Save to MongoDB. The upsert is keyed on event + email so two requests
    // arriving together still produce a single record and a single email.
    let insertedId = null;
    let isNew = true;
    try {
      const db = await getMongoDbDatabase();
      if (db) {
        const result = await db
          .collection('registrations')
          .updateOne({ eventId: regRecord.eventId, email }, { $setOnInsert: regRecord }, { upsert: true });
        insertedId = result.upsertedId;
        isNew = result.upsertedCount === 1;
      }
    } catch (dbErr) {
      console.warn('[MongoDB Registration] DB write error:', dbErr);
    }

    if (!isNew) {
      const winner = await findExistingRegistration(regRecord.eventId, email);
      return NextResponse.json({
        success: true,
        alreadyRegistered: true,
        message: 'You are already registered for this event',
        id: winner?.id || regRecord.id,
        data: winner ? { ...winner, _id: undefined } : regRecord,
      });
    }

    // 3. Save to Server Storage
    saveServerSubmission('registrations', regRecord);

    // 4. Send confirmation email to the registrant
    if (regRecord.email && regRecord.name) {
      const formattedDate = regRecord.eventDate
        ? new Date(regRecord.eventDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
        : undefined;

      // Fetch the event's Zoom/meeting link to include in the confirmation email
      let eventMeetingLink: string | undefined;
      if (regRecord.eventId) {
        try {
          const db = await getMongoDbDatabase();
          if (db) {
            const eventDoc = await db.collection('events').findOne({ id: regRecord.eventId });
            if (eventDoc?.meetingLink) {
              eventMeetingLink = eventDoc.meetingLink;
            }
          }
        } catch (linkErr) {
          console.warn('[Register] Could not fetch event meeting link:', linkErr);
        }
      }

      await sendEventRegistrationEmail(
        regRecord.email,
        regRecord.name,
        regRecord.eventTitle || 'Quantum Event',
        { date: formattedDate, time: regRecord.time, location: regRecord.location },
        regRecord.token || regRecord.id,
        regRecord.eventId,
        eventMeetingLink
      ).catch((err) => {
        console.warn('[Email] Registration confirmation error:', err);
      });
    }

    // 5. Notify admin of the new registration
    if (regRecord.email && regRecord.name) {
      await sendAdminNotification({
        formType: 'Event Registration',
        name: regRecord.name,
        email: regRecord.email,
        phone: regRecord.phone,
        organization: regRecord.organization,
        subject: `New Event Registration — ${regRecord.eventTitle || 'Quantum Event'}`,
        message: `Registered for: ${regRecord.eventTitle || 'Quantum Event'}\nToken: ${regRecord.token || regRecord.id}`,
      }).catch((err) => {
        console.warn('[Email] Admin notification error:', err);
      });
    }

    return NextResponse.json(
      { success: true, message: 'Event registration saved', id: insertedId || regRecord.id, data: regRecord },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error saving registration:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const serverRegs = getServerSubmissions('registrations');

    let mongoRegs: any[] = [];
    try {
      const db = await getMongoDbDatabase();
      if (db) {
        mongoRegs = await db.collection('registrations').find({}).sort({ createdAt: -1 }).toArray();
      }
    } catch (dbErr) {
      console.warn('[MongoDB GET Registrations] DB read warning:', dbErr);
    }

    const combined: any[] = [...serverRegs];
    mongoRegs.forEach((mr) => {
      const formatted = {
        id: mr._id ? String(mr._id) : mr.id || `r-${Date.now()}`,
        eventId: mr.eventId || '1',
        eventTitle: mr.eventTitle || 'Quantum Session',
        name: mr.name || 'Attendee',
        email: mr.email || '',
        phone: mr.phone || '',
        organization: mr.organization || 'Independent',
        role: mr.role || 'Attendee',
        background: mr.background || 'Beginner',
        teamName: mr.teamName || undefined,
        createdAt: mr.createdAt ? new Date(mr.createdAt).toISOString() : new Date().toISOString(),
        status: mr.status || 'Confirmed',
      };
      if (!combined.some((c) => (c.email && c.email.toLowerCase() === formatted.email.toLowerCase() && c.eventId === formatted.eventId) || c.id === formatted.id)) {
        combined.push(formatted);
      }
    });

    return NextResponse.json({ success: true, data: combined });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id || !['Confirmed', 'Attended', 'Cancelled'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Valid id and status are required' }, { status: 400 });
    }

    let registration: any = null;
    const db = await getMongoDbDatabase();
    if (db) {
      const idFilters: any[] = [{ id }];
      if (ObjectId.isValid(id)) idFilters.push({ _id: new ObjectId(id) });
      registration = await db.collection('registrations').findOne({ $or: idFilters });
      if (registration) {
        await db.collection('registrations').updateOne(
          { _id: registration._id },
          { $set: { status, updatedAt: new Date().toISOString() } }
        );
      }
    }

    if (!registration) {
      registration = getServerSubmissions('registrations').find((item: any) => item.id === id || item._id === id);
    }
    updateServerSubmissionStatus('registrations', id, status);

    if (!registration) {
      return NextResponse.json({ success: false, message: 'Registration not found' }, { status: 404 });
    }

    const certificateToken = registration.token || registration.id;
    const wasAttended = registration.status === 'Attended';
    let certificateEmailSent = false;
    if (status === 'Attended' && !wasAttended && registration.email) {
      certificateEmailSent = await sendEventCertificateEmail(
        registration.email,
        registration.name || 'Attendee',
        registration.eventTitle || 'Quantum Event',
        registration.eventDate,
        certificateToken
      ).catch((error) => {
        console.warn('[Email] Certificate email error:', error);
        return false;
      });
    }

    return NextResponse.json({
      success: true,
      certificateEmailSent,
      certificateUrl: `/certificate/${encodeURIComponent(certificateToken)}`,
    });
  } catch (error: any) {
    console.error('Error updating registration:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
