/**
 * Email-OTP sign-in for community members (people who joined QNG or
 * registered for an event). Used by blog likes, doubts and replies.
 *
 * Flow: request code → 6-digit code emailed (valid 10 min, 5 attempts)
 * → verify → signed, HttpOnly session cookie for 30 days.
 */

import crypto from 'crypto';
import { cookies } from 'next/headers';
import { getMongoDbDatabase } from './mongodb';
import { getServerSubmissions } from './server-storage';

export type MemberRole = 'member' | 'registrant';

export interface MemberSession {
  email: string;
  name: string;
  role: MemberRole;
  exp: number;
}

const MEMBER_COOKIE = 'qni_member_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
export const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
const OTP_MAX_SENDS_PER_HOUR = 5;

interface OtpRecord {
  email: string;
  codeHash: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
  /** Send timestamps within the last hour, for rate limiting. */
  sends: number[];
}

declare global {
  // eslint-disable-next-line no-var
  var _memberOtpStore: Map<string, OtpRecord> | undefined;
}

function getSecret() {
  const base = process.env.BLOG_SESSION_SECRET || process.env.ADMIN_ACCESS_TOKEN || 'qni-local-session-secret';
  return `${base}:member`;
}

function hmac(value: string) {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('base64url');
}

export function normalizeEmail(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

/** Looks the email up in Join QNG submissions first, then event registrations. */
export async function findCommunityMember(email: string): Promise<{ role: MemberRole; name: string } | null> {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return null;
  const matches = (record: any) => normalizeEmail(record.email) === normalizedEmail;
  const nameOf = (record: any) => String(record?.name || record?.fullName || '').trim() || normalizedEmail.split('@')[0];

  const localJoin = getServerSubmissions('joins').find(matches);
  if (localJoin) return { role: 'member', name: nameOf(localJoin) };
  let registration: any = getServerSubmissions('registrations').find(matches);

  try {
    const db = await getMongoDbDatabase();
    if (db) {
      const [join, dbRegistration] = await Promise.all([
        db.collection('joins').findOne({ email: normalizedEmail }, { projection: { name: 1, fullName: 1 } }),
        registration ? null : db.collection('registrations').findOne({ email: normalizedEmail }, { projection: { name: 1 } }),
      ]);
      if (join) return { role: 'member', name: nameOf(join) };
      registration = registration || dbRegistration;
    }
  } catch {
    // Fall through with whatever the local store said.
  }
  return registration ? { role: 'registrant', name: nameOf(registration) } : null;
}

// ── OTP storage: MongoDB when configured, in-memory otherwise (local dev) ──

async function loadOtp(email: string): Promise<OtpRecord | null> {
  const db = await getMongoDbDatabase();
  if (db) return (await db.collection('member_otps').findOne({ email }, { projection: { _id: 0 } })) as OtpRecord | null;
  return globalThis._memberOtpStore?.get(email) ?? null;
}

async function saveOtp(record: OtpRecord) {
  const db = await getMongoDbDatabase();
  if (db) {
    await db.collection('member_otps').updateOne({ email: record.email }, { $set: record }, { upsert: true });
    return;
  }
  globalThis._memberOtpStore ??= new Map();
  globalThis._memberOtpStore.set(record.email, record);
}

async function deleteOtp(email: string) {
  const db = await getMongoDbDatabase();
  if (db) await db.collection('member_otps').deleteOne({ email });
  globalThis._memberOtpStore?.delete(email);
}

function hashCode(email: string, code: string) {
  return hmac(`otp:${email}:${code}`);
}

export type IssueOtpResult = { ok: true; code: string } | { ok: false; error: string; retryAfterMs?: number };

export async function issueOtp(email: string): Promise<IssueOtpResult> {
  const now = Date.now();
  const existing = await loadOtp(email);
  const recentSends = (existing?.sends ?? []).filter((t) => now - t < 60 * 60 * 1000);

  if (existing && now - existing.lastSentAt < OTP_RESEND_COOLDOWN_MS) {
    return { ok: false, error: 'Please wait a minute before requesting another code.', retryAfterMs: OTP_RESEND_COOLDOWN_MS - (now - existing.lastSentAt) };
  }
  if (recentSends.length >= OTP_MAX_SENDS_PER_HOUR) {
    return { ok: false, error: 'Too many codes requested. Please try again in an hour.' };
  }

  const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
  await saveOtp({
    email,
    codeHash: hashCode(email, code),
    expiresAt: now + OTP_TTL_MS,
    attempts: 0,
    lastSentAt: now,
    sends: [...recentSends, now],
  });
  return { ok: true, code };
}

export async function verifyOtp(email: string, code: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const record = await loadOtp(email);
  if (!record || record.expiresAt < Date.now()) {
    return { ok: false, error: 'This code has expired. Request a new one.' };
  }
  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    return { ok: false, error: 'Too many wrong attempts. Request a new code.' };
  }

  const expected = Buffer.from(record.codeHash);
  const actual = Buffer.from(hashCode(email, code.trim()));
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
    await saveOtp({ ...record, attempts: record.attempts + 1 });
    const left = OTP_MAX_ATTEMPTS - record.attempts - 1;
    return { ok: false, error: left > 0 ? `Incorrect code. ${left} attempt${left === 1 ? '' : 's'} left.` : 'Too many wrong attempts. Request a new code.' };
  }

  await deleteOtp(email);
  return { ok: true };
}

// ── Session cookie ──

export function createMemberSession(member: Omit<MemberSession, 'exp'>) {
  const payload = Buffer.from(JSON.stringify({ ...member, exp: Date.now() + SESSION_TTL_SECONDS * 1000 })).toString('base64url');
  return `${payload}.${hmac(payload)}`;
}

function verifyMemberToken(token: string | undefined): MemberSession | null {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = Buffer.from(hmac(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as MemberSession;
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

export async function getMemberSession(): Promise<MemberSession | null> {
  const store = await cookies();
  return verifyMemberToken(store.get(MEMBER_COOKIE)?.value);
}

export function setMemberSession(response: Response, token: string) {
  response.headers.append(
    'Set-Cookie',
    `${MEMBER_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}; ${process.env.NODE_ENV === 'production' ? 'Secure; ' : ''}`
  );
}

export function clearMemberSession(response: Response) {
  response.headers.append('Set-Cookie', `${MEMBER_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}
