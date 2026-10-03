// Shared Blog Writers Store — people the admin has personally invited to
// write blogs via the Team Writer Portal (/team-portal), each with their
// own auto-generated password (separate from the Join-Us-approved members).

export interface BlogWriter {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  invitedAt: string;
  status: "Active" | "Revoked";
}

const STORAGE_KEY = "qni_blog_writers_v1";

// Unambiguous character set — no 0/O, 1/l/I confusion
const PASSWORD_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

export function generateSimplePassword(length = 8): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += PASSWORD_CHARS[Math.floor(Math.random() * PASSWORD_CHARS.length)];
  }
  return out;
}

export const DEFAULT_WRITERS: BlogWriter[] = [
  {
    id: "bw-vishruti-0129",
    name: "Vishruti",
    email: "vishruti0129@gmail.com",
    password: "Vishruti@QNG2026",
    role: "Blog Writer & Content Contributor",
    invitedAt: "2026-10-01T00:00:00.000Z",
    status: "Active",
  },
];

function loadWriters(): BlogWriter[] {
  if (typeof window === "undefined") return DEFAULT_WRITERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      persist(DEFAULT_WRITERS);
      return DEFAULT_WRITERS;
    }
    const parsed = JSON.parse(raw);
    const list: BlogWriter[] = Array.isArray(parsed) ? parsed : [];
    // Ensure default writer is present
    for (const def of DEFAULT_WRITERS) {
      if (!list.some((w) => w.email.toLowerCase() === def.email.toLowerCase())) {
        list.unshift(def);
      }
    }
    return list;
  } catch {
    return DEFAULT_WRITERS;
  }
}

function persist(writers: BlogWriter[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(writers));
}

export function getBlogWriters(): BlogWriter[] {
  return loadWriters();
}

export function saveBlogWriter(writer: BlogWriter): void {
  const all = loadWriters();
  const idx = all.findIndex((w) => w.id === writer.id);
  if (idx >= 0) {
    all[idx] = writer;
  } else {
    all.unshift(writer);
  }
  persist(all);
}

export function deleteBlogWriter(id: string): void {
  const all = loadWriters().filter((w) => w.id !== id);
  persist(all);
}
