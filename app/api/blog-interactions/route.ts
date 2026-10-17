import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';
import { getServerSubmissions, readServerStore, saveServerSubmission, writeServerStore } from '@/lib/server-storage';
import { findCommunityMember, getMemberSession, normalizeEmail, type MemberRole } from '@/lib/member-auth';

type CommentKind = 'comment' | 'doubt';
/** `member` = submitted the Join QNG form; `registrant` = only registered for an event. */
type ViewerRole = MemberRole;

interface BlogComment {
  id: string;
  blogSlug: string;
  name: string;
  /** Stored for ownership checks; never sent to clients. Absent on older comments. */
  email?: string;
  content: string;
  createdAt: string;
  kind?: CommentKind;
  /** Set on replies; points at the top-level comment of the thread. */
  parentId?: string;
  role?: ViewerRole;
  /** On a doubt: the reply the asker marked as the answer. */
  acceptedReplyId?: string;
}

const MAX_COMMENT_LENGTH = 2000;

/**
 * The signed-in member (verified by email OTP), with their role re-checked
 * so someone who registered for an event and later joined QNG can reply.
 */
async function getViewer() {
  const session = await getMemberSession();
  if (!session) return null;
  const member = await findCommunityMember(session.email);
  return member ? { email: session.email, name: session.name || member.name, role: member.role } : null;
}

function toPublicComment(comment: any, viewerEmail: string) {
  return {
    id: comment.id || String(comment._id),
    name: comment.name,
    content: comment.content,
    createdAt: new Date(comment.createdAt).toISOString(),
    kind: (comment.kind as CommentKind) || 'comment',
    parentId: comment.parentId || null,
    role: (comment.role as ViewerRole) || null,
    acceptedReplyId: comment.acceptedReplyId || null,
    mine: Boolean(viewerEmail && normalizeEmail(comment.email) === viewerEmail),
  };
}

async function getComments(blogSlug: string): Promise<BlogComment[]> {
  const local = (getServerSubmissions('blog-comments') as BlogComment[]).filter((c) => c.blogSlug === blogSlug);
  try {
    const db = await getMongoDbDatabase();
    if (db) {
      const dbComments = (await db.collection('blog_comments').find({ blogSlug }).toArray()) as unknown as BlogComment[];
      return [...local, ...dbComments];
    }
  } catch {
    // Return the local backup when MongoDB is unavailable.
  }
  return local;
}

async function getLikeEmails(blogSlug: string): Promise<string[]> {
  const local = (getServerSubmissions('blog-likes') as { blogSlug: string; email: string }[])
    .filter((like) => like.blogSlug === blogSlug)
    .map((like) => normalizeEmail(like.email));
  try {
    const db = await getMongoDbDatabase();
    if (db) {
      const dbLikes = await db.collection('blog_likes').find({ blogSlug }).toArray();
      return [...local, ...dbLikes.map((like: any) => normalizeEmail(like.email))];
    }
  } catch {
    // Return the local backup when MongoDB is unavailable.
  }
  return local;
}

