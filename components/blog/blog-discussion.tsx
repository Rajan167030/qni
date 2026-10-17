'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, CircleHelp, Heart, LogOut, MessageCircle, Reply, Send, ShieldCheck, Ticket } from 'lucide-react';
import { MemberSignIn, type SignedInMember } from './member-sign-in';

type ViewerRole = 'member' | 'registrant' | null;

interface DiscussionComment {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  kind: 'comment' | 'doubt';
  parentId: string | null;
  role: ViewerRole;
  acceptedReplyId: string | null;
  mine: boolean;
}

type Filter = 'all' | 'doubts' | 'open';

const MAX_LENGTH = 2000;

function RoleBadge({ role }: { role: ViewerRole }) {
  if (role === 'member') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono text-cyan-500">
        <ShieldCheck className="w-3 h-3" /> QNG Member
      </span>
    );
  }
  if (role === 'registrant') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-foreground/15 px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
        <Ticket className="w-3 h-3" /> Event attendee
      </span>
    );
  }
  return null;
}

function CommentMeta({ comment }: { comment: DiscussionComment }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-1.5">
      <span className="text-sm font-semibold">{comment.name}</span>
      <RoleBadge role={comment.role} />
      {comment.mine && <span className="text-[10px] font-mono text-muted-foreground">(you)</span>}
      <time className="text-xs text-muted-foreground" dateTime={comment.createdAt} title={new Date(comment.createdAt).toLocaleString()}>
        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
      </time>
    </div>
  );
}

