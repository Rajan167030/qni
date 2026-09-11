"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Loader2, Linkedin, Twitter, Facebook, MessageCircle, Mail, X } from "lucide-react";
import {
  getLinkedInIntentUrl, getTwitterIntentUrl, getWhatsAppIntentUrl, getFacebookIntentUrl,
} from "@/lib/social-share";

export default function AdminSocialPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [siteUrl, setSiteUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("qni_admin_authenticated");
      if (auth !== "true") router.push("/admin");
      setSiteUrl(window.location.origin);
    }
  }, [router]);

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
      // ignore — image is optional
    } finally {
      setIsUploading(false);
    }
  };

  const hasContent = title.trim().length > 0 && message.trim().length > 0;

  // Stateless preview page — content lives entirely in the URL, nothing saved.
  // Title is metadata only (page heading / link preview title) — never
  // duplicated into the actual post text, so it doesn't show twice.
  const viewUrl = siteUrl
    ? `${siteUrl}/quick-post/view?${new URLSearchParams({ title, text: message, ...(imageUrl ? { image: imageUrl } : {}) }).toString()}`
    : "";

  const linkedInUrl = viewUrl ? getLinkedInIntentUrl(viewUrl) : "";
  const facebookUrl = viewUrl ? getFacebookIntentUrl(viewUrl) : "";
  // Only attach the preview link for X/WhatsApp when there's a photo to show —
  // otherwise it's just a stray dev URL tacked onto a plain text post.
  const twitterUrl = getTwitterIntentUrl(message, imageUrl ? viewUrl : undefined);
  const whatsappUrl = getWhatsAppIntentUrl(message, imageUrl ? viewUrl : undefined);
  const emailUrl = `/admin/broadcast?subject=${encodeURIComponent(title)}&message=${encodeURIComponent(message)}`;

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
              Nothing is saved — write once, share to every platform directly
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-[900px] mx-auto px-6 lg:px-12 py-8 space-y-6">
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
            {imageUrl ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-foreground/15 bg-foreground/5">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
                <button
                  onClick={() => setImageUrl("")}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-foreground/10 hover:bg-foreground/15 text-foreground text-xs font-mono transition-colors">
                {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{isUploading ? "Uploading..." : "Upload Image"}</span>
                <input type="file" accept="image/*" disabled={isUploading} onChange={handleFileUpload} className="hidden" />
              </label>
            )}
          </div>

          <div className="pt-2 border-t border-foreground/10">
            <p className="text-xs font-mono uppercase text-muted-foreground mb-3">Share to</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <a
                href={hasContent ? linkedInUrl : undefined} target="_blank" rel="noopener noreferrer" aria-disabled={!hasContent}
                className={`flex items-center justify-center gap-1.5 py-3 rounded-xl text-white text-xs font-semibold transition-colors ${hasContent ? "bg-[#0A66C2] hover:bg-[#004182]" : "bg-[#0A66C2]/30 pointer-events-none"}`}
              >
                <Linkedin className="w-3.5 h-3.5" /> LinkedIn
              </a>
              <a
                href={hasContent ? twitterUrl : undefined} target="_blank" rel="noopener noreferrer" aria-disabled={!hasContent}
                className={`flex items-center justify-center gap-1.5 py-3 rounded-xl text-white text-xs font-semibold transition-colors ${hasContent ? "bg-black hover:bg-black/80" : "bg-black/30 pointer-events-none"}`}
              >
                <Twitter className="w-3.5 h-3.5" /> X
              </a>
              <a
                href={hasContent ? whatsappUrl : undefined} target="_blank" rel="noopener noreferrer" aria-disabled={!hasContent}
                className={`flex items-center justify-center gap-1.5 py-3 rounded-xl text-white text-xs font-semibold transition-colors ${hasContent ? "bg-[#25D366] hover:bg-[#1DA851]" : "bg-[#25D366]/30 pointer-events-none"}`}
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </a>
              <a
                href={hasContent ? facebookUrl : undefined} target="_blank" rel="noopener noreferrer" aria-disabled={!hasContent}
                className={`flex items-center justify-center gap-1.5 py-3 rounded-xl text-white text-xs font-semibold transition-colors ${hasContent ? "bg-[#1877F2] hover:bg-[#0d5cbf]" : "bg-[#1877F2]/30 pointer-events-none"}`}
              >
                <Facebook className="w-3.5 h-3.5" /> Facebook
              </a>
              {hasContent ? (
                <Link
                  href={emailUrl}
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" /> Email
                </Link>
              ) : (
                <span className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-foreground/30 text-background text-xs font-semibold pointer-events-none">
                  <Mail className="w-3.5 h-3.5" /> Email
                </span>
              )}
            </div>
            {imageUrl && (
              <p className="text-[11px] text-muted-foreground mt-3">
                LinkedIn/Facebook will show your photo as a preview card. X/WhatsApp send text only.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
