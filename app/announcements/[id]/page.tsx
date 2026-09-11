import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { getMongoDbDatabase } from '@/lib/mongodb';

const SITE_URL = 'https://www.quantumnexusglobal.org';

interface Announcement {
  id: string;
  title: string;
  message: string;
  imageUrl?: string;
  linkUrl?: string;
  createdAt: string;
}

async function getAnnouncementById(id: string): Promise<Announcement | null> {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return null;
    const doc = await db.collection('announcements').findOne({ id });
    if (!doc) return null;
    return {
      id: (doc as any).id,
      title: (doc as any).title,
      message: (doc as any).message,
      imageUrl: (doc as any).imageUrl || '',
      linkUrl: (doc as any).linkUrl || '',
      createdAt: (doc as any).createdAt ? new Date((doc as any).createdAt).toISOString() : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = await getAnnouncementById(id);
  if (!post) return { title: 'Post Not Found — Quantum Nexus Global' };

  const description = post.message.slice(0, 160);
  const pageUrl = `${SITE_URL}/announcements/${post.id}`;

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      url: pageUrl,
      type: 'article',
      images: post.imageUrl ? [{ url: post.imageUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: post.imageUrl ? [post.imageUrl] : undefined,
    },
  };
}

export default async function AnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getAnnouncementById(id);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-display mb-4">Post not found</h1>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl font-medium hover:bg-foreground/90 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-foreground/10 px-6 lg:px-12 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <Image src="/logo-mark.png" alt="QNexus" width={789} height={302} className="h-10 w-auto" />
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-12 lg:py-20">
        <p className="text-xs font-mono uppercase tracking-widest text-foreground/40 mb-4">
          {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <h1 className="text-3xl lg:text-5xl font-display font-bold tracking-tight mb-8">{post.title}</h1>

        {post.imageUrl && (
          <div className="rounded-2xl overflow-hidden border border-foreground/10 mb-8 bg-foreground/5 flex items-center justify-center">
            <img src={post.imageUrl} alt={post.title} className="w-full h-auto max-h-[60vh] object-contain" />
          </div>
        )}

        <p className="text-base lg:text-lg text-foreground/80 leading-relaxed whitespace-pre-line">{post.message}</p>

        {post.linkUrl && (
          <a
            href={post.linkUrl}
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-foreground text-background rounded-xl font-medium hover:bg-foreground/90 transition-all"
          >
            Learn More →
          </a>
        )}
      </article>
    </main>
  );
}
