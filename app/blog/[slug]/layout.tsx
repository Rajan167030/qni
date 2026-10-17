import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getMongoDbDatabase } from '@/lib/mongodb';
import { readLocalBlogs } from '@/lib/server-blogs-storage';
import { isSafeHttpUrl } from '@/lib/blog-content';
import type { BlogPost } from '@/lib/blogs-store';

async function findPost(slug: string): Promise<BlogPost | null> {
  try {
    const db = await getMongoDbDatabase();
    if (db) {
      const found = await db.collection('blogs').findOne({ $or: [{ slug }, { id: slug }] });
      if (found) return found as unknown as BlogPost;
    }
  } catch (error) {
    console.error('[blog metadata] Mongo lookup failed:', error);
  }
  return readLocalBlogs().find((b) => b.slug === slug || b.id === slug) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await findPost(slug);
  if (!post || post.status !== 'Published') {
    return { title: 'Article not found', robots: { index: false } };
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const authors = (post.authors?.length ? post.authors : [post.author]).map((a) => ({ name: a.name }));
  // Inline (data:) uploads cannot be used as social preview images.
  const images = isSafeHttpUrl(post.coverImage) ? [{ url: post.coverImage, alt: post.title }] : undefined;

  return {
    // An explicit SEO title is used verbatim; otherwise the site title template is appended.
    title: post.seoTitle ? { absolute: post.seoTitle } : post.title,
    description,
    authors,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: authors.map((a) => a.name),
      tags: post.tags,
      images,
    },
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      title,
      description,
      images: images?.map((i) => i.url),
    },
  };
}

export default function BlogArticleLayout({ children }: { children: ReactNode }) {
  return children;
}