async function setAcceptedReply(blogSlug: string, doubtId: string, replyId: string | null) {
  const db = await getMongoDbDatabase();
  if (db) {
    const result = await db
      .collection('blog_comments')
      .updateOne({ blogSlug, id: doubtId }, replyId ? { $set: { acceptedReplyId: replyId } } : { $unset: { acceptedReplyId: '' } });
    if (result.matchedCount > 0) return;
  }
  const stored = readServerStore();
  stored['blog-comments'] = stored['blog-comments'].map((c: BlogComment) =>
    c.blogSlug === blogSlug && c.id === doubtId ? { ...c, acceptedReplyId: replyId || undefined } : c
  );
  writeServerStore(stored);
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const blogSlug = searchParams.get('slug')?.trim();
  if (!blogSlug) return NextResponse.json({ success: false, error: 'Blog slug is required' }, { status: 400 });

  const viewer = await getViewer();
  const email = viewer?.email ?? '';
  const [comments, likeEmails] = await Promise.all([getComments(blogSlug), getLikeEmails(blogSlug)]);
  return NextResponse.json({
    success: true,
    comments: comments
      .map((c) => toPublicComment(c, email))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    likes: likeEmails.length,
    liked: Boolean(email && likeEmails.includes(email)),
    viewerRole: viewer?.role ?? null,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const blogSlug = typeof body.blogSlug === 'string' ? body.blogSlug.trim() : '';
    const action = ['like', 'comment', 'reply', 'accept'].includes(body.action) ? body.action : '';
    if (!blogSlug || !action) {
      return NextResponse.json({ success: false, error: 'Invalid request.' }, { status: 400 });
    }

    const viewer = await getViewer();
    if (!viewer) {
      return NextResponse.json(
        { success: false, signInRequired: true, error: 'Please sign in with your email to continue.' },
        { status: 401 }
      );
    }
    const { email, name, role } = viewer;

    const db = await getMongoDbDatabase();
    if (action === 'like') {
      const localLikes = getServerSubmissions('blog-likes');
      const existingLocal = localLikes.find((like: any) => like.blogSlug === blogSlug && normalizeEmail(like.email) === email);
      let liked = Boolean(existingLocal);

      if (db) {
        const existing = await db.collection('blog_likes').findOne({ blogSlug, email });
        if (existing) {
          await db.collection('blog_likes').deleteOne({ _id: existing._id });
          liked = false;
        } else {
          await db.collection('blog_likes').insertOne({ id: `bl-${Date.now()}`, blogSlug, email, createdAt: new Date() });
          liked = true;
        }
      } else if (existingLocal) {
        const stored = readServerStore();
        stored['blog-likes'] = localLikes.filter((like: any) => !(like.blogSlug === blogSlug && normalizeEmail(like.email) === email));
        writeServerStore(stored);
        liked = false;
      } else {
        saveServerSubmission('blog-likes', { blogSlug, email, createdAt: new Date().toISOString() });
        liked = true;
      }

      const likeEmails = await getLikeEmails(blogSlug);
      return NextResponse.json({ success: true, liked, likes: likeEmails.length });
    }

    const comments = await getComments(blogSlug);

    if (action === 'accept') {
      const doubt = comments.find((c) => c.id === body.commentId && !c.parentId);
      if (!doubt || doubt.kind !== 'doubt') {
        return NextResponse.json({ success: false, error: 'Doubt not found.' }, { status: 404 });
      }
      if (normalizeEmail(doubt.email) !== email) {
        return NextResponse.json({ success: false, error: 'Only the person who asked can mark the answer.' }, { status: 403 });
      }
      const replyId = typeof body.replyId === 'string' && body.replyId ? body.replyId : null;
      if (replyId && !comments.some((c) => c.id === replyId && c.parentId === doubt.id)) {
        return NextResponse.json({ success: false, error: 'Reply not found in this thread.' }, { status: 404 });
      }
      // Clicking the current answer again un-marks it.
      const next = replyId && replyId !== doubt.acceptedReplyId ? replyId : null;
      await setAcceptedReply(blogSlug, doubt.id, next);
      return NextResponse.json({ success: true, acceptedReplyId: next });
    }

    const content = typeof body.content === 'string' ? body.content.trim().slice(0, MAX_COMMENT_LENGTH) : '';
    if (!name || !content) {
      return NextResponse.json({ success: false, error: 'Comment text is required' }, { status: 400 });
    }

    let parentId: string | undefined;
    if (action === 'reply') {
      if (role !== 'member') {
        return NextResponse.json(
          { success: false, error: 'Only QNG members can reply. Join QNG to answer doubts and join discussions.' },
          { status: 403 }
        );
      }
      const target = comments.find((c) => c.id === body.parentId);
      if (!target) return NextResponse.json({ success: false, error: 'The comment you replied to no longer exists.' }, { status: 404 });
      // Threads are one level deep: replying to a reply joins the same thread.
      parentId = target.parentId || target.id;
    }

    const comment: BlogComment = {
      id: `bc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      blogSlug,
      name,
      email,
      content,
      createdAt: new Date().toISOString(),
      kind: parentId ? 'comment' : body.kind === 'doubt' ? 'doubt' : 'comment',
      parentId,
      role,
    };
    if (db) {
      await db.collection('blog_comments').insertOne({ ...comment });
    } else {
      saveServerSubmission('blog-comments', comment);
    }

    return NextResponse.json({ success: true, comment: toPublicComment(comment, email) }, { status: 201 });
  } catch (error: any) {
    console.error('Error handling blog interaction:', error);
    return NextResponse.json({ success: false, error: 'Unable to save blog interaction' }, { status: 500 });
  }
}
