import crypto from 'crypto';
import { cookies } from 'next/headers';

const WRITER_COOKIE = 'qni_writer_session';
const ADMIN_COOKIE = 'qni_admin_session';
const ADMIN_MAGIC_COOKIE = 'qni_admin_magic_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const ADMIN_MAGIC_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

function getSecret() {
  return process.env.BLOG_SESSION_SECRET || process.env.ADMIN_ACCESS_TOKEN || 'qni-local-session-secret';
}

function sign(value: string) {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('base64url');
}

export function createBlogSession(writer: { id: string; email: string; name: string; role: string }) {
  const payload = Buffer.from(JSON.stringify({ ...writer, exp: Date.now() + SESSION_TTL_SECONDS * 1000 })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function generateWriterMagicToken(writer: { email: string; name: string; role?: string; id?: string }) {
  // Long-lived 1-click access token (90 days)
  const payload = Buffer.from(
    JSON.stringify({
      id: writer.id || `bw-${writer.email}`,
      email: writer.email.toLowerCase().trim(),
      name: writer.name,
      role: writer.role || 'Blog Writer & Content Contributor',
      type: 'magic_access',
      exp: Date.now() + 1000 * 60 * 60 * 24 * 90,
    })
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifyWriterMagicToken(token: string | undefined) {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || sign(payload) !== signature) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

export function generateAdminMagicToken(admin: { email: string; name: string }) {
  const payload = Buffer.from(
    JSON.stringify({
      email: admin.email.toLowerCase().trim(),
      name: admin.name,
      role: 'Admin',
      type: 'admin_magic_access',
      exp: Date.now() + ADMIN_MAGIC_TTL_MS,
    })
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminMagicToken(token: string | undefined) {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || sign(payload) !== signature) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (data.type !== 'admin_magic_access') return null;
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

export function verifyBlogSession(token: string | undefined) {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || sign(payload) !== signature) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

export async function getBlogSession() {
  const store = await cookies();
  return verifyBlogSession(store.get(WRITER_COOKIE)?.value);
}

export async function hasAdminSession() {
  const store = await cookies();
  // Check standard password-based admin session
  if (store.get(ADMIN_COOKIE)?.value === 'true') return true;
  // Also accept valid admin magic token session
  const magicToken = store.get(ADMIN_MAGIC_COOKIE)?.value;
  return !!verifyAdminMagicToken(magicToken);
}

export function setBlogSession(response: Response, token: string) {
  response.headers.append(
    'Set-Cookie',
    `${WRITER_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}; ${process.env.NODE_ENV === 'production' ? 'Secure; ' : ''}`
  );
}

export function clearBlogSession(response: Response) {
  response.headers.append('Set-Cookie', `${WRITER_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}
