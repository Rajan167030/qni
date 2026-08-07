"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Plus,
  MapPin,
  Tag,
  Clock,
  User,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventItem {
  id: string;
  title: string;
  category: string;
  dateTime: string;
  location: string;
  price: string;
  speakers: string;
  description: string;
  imageUrl?: string;
  createdAt?: string;
}

const initialDemoEvents: EventItem[] = [
  {
    id: "e-1",
    title: "QNG National Hackathon 2026",
    category: "Hackathon",
    dateTime: "2026-09-05T09:00",
    location: "T-Hub, Hyderabad",
    price: "₹500/team",
    speakers: "Sharvan Kumar Sharma, Dr. Ananya Sharma",
    description: "48-hour competitive quantum hackathon focusing on VQE algorithms and Qiskit circuit optimization.",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "e-2",
    title: "Intro to Qiskit & Quantum Hardware",
    category: "Workshop",
    dateTime: "2026-08-20T10:00",
    location: "IISc, Bengaluru",
    price: "Free",
    speakers: "Rajan Jha, Dr. Ramesh Nair",
    description: "Hands-on workshop building your first quantum circuit and running on cloud QPU simulators.",
    imageUrl: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&auto=format&fit=crop&q=80",
  },
];

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "Workshop",
    dateTime: "",
    location: "",
    price: "Free",
    speakers: "",
    description: "",
    imageUrl: "",
  });

  // Load initial events from local storage or demo data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("qni_admin_created_events");
      if (saved) {
        try {
          setEvents(JSON.parse(saved));
        } catch {
          setEvents(initialDemoEvents);
        }
      } else {
        setEvents(initialDemoEvents);
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    const newEvent: EventItem = {
      id: `e-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
    };

    try {
      // Post to API endpoint
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          dateTime: formData.dateTime || new Date().toISOString(),
          location: formData.location,
          imageUrl: formData.imageUrl,
          registrationLink: "/events",
        }),
      }).catch((err) => console.warn("API POST warn:", err));

      // Update Local State & Storage
      const updated = [newEvent, ...events];
      setEvents(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("qni_admin_created_events", JSON.stringify(updated));
      }

      setSuccessMessage("Event created & published successfully!");
      setFormData({
        title: "",
        category: "Workshop",
        dateTime: "",
        location: "",
        price: "Free",
        speakers: "",
        description: "",
        imageUrl: "",
      });
    } catch (err) {
      console.error("Error creating event:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = (id: string) => {
    const updated = events.filter((ev) => ev.id !== id);
    setEvents(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("qni_admin_created_events", JSON.stringify(updated));
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-foreground/10 px-6 lg:px-12 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 rounded-full border border-foreground/15 hover:bg-foreground/10 text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-display text-2xl font-bold flex items-center gap-2">
                Event Management Portal
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-foreground/10 text-foreground">
                  Admin
                </span>
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Create, publish, and manage Quantum Nexus Global events
              </p>
            </div>
          </div>

          <Link href="/events" target="_blank">
            <Button size="sm" variant="outline" className="rounded-full text-xs gap-1.5">
              View Public Events Page →
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8 grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Event Form */}
        <div className="lg:col-span-5 border border-foreground/15 bg-foreground/5 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-foreground/10 pb-4">
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-500" />
              <h2 className="font-display text-xl font-bold">Create New Event</h2>
            </div>
            <span className="text-xs font-mono text-muted-foreground">Draft & Publish</span>
          </div>

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. QNG Quantum Hackathon 2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground"
                >
                  <option value="Workshop">Workshop</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Conference">Conference</option>
                  <option value="Webinar">Webinar</option>
                  <option value="Reading Group">Reading Group</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Ticket / Price
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Free or ₹500/team"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  required
                  value={formData.dateTime}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-xs font-mono text-foreground focus:outline-none focus:border-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="T-Hub Hyderabad / Online"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                Featured Speakers
              </label>
              <input
                type="text"
                name="speakers"
                value={formData.speakers}
                onChange={handleChange}
                placeholder="Dr. Ramesh Nair, Rajan Jha"
                className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                Banner Image URL (Unsplash/Direct)
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-xs font-mono text-foreground focus:outline-none focus:border-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                Event Description *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide event overview, problem statements, or agenda details..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-foreground text-background font-semibold text-sm flex items-center justify-center gap-2 hover:bg-foreground/90 transition-all shadow-md"
            >
              {isSubmitting ? (
                <span>Publishing Event...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Publish Event</span>
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Right Column: Published Events Table/Grid */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold">Published Events</h2>
              <p className="text-xs font-mono text-muted-foreground mt-0.5">
                Total {events.length} active events in database
              </p>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const saved = localStorage.getItem("qni_admin_created_events");
                if (saved) setEvents(JSON.parse(saved));
              }}
              className="rounded-full text-xs gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh List
            </Button>
          </div>

          <div className="space-y-4">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="p-5 rounded-2xl border border-foreground/15 bg-background flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:border-foreground/30 transition-all"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-foreground/10 text-foreground font-semibold">
                      {ev.category}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ev.dateTime ? new Date(ev.dateTime).toLocaleString() : "Date TBD"}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {ev.price}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-foreground leading-tight">
                    {ev.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-foreground/50" />
                      {ev.location}
                    </span>
                    {ev.speakers && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-foreground/50" />
                        {ev.speakers}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteEvent(ev.id)}
                  className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-full h-9 px-3 gap-1 text-xs"
                >
                  <Trash2 className="w-4 h-4" /> Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
