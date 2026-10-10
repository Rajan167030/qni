/**
 * Writer Activity Tracking Service
 * Logs and monitors all actions performed by blog writers (especially vishruti0129@gmail.com).
 * Persists to MongoDB 'writer_activities' collection with in-memory fallback.
 */

import { getMongoDbDatabase } from '@/lib/mongodb';
import { sendBlogWriterInviteEmail } from '@/lib/email';
import type { Db } from 'mongodb';

export interface WriterActivity {
  id: string;
  writerEmail: string;
  writerName: string;
  action: 'LOGIN' | 'LOGOUT' | 'BLOG_CREATE' | 'BLOG_UPDATE' | 'BLOG_DELETE' | 'IMAGE_UPLOAD' | 'ACCESS_GRANTED';
  actionLabel: string;
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  timestamp: string; // ISO String
}

// In-memory fallback for local dev or when MongoDB is temporarily unreachable
const fallbackActivities: WriterActivity[] = [];

// Default credentials for vishruti0129@gmail.com
export const VISHRUTI_WRITER_CONFIG = {
  id: 'bw-vishruti-0129',
  name: 'Vishruti',
  email: 'vishruti0129@gmail.com',
  password: 'Vishruti@QNG2026',
  role: 'Blog Writer & Content Contributor',
  status: 'Active' as const,
};

export const DEFAULT_WRITER_CONFIGS = [
  VISHRUTI_WRITER_CONFIG,
  {
    name: 'Ankit Verma',
    email: 'ankitverma@gmail.com',
    password: 'Ankit@QNG2026',
    role: 'Quantum AI Engineer & Content Contributor',
    status: 'Active' as const,
  },
  {
    name: 'Ankit Verma',
    email: 'ankit@qnexusindia.com',
    password: 'Ankit@QNG2026',
    role: 'Quantum AI Engineer & Content Contributor',
    status: 'Active' as const,
  },
];

/**
 * Ensure default writers (Vishruti, Ankit) are present and Active in MongoDB blog_writers collection
 */
export async function ensureDefaultBlogWriters(db?: Db | null): Promise<void> {
  try {
    const database = db || (await getMongoDbDatabase());
    if (!database) return;

    const writersColl = database.collection('blog_writers');
    
    for (const writerCfg of DEFAULT_WRITER_CONFIGS) {
      const existing = await writersColl.findOne({ email: writerCfg.email });
      if (!existing) {
        await writersColl.insertOne({
          ...writerCfg,
          invitedAt: new Date(),
          status: 'Active',
          notes: 'Pre-authorized blog writer access with continuous activity tracking',
          createdAt: new Date(),
        });

        // Record first setup activity
        await recordWriterActivity({
          writerEmail: writerCfg.email,
          writerName: writerCfg.name,
          action: 'ACCESS_GRANTED',
          actionLabel: `Granted Blog Writer access to ${writerCfg.email} with live activity tracking`,
          details: {
            role: writerCfg.role,
            status: 'Active',
          },
        });
        try {
          await sendBlogWriterInviteEmail(
            writerCfg.email,
            writerCfg.name,
            writerCfg.password
          );
        } catch (mailErr) {
          console.warn('[Writer Activity] Auto-invite email notice:', mailErr);
        }
      } else if (existing && existing.status !== 'Active') {
        // Ensure access is active
        await writersColl.updateOne(
          { email: writerCfg.email },
          { $set: { status: 'Active', updatedAt: new Date() } }
        );
      }
    }
  } catch (error) {
    console.error('[Writer Activity] Error ensuring default writers:', error);
  }
}

/**
 * Record a writer's activity into MongoDB and fallback store
 */
export async function recordWriterActivity(params: {
  writerEmail: string;
  writerName?: string;
  action: WriterActivity['action'];
  actionLabel: string;
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
}): Promise<WriterActivity> {
  const timestamp = new Date().toISOString();
  const id = `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const activity: WriterActivity = {
    id,
    writerEmail: (params.writerEmail || 'unknown@writer').toLowerCase().trim(),
    writerName: params.writerName || params.writerEmail.split('@')[0],
    action: params.action,
    actionLabel: params.actionLabel,
    details: params.details || {},
    ip: params.ip || 'Unknown IP',
    userAgent: params.userAgent || 'Unknown Device',
    timestamp,
  };

  // Keep latest in fallback
  fallbackActivities.unshift(activity);
  if (fallbackActivities.length > 200) {
    fallbackActivities.pop();
  }

  try {
    const db = await getMongoDbDatabase();
    if (db) {
      await db.collection('writer_activities').insertOne({
        ...activity,
        timestamp: new Date(timestamp),
        createdAt: new Date(),
      });
    }
  } catch (err) {
    console.warn('[Writer Activity] Failed to write to MongoDB, saved in memory fallback:', err);
  }

  return activity;
}

/**
 * Retrieve writer activities with optional filters
 */
export async function getWriterActivities(filter?: {
  email?: string;
  action?: string;
  limit?: number;
}): Promise<WriterActivity[]> {
  const limit = filter?.limit || 100;
  const emailFilter = filter?.email ? filter.email.toLowerCase().trim() : undefined;

  try {
    const db = await getMongoDbDatabase();
    if (db) {
      // Ensure pre-authorized writer is in place
      await ensureDefaultBlogWriters(db);

      const query: Record<string, any> = {};
      if (emailFilter) {
        query.writerEmail = emailFilter;
      }
      if (filter?.action && filter.action !== 'ALL') {
        query.action = filter.action;
      }

      const raw = await db
        .collection('writer_activities')
        .find(query)
        .sort({ timestamp: -1, createdAt: -1 })
        .limit(limit)
        .toArray();

      if (raw && raw.length > 0) {
        return raw.map((doc: any) => ({
          id: doc.id || String(doc._id),
          writerEmail: doc.writerEmail,
          writerName: doc.writerName || doc.writerEmail.split('@')[0],
          action: doc.action,
          actionLabel: doc.actionLabel,
          details: doc.details || {},
          ip: doc.ip || 'Unknown IP',
          userAgent: doc.userAgent || 'Unknown Device',
          timestamp: doc.timestamp instanceof Date ? doc.timestamp.toISOString() : (doc.timestamp || new Date().toISOString()),
        }));
      }
    }
  } catch (error) {
    console.warn('[Writer Activity] Error fetching from MongoDB, falling back to memory:', error);
  }

  // Fallback to in-memory activities
  let filtered = [...fallbackActivities];
  if (emailFilter) {
    filtered = filtered.filter((a) => a.writerEmail.toLowerCase() === emailFilter);
  }
  if (filter?.action && filter.action !== 'ALL') {
    filtered = filtered.filter((a) => a.action === filter.action);
  }
  return filtered.slice(0, limit);
}

/**
 * Extract IP and UserAgent from Next.js Request
 */
export function extractClientInfo(request: Request): { ip: string; userAgent: string } {
  const headers = request.headers;
  const forwarded = headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : headers.get('x-real-ip') || 'Localhost/Direct';
  const userAgent = headers.get('user-agent') || 'Unknown Browser';
  return { ip, userAgent };
}