export function BlogDiscussion({ slug }: { slug: string }) {
  const [identity, setIdentity] = useState<SignedInMember | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [viewerRole, setViewerRole] = useState<ViewerRole>(null);
  const [comments, setComments] = useState<DiscussionComment[]>([]);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const [kind, setKind] = useState<'comment' | 'doubt'>('doubt');
  const [text, setText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  // Comments, likes and the viewer's role ("mine" flags come from the session cookie).
  const loadInteractions = () =>
    fetch(`/api/blog-interactions?${new URLSearchParams({ slug }).toString()}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) return;
        setComments(data.comments || []);
        setLikes(data.likes || 0);
        setLiked(Boolean(data.liked));
        setViewerRole(data.viewerRole ?? null);
      })
      .catch(() => {});

  useEffect(() => {
    fetch('/api/member-auth')
      .then((response) => response.json())
      .then((data) => setIdentity(data.authenticated ? data.member : null))
      .catch(() => {})
      .finally(() => setSessionChecked(true));
    loadInteractions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleSignedIn = (member: SignedInMember) => {
    setIdentity(member);
    loadInteractions();
  };

  const handleSignOut = async () => {
    await fetch('/api/member-auth', { method: 'DELETE' }).catch(() => {});
    setIdentity(null);
    loadInteractions();
  };

  const post = async (payload: Record<string, unknown>) => {
    const response = await fetch('/api/blog-interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blogSlug: slug, ...payload }),
    });
    const data = await response.json();
    if (data.signInRequired) {
      setIdentity(null);
      setViewerRole(null);
    }
    if (!response.ok || !data.success) throw new Error(data.error || 'Something went wrong.');
    return data;
  };

  const run = async (action: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    setMessage('');
    try {
      await action();
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const handleLike = () =>
    run(async () => {
      const data = await post({ action: 'like' });
      setLiked(data.liked);
      setLikes(data.likes);
    });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    run(async () => {
      const data = await post({ action: 'comment', kind, content: text });
      setComments((current) => [data.comment, ...current]);
      setText('');
    });
  };

  const handleReply = (event: React.FormEvent, parentId: string) => {
    event.preventDefault();
    if (!replyText.trim()) return;
    run(async () => {
      const data = await post({ action: 'reply', parentId, content: replyText });
      setComments((current) => [data.comment, ...current]);
      setReplyText('');
      setReplyingTo(null);
    });
  };

  const handleAccept = (doubtId: string, replyId: string) =>
    run(async () => {
      const data = await post({ action: 'accept', commentId: doubtId, replyId });
      setComments((current) => current.map((c) => (c.id === doubtId ? { ...c, acceptedReplyId: data.acceptedReplyId } : c)));
    });

  const threads = useMemo(() => {
    const topLevel = comments.filter((c) => !c.parentId);
    const repliesByParent = new Map<string, DiscussionComment[]>();
    for (const c of comments) {
      if (!c.parentId) continue;
      repliesByParent.set(c.parentId, [...(repliesByParent.get(c.parentId) ?? []), c]);
    }
    return topLevel
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((comment) => {
        const replies = (repliesByParent.get(comment.id) ?? []).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        // The accepted answer is pinned to the top of its thread.
        const accepted = replies.find((r) => r.id === comment.acceptedReplyId);
        return { comment, replies: accepted ? [accepted, ...replies.filter((r) => r !== accepted)] : replies };
      });
  }, [comments]);

  const doubts = threads.filter((t) => t.comment.kind === 'doubt');
  const openDoubts = doubts.filter((t) => !t.comment.acceptedReplyId);
  const visible = filter === 'doubts' ? doubts : filter === 'open' ? openDoubts : threads;

  const canReply = viewerRole === 'member';

  return (
    <section className="px-6 lg:px-12 pb-20">
      <div className="max-w-3xl mx-auto border-y border-foreground/10 py-10">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <h2 className="text-2xl font-display">Discussion & Doubts</h2>
          </div>
          <button
            type="button"
            onClick={handleLike}
            disabled={!identity || busy}
            title={identity ? 'Like this article' : 'Sign in to like this article'}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${liked ? 'border-rose-500/40 bg-rose-500/10 text-rose-500' : 'border-foreground/15 hover:bg-foreground/5'} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            {likes}
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-8">
          Stuck on something in this article? Ask a doubt. QNG members can reply, and whoever asked can mark the reply that solved it.
        </p>

        {identity ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-8">
            <div className="flex gap-1 self-start rounded-full bg-foreground/5 p-1 text-xs" role="radiogroup" aria-label="Post type">
              {(['doubt', 'comment'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={kind === option}
                  onClick={() => setKind(option)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${kind === option ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {option === 'doubt' ? <CircleHelp className="w-3.5 h-3.5" /> : <MessageCircle className="w-3.5 h-3.5" />}
                  {option === 'doubt' ? 'Ask a doubt' : 'Comment'}
                </button>
              ))}
            </div>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={MAX_LENGTH}
              placeholder={kind === 'doubt' ? 'What would you like explained? Mention the section or equation if you can.' : 'Share your thoughts...'}
              className="min-h-28 w-full resize-y rounded-2xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-sm outline-none focus:border-foreground/40"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                Posting as <strong className="text-foreground">{identity.name}</strong> {viewerRole && <RoleBadge role={viewerRole} />}
                <button type="button" onClick={handleSignOut} className="inline-flex items-center gap-1 hover:text-foreground">
                  <LogOut className="w-3 h-3" /> Sign out
                </button>
              </span>
              <button
                type="submit"
                disabled={!text.trim() || busy}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> {kind === 'doubt' ? 'Post Doubt' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : sessionChecked ? (
          <MemberSignIn onSignedIn={handleSignedIn} />
        ) : null}

        {message && <p className="mb-5 text-sm text-rose-500">{message}</p>}

        {threads.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 text-xs">
            {([
              ['all', `All (${threads.length})`],
              ['doubts', `Doubts (${doubts.length})`],
              ['open', `Unsolved (${openDoubts.length})`],
            ] as [Filter, string][]).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-full border px-3 py-1.5 transition-colors ${filter === value ? 'border-foreground bg-foreground text-background' : 'border-foreground/15 text-muted-foreground hover:text-foreground'}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-4">
          {threads.length === 0 ? (
            <p className="text-sm text-muted-foreground">No doubts or comments yet. Be the first to ask.</p>
          ) : visible.length === 0 ? (
            <p className="text-sm text-muted-foreground">{filter === 'open' ? 'Every doubt here has been solved.' : 'Nothing here yet.'}</p>
          ) : (
            visible.map(({ comment, replies }) => {
              const isDoubt = comment.kind === 'doubt';
              const solved = Boolean(comment.acceptedReplyId);
              return (
                <article
                  key={comment.id}
                  id={`comment-${comment.id}`}
                  className={`rounded-2xl border p-4 ${isDoubt && !solved ? 'border-amber-500/25 bg-amber-500/[0.03]' : 'border-foreground/10 bg-foreground/[0.03]'}`}
                >
                  {isDoubt && (
                    <span
                      className={`mb-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${solved ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}
                    >
                      {solved ? <CheckCircle2 className="w-3 h-3" /> : <CircleHelp className="w-3 h-3" />}
                      {solved ? 'Doubt · Solved' : 'Doubt · Unsolved'}
                    </span>
                  )}
                  <CommentMeta comment={comment} />
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment.content}</p>

                  {replies.length > 0 && (
                    <div className="mt-4 space-y-3 border-l-2 border-foreground/10 pl-4">
                      {replies.map((reply) => {
                        const isAnswer = reply.id === comment.acceptedReplyId;
                        return (
                          <div
                            key={reply.id}
                            id={`comment-${reply.id}`}
                            className={`rounded-xl p-3 ${isAnswer ? 'border border-emerald-500/30 bg-emerald-500/[0.06]' : 'bg-foreground/[0.02]'}`}
                          >
                            {isAnswer && (
                              <span className="mb-1.5 inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-emerald-500">
                                <CheckCircle2 className="w-3 h-3" /> Marked as answer
                              </span>
                            )}
                            <CommentMeta comment={reply} />
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{reply.content}</p>
                            {isDoubt && comment.mine && !reply.mine && (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => handleAccept(comment.id, reply.id)}
                                className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-emerald-500 disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {isAnswer ? 'Unmark answer' : 'Mark as answer'}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-3">
                    {!identity ? null : canReply ? (
                      replyingTo === comment.id ? (
                        <form onSubmit={(event) => handleReply(event, comment.id)} className="flex flex-col gap-2">
                          <textarea
                            autoFocus
                            value={replyText}
                            onChange={(event) => setReplyText(event.target.value)}
                            maxLength={MAX_LENGTH}
                            placeholder={isDoubt ? `Help ${comment.name} with this doubt...` : `Reply to ${comment.name}...`}
                            className="min-h-20 w-full resize-y rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
                          />
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => { setReplyingTo(null); setReplyText(''); }} className="rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
                              Cancel
                            </button>
                            <button type="submit" disabled={!replyText.trim() || busy} className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background disabled:opacity-50">
                              <Send className="w-3.5 h-3.5" /> Reply
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          type="button"
                          onClick={() => { setReplyingTo(comment.id); setReplyText(''); }}
                          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <Reply className="w-3.5 h-3.5" /> {isDoubt && !solved ? 'Answer this doubt' : 'Reply'}
                        </button>
                      )
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        <Link href="/join" className="underline underline-offset-2 hover:text-foreground">Join QNG</Link> to reply
                        {replies.length > 0 ? ` · ${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}` : ''}
                      </span>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
