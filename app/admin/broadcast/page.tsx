"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Send, Users, Mail, CalendarCheck, MessageSquare, GraduationCap,
  Eye, Loader2, CheckCircle2, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEvents, EventItem } from "@/lib/events-store";

const AUDIENCES = [
  { key: "newsletter", label: "Newsletter Subscribers", icon: Mail, color: "emerald" },
  { key: "joins", label: "Join Applicants", icon: Users, color: "amber" },
  { key: "registrations", label: "Event Registrants", icon: CalendarCheck, color: "cyan" },
  { key: "contacts", label: "Contact Inquiries", icon: MessageSquare, color: "purple" },
  { key: "research", label: "Research Applicants", icon: GraduationCap, color: "sky" },
] as const;

type AudienceKey = (typeof AUDIENCES)[number]["key"];

interface PreviewResult {
  count: number;
  sample: string[];
}

interface SendResult {
  total: number;
  sent: number;
  failed: number;
  errors: string[];
}

export default function AdminBroadcastPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedAudiences, setSelectedAudiences] = useState<AudienceKey[]>([]);
  const [eventId, setEventId] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [isPreviewing, setIsPreviewing] = useState(false);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("qni_admin_authenticated");
      if (auth !== "true") {
        router.push("/admin");
      }
    }
  }, [router]);

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  const toggleAudience = (key: AudienceKey) => {
    setPreview(null);
    setResult(null);
    setSelectedAudiences((prev) =>
      prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]
    );
  };

  const runPreview = async () => {
    if (selectedAudiences.length === 0) return;
    setIsPreviewing(true);
    setErrorMsg("");
    setResult(null);
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audiences: selectedAudiences,
          eventId: selectedAudiences.includes("registrations") ? eventId || undefined : undefined,
          dryRun: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPreview({ count: data.count, sample: data.sample });
      } else {
        setErrorMsg(data.message || "Failed to preview recipients.");
      }
    } catch {
      setErrorMsg("Error connecting to the server.");
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleSend = async () => {
    if (!preview || preview.count === 0) return;
    const confirmed = confirm(
      `Send this email to ${preview.count} recipient${preview.count !== 1 ? "s" : ""}? This cannot be undone.`
    );
    if (!confirmed) return;

    setIsSending(true);
    setErrorMsg("");
    setResult(null);
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          message,
          audiences: selectedAudiences,
          eventId: selectedAudiences.includes("registrations") ? eventId || undefined : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult({ total: data.total, sent: data.sent, failed: data.failed, errors: data.errors || [] });
      } else {
        setErrorMsg(data.message || "Failed to send broadcast.");
      }
    } catch {
      setErrorMsg("Error connecting to the server.");
    } finally {
      setIsSending(false);
    }
  };

  const canSend = selectedAudiences.length > 0 && subject.trim() && message.trim() && preview && preview.count > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-foreground/10 px-6 lg:px-12 py-4">
        <div className="max-w-[900px] mx-auto flex items-center gap-4">
          <Link
            href="/admin"
            className="p-2 rounded-full border border-foreground/15 hover:bg-foreground/10 text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold flex items-center gap-2">
              Email Broadcast
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                Admin
              </span>
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Compose one email and send it to any combination of audiences at once
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-[900px] mx-auto px-6 lg:px-12 py-8 space-y-6">
        {/* Audience selection */}
        <div className="border border-foreground/15 bg-foreground/[0.03] rounded-3xl p-6 lg:p-8 space-y-5">
          <div>
            <h2 className="text-lg font-display font-bold mb-1">1. Choose Audience</h2>
            <p className="text-xs text-muted-foreground">Select one or more groups — duplicates across groups are sent to only once.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {AUDIENCES.map(({ key, label, icon: Icon }) => {
              const isSelected = selectedAudiences.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleAudience(key)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground/15 hover:border-foreground/30 text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              );
            })}
          </div>

          {selectedAudiences.includes("registrations") && (
            <div>
              <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">
                Limit to a specific event (optional)
              </label>
              <select
                value={eventId}
                onChange={(e) => { setEventId(e.target.value); setPreview(null); }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/50"
              >
                <option value="">All events (every registrant)</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Compose */}
        <div className="border border-foreground/15 bg-foreground/[0.03] rounded-3xl p-6 lg:p-8 space-y-5">
          <div>
            <h2 className="text-lg font-display font-bold mb-1">2. Compose</h2>
            <p className="text-xs text-muted-foreground">
              Use <code className="px-1 py-0.5 rounded bg-foreground/10 font-mono">{"{{name}}"}</code> anywhere to personalize with each recipient's name.
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">Subject *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => { setSubject(e.target.value); setResult(null); }}
              placeholder="e.g. New quantum session announced!"
              className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/25 bg-background text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground/60 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">Message *</label>
            <textarea
              rows={8}
              value={message}
              onChange={(e) => { setMessage(e.target.value); setResult(null); }}
              placeholder={`Hi {{name}},\n\nWe just added a new session you might like...`}
              className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/25 bg-background text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground/60 transition-colors resize-none"
            />
            <p className="text-[11px] text-muted-foreground mt-1.5">Separate paragraphs with a blank line — each will render as its own paragraph in the email.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Preview + Send */}
        <div className="border border-foreground/15 bg-foreground/[0.03] rounded-3xl p-6 lg:p-8 space-y-5">
          <div>
            <h2 className="text-lg font-display font-bold mb-1">3. Preview & Send</h2>
            <p className="text-xs text-muted-foreground">Always preview the recipient count before sending — this action can't be undone.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={runPreview}
              disabled={selectedAudiences.length === 0 || isPreviewing}
              className="rounded-xl gap-2"
            >
              {isPreviewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
              Preview Recipients
            </Button>

            <Button
              type="button"
              onClick={handleSend}
              disabled={!canSend || isSending}
              className="rounded-xl gap-2 bg-foreground text-background hover:bg-foreground/90"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {isSending ? "Sending..." : "Send Broadcast"}
            </Button>
          </div>

          {preview && !result && (
            <div className="p-4 rounded-xl border border-foreground/15 bg-foreground/[0.02] text-sm">
              <p className="font-semibold text-foreground mb-1.5">
                {preview.count} recipient{preview.count !== 1 ? "s" : ""} will receive this email.
              </p>
              {preview.sample.length > 0 && (
                <p className="text-xs text-muted-foreground font-mono">
                  e.g. {preview.sample.join(", ")}{preview.count > preview.sample.length ? ", …" : ""}
                </p>
              )}
              {preview.count === 0 && (
                <p className="text-xs text-muted-foreground">No matching recipients — try a different audience.</p>
              )}
            </div>
          )}

          {result && (
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-sm space-y-2">
              <p className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Sent {result.sent} of {result.total} emails.
              </p>
              {result.failed > 0 && (
                <div className="text-xs text-rose-600 dark:text-rose-400">
                  <p className="font-medium mb-1">{result.failed} failed:</p>
                  <ul className="space-y-0.5 font-mono">
                    {result.errors.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
