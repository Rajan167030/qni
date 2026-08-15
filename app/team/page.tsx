import fs from 'fs/promises';
import path from 'path';
import type { Metadata } from 'next';
import TeamPageClient from './TeamPageClient';

export const metadata: Metadata = {
  title: 'Our Team — The People Behind QNexus',
  description:
    'Meet the students and quantum enthusiasts building QNexus (Quantum Nexus Global), a free, student-first quantum computing community.',
  alternates: { canonical: '/team' },
};

// Server component – reads public/team folder at request time
export default async function TeamPage() {
  const teamDir = path.join(process.cwd(), 'public', 'team');
  let imageFiles: string[] = [];

  try {
    const entries = await fs.readdir(teamDir, { withFileTypes: true });
    imageFiles = entries
      .filter((e) => e.isFile() && /\.(png|jpe?g|gif|webp)$/i.test(e.name))
      .map((e) => e.name);
  } catch (e) {
    console.warn('Failed to read team folder:', e);
  }

  return <TeamPageClient imageFiles={imageFiles} />;
}
