"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Upload, Loader2, Send, Linkedin, Twitter, Facebook, MessageCircle,
  Mail, Copy, Check, Trash2, ExternalLink, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getLinkedInIntentUrl, getTwitterIntentUrl, getWhatsAppIntentUrl, getFacebookIntentUrl,
} from "@/lib/social-share";

interface AnnouncementPost {
  id: string;
  title: string;
  message: string;
  imageUrl?: string;
  createdAt: string;
}

export default function AdminSocialPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState<AnnouncementPost | null>(null);
  const [posts, setPosts] = useState<AnnouncementPost[]>([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const [siteUrl, setSiteUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("qni_admin_authenticated");
      if (auth !== "true") router.push("/admin");
      setSiteUrl(window.location.origin);
    }
  }, [router]);

  const loadPosts = async () => {
    try {
      const res = await fetch("/api/announcements");
      const data = await res.json();
      if (data.success) setPosts(data.data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) setImageUrl(data.url);
    } catch {
      // ignore
    } finally {
      setIsUploading(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !message.trim()) return;
    setIsPublishing(true);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message, imageUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setPublished(data.data);
        setTitle("");
        setMessage("");
        setImageUrl("");
        loadPosts();
      }
    } catch {
      // ignore
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/announcements?id=${id}`, { method: "DELETE" });
    if (published?.id === id) setPublished(null);
    loadPosts();
  };

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const shareButtons = (post: AnnouncementPost) => {
    const postUrl = `${siteUrl}/announcements/${post.id}`;
    return (
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <a href={getLinkedInIntentUrl(postUrl)} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#0A66C2] text-white text-xs font-semibold hover:bg-[#004182] transition-colors">
          <Linkedin className="w-3.5 h-3.5" /> LinkedIn
        </a>
        <a href={getTwitterIntentUrl(post.title, postUrl)} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-black/80 transition-colors">
          <Twitter className="w-3.5 h-3.5" /> X
        </a>
        <a href={getWhatsAppIntentUrl(post.title, postUrl)} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-semibold hover:bg-[#1DA851] transition-colors">
          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
        </a>
        <a href={getFacebookIntentUrl(postUrl)} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#1877F2] text-white text-xs font-semibold hover:bg-[#0d5cbf] transition-colors">
          <Facebook className="w-3.5 h-3.5" /> Facebook
        </a>
        <Link href={`/admin/broadcast?subject=${encodeURIComponent(post.title)}&message=${encodeURIComponent(`${post.message}\n\n${postUrl}`)}`}
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors">
          <Mail className="w-3.5 h-3.5" /> Email
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-foreground/10 px-6 lg:px-12 py-4">
        <div className="max-w-[900px] mx-auto flex items-center gap-4">
          <Link href="/admin" className="p-2 rounded-full border border-foreground/15 hover:bg-foreground/10 text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold flex items-center gap-2">
              Social Post Composer
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                Admin
              </span>
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Compose once, then one click sends it to each platform
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-[900px] mx-auto px-6 lg:px-12 py-8 space-y-6">
        {/* Compose */}
        <div className="border border-foreground/15 bg-foreground/[0.03] rounded-3xl p-6 lg:p-8 space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">Title *</label>
            <input
              type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. New quantum session announced!"
              className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/25 bg-background text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground/60 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">Message *</label>
            <textarea
              rows={6} value={message} onChange={(e) => setMessage(e.target.value)}
              placeholder="What do you want to share?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/25 bg-background text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground/60 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">Image (optional)</label>
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-foreground/10 hover:bg-foreground/15 text-foreground text-xs font-mono transition-colors">
              {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{isUploading ? "Uploading..." : "Upload Image"}</span>
              <input type="file" accept="image/*" disabled={isUploading} onChange={handleFileUpload} className="hidden" />
            </label>
            {imageUrl && (
              <div className="relative mt-3 w-full h-32 rounded-xl overflow-hidden border border-foreground/15 bg-foreground/5">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
              </div>
            )}
          </div>

          <Button
            type="button" disabled={!title.trim() || !message.trim() || isPublishing}
            onClick={handlePublish}
            className="w-full h-11 rounded-xl bg-foreground text-background font-semibold text-sm flex items-center justify-center gap-2 hover:bg-foreground/90 transition-all shadow-md"
          >
            {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {isPublishing ? "Publishing..." : "Publish & Get Share Links"}
          </Button>
        </div>

        {/* Just-published share panel */}
        {published && siteUrl && (
          <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-3xl p-6 lg:p-8 space-y-4">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Published! Share it now:
            </p>
            <div className="flex items-center gap-2">
              <input
                readOnly value={`${siteUrl}/announcements/${published.id}`}
                className="flex-1 px-3.5 py-2 rounded-xl border border-foreground/15 bg-background text-xs font-mono text-foreground"
              />
              <Button size="sm" variant="outline" onClick={() => copyLink(`${siteUrl}/announcements/${published.id}`)} className="rounded-full text-xs gap-1.5 shrink-0">
                {linkCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>
            {shareButtons(published)}
          </div>
        )}

        {/* Past posts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Past Posts</h2>
            <Button size="sm" variant="outline" onClick={loadPosts} className="rounded-full text-xs gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </Button>
          </div>

          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground font-mono text-center py-8">No posts yet.</p>
          ) : (
            <div className="grid gap-4">
              {posts.map((post) => (
                <div key={post.id} className="p-5 rounded-2xl border border-foreground/15 bg-background space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display font-bold text-foreground">{post.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{post.message}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {siteUrl && (
                        <a href={`${siteUrl}/announcements/${post.id}`} target="_blank" rel="noopener noreferrer"
                          className="p-2 rounded-full hover:bg-foreground/10 text-foreground/50 hover:text-foreground transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button onClick={() => handleDelete(post.id)} className="p-2 rounded-full hover:bg-rose-500/10 text-rose-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {siteUrl && shareButtons(post)}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
