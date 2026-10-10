import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';
import { INITIAL_BLOG_POSTS } from '@/lib/blogs-store';
import { getBlogSession, hasAdminSession } from '@/lib/blog-auth';
import { recordWriterActivity, extractClientInfo } from '@/lib/writer-activity';
import { readLocalBlogs, saveLocalBlog, deleteLocalBlog } from '@/lib/server-blogs-storage';

async function canManageBlogs() {
  return Boolean((await getBlogSession()) || (await hasAdminSession()));
}

const LEGACY_SEEDED_BLOG_IDS = ['blog-1', 'blog-2', 'blog-3', 'blog-4'];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const db = await getMongoDbDatabase();
    const localBlogs = readLocalBlogs();

    if (!db) {
      // Return local stored data or fallback if Mongo is not connected
      if (slug) {
        const found = localBlogs.find((b) => b.slug === slug || b.id === slug) || INITIAL_BLOG_POSTS.find((b) => b.slug === slug || b.id === slug);
        return NextResponse.json({ success: true, data: found || null, source: 'fallback' });
      }
      const combinedFallback = [...localBlogs];
      INITIAL_BLOG_POSTS.forEach((ib) => {
        if (!combinedFallback.some((lb) => lb.id === ib.id || lb.slug === ib.slug)) {
          combinedFallback.push(ib);
        }
      });
      return NextResponse.json({ success: true, data: combinedFallback, source: 'fallback' });
    }

    const collection = db.collection('blogs');

    if (slug) {
      let blog = await collection.findOne({
        $or: [{ slug }, { id: slug }],
      });
      if (!blog) {
        blog = localBlogs.find((b) => b.slug === slug || b.id === slug) || INITIAL_BLOG_POSTS.find((b) => b.slug === slug || b.id === slug) || null;
      }
      return NextResponse.json({ success: true, data: blog });
    }

    const blogsFromDb = await collection
      .find({})
      .sort({ publishedAt: -1 })
      .toArray();

    // Merge mongo blogs with local file fallback blogs and initial blog posts
    const merged = [...blogsFromDb];
    localBlogs.forEach((lb) => {
      if (!merged.some((mb: any) => mb.id === lb.id || mb.slug === lb.slug)) {
        merged.push(lb as any);
      }
    });

    INITIAL_BLOG_POSTS.forEach((ib) => {
      if (!merged.some((mb: any) => mb.id === ib.id || mb.slug === ib.slug)) {
        merged.push(ib as any);
      }
    });

    return NextResponse.json({ success: true, data: merged });
  } catch (error: any) {
    console.error('Error in GET /api/blogs:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await canManageBlogs())) {
      return NextResponse.json({ success: false, message: 'Writer or admin authentication required.' }, { status: 401 });
    }
    const body = await request.json();
    const db = await getMongoDbDatabase();
    const session = await getBlogSession();
    const isAdmin = await hasAdminSession();
    const { ip, userAgent } = extractClientInfo(request);

    const isEdit = Boolean(body.id);
    const authorEmail = session?.email || body.author?.email || (isAdmin ? 'admin@quantumnexusglobal.org' : 'contributor@qng');
    const authorName = session?.name || body.author?.name || (isAdmin ? 'Administrator' : 'QNG Writer');
    const authorRole = session?.role || body.author?.role || 'Guest Contributor';

    const newBlog = {
      id: body.id || `blog-${Date.now()}`,
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category || 'Quantum Tech',
      coverImage: body.coverImage || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
      author: {
        name: authorName,
        role: authorRole,
        email: authorEmail,
      },
      readTime: body.readTime || '4 min read',
      publishedAt: body.publishedAt || new Date().toISOString(),
      status: body.status || 'Published',
      featured: body.featured ?? false,
      tags: body.tags || ['Quantum'],
      createdAt: new Date(),
    };

    saveLocalBlog(newBlog as any);

    if (db) {
      await db.collection('blogs').updateOne(
        { id: newBlog.id },
        { $set: newBlog },
        { upsert: true }
      );
    }

    // Record activity for writer activity tracker
    await recordWriterActivity({
      writerEmail: authorEmail,
      writerName: authorName,
      action: isEdit ? 'BLOG_UPDATE' : 'BLOG_CREATE',
      actionLabel: `${isEdit ? 'Updated' : 'Created & published'} blog: "${newBlog.title}"`,
      details: {
        blogId: newBlog.id,
        slug: newBlog.slug,
        title: newBlog.title,
        category: newBlog.category,
        status: newBlog.status,
        readTime: newBlog.readTime,
        tags: newBlog.tags,
      },
      ip,
      userAgent,
    });

    return NextResponse.json({ success: true, data: newBlog }, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/blogs:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await canManageBlogs())) {
      return NextResponse.json({ success: false, message: 'Writer or admin authentication required.' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing blog ID' }, { status: 400 });
    }

    const session = await getBlogSession();
    const isAdmin = await hasAdminSession();
    const { ip, userAgent } = extractClientInfo(request);
    const writerEmail = session?.email || (isAdmin ? 'admin@quantumnexusglobal.org' : 'unknown');
    const writerName = session?.name || (isAdmin ? 'Administrator' : 'Writer');

    deleteLocalBlog(id);

    const db = await getMongoDbDatabase();
    let blogTitle = id;
    if (db) {
      const existing = await db.collection('blogs').findOne({ $or: [{ id }, { slug: id }] });
      if (existing?.title) blogTitle = existing.title;
      await db.collection('blogs').deleteOne({ $or: [{ id }, { slug: id }] });
    }

    // Record activity for writer deletion
    await recordWriterActivity({
      writerEmail,
      writerName,
      action: 'BLOG_DELETE',
      actionLabel: `Deleted blog: "${blogTitle}"`,
      details: { blogId: id, blogTitle },
      ip,
      userAgent,
    });

    return NextResponse.json({ success: true, message: 'Blog deleted' });
  } catch (error: any) {
    console.error('Error in DELETE /api/blogs:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
