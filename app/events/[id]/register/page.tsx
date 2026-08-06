'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, User, Mail, Phone, Building2, GraduationCap, ArrowRight } from 'lucide-react';

const eventData: Record<string, { title: string; date: string; location: string; price: string; category: string }> = {
  '1': { title: 'Intro to Qiskit — Bengaluru Chapter', date: 'Aug 02, 2026', location: 'IISC Campus, Bengaluru', price: 'Free', category: 'Workshop' },
  '2': { title: 'Variational Algorithms Reading Group', date: 'Aug 16, 2026', location: 'Online (Zoom)', price: 'Free for Members', category: 'Seminar' },
  '3': { title: 'QNI National Hackathon 2026', date: 'Sep 05–06, 2026', location: 'T-Hub, Hyderabad', price: '₹500/team', category: 'Hackathon' },
  '4': { title: 'Careers in Quantum — Mentor Panel', date: 'Sep 20, 2026', location: 'Online (Google Meet)', price: 'Free', category: 'Panel' },
  '5': { title: 'Quantum Error Correction Deep-Dive', date: 'Oct 11, 2026', location: 'IIT Bombay, Mumbai', price: '₹299 (Students: ₹99)', category: 'Workshop' },
  '6': { title: 'Post-Quantum Cryptography Workshop', date: 'Nov 08, 2026', location: 'Online (Zoom)', price: 'Free for Enterprise Partners', category: 'Workshop' },
};

export default function EventRegisterPage({ params }: { params: Promise<{ id: string }> }) {
  const [eventId, setEventId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', organization: '', role: '', background: 'Beginner', teamName: '', message: '',
  });

  useEffect(() => {
    params.then((p) => setEventId(p.id));
    setIsVisible(true);
  }, [params]);

  const event = eventId ? eventData[eventId] : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-display mb-3">You're Registered!</h1>
          <p className="text-foreground/60 mb-2">{form.name}, your registration for</p>
          <p className="font-semibold text-foreground mb-6">"{event?.title}"</p>
          <p className="text-sm text-foreground/50 mb-8">A confirmation email will be sent to <strong>{form.email}</strong>. Check your inbox for event details and access links.</p>
          <div className="flex flex-col gap-3">
            <Link href="/events" className="px-8 py-3 bg-foreground text-background rounded-xl font-medium hover:bg-foreground/90 transition-colors text-center">
              Browse More Events
            </Link>
            <Link href="/" className="px-8 py-3 border border-foreground/15 rounded-xl text-foreground/60 hover:text-foreground transition-colors text-center text-sm">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-foreground/10 bg-background/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/events" className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Events
          </Link>
          <span className="font-mono text-xs text-foreground/40 uppercase tracking-widest">Event Registration</span>
        </div>
      </div>

      <div className={`pt-28 pb-20 max-w-5xl mx-auto px-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="grid lg:grid-cols-5 gap-12 items-start">

          {/* Left: Event Summary Card */}
          <div className="lg:col-span-2">
            <div className="sticky top-28 rounded-3xl border border-foreground/15 bg-foreground/[0.02] p-8">
              <div className="font-mono text-xs text-foreground/40 uppercase tracking-widest mb-1">{event?.category}</div>
              <h2 className="font-display text-2xl text-foreground leading-tight mb-6">{event?.title}</h2>
              <div className="space-y-3 text-sm border-t border-foreground/10 pt-6">
                <div className="flex items-center gap-3 text-foreground/60">
                  <span className="font-mono text-xs w-20 shrink-0">Date</span>
                  <span className="text-foreground font-medium">{event?.date}</span>
                </div>
                <div className="flex items-center gap-3 text-foreground/60">
                  <span className="font-mono text-xs w-20 shrink-0">Location</span>
                  <span className="text-foreground font-medium">{event?.location}</span>
                </div>
                <div className="flex items-center gap-3 text-foreground/60">
                  <span className="font-mono text-xs w-20 shrink-0">Price</span>
                  <span className="text-foreground font-semibold">{event?.price}</span>
                </div>
              </div>

              {/* What you get */}
              <div className="mt-8 pt-6 border-t border-foreground/10">
                <p className="text-xs font-mono text-foreground/40 uppercase tracking-wider mb-4">Included with Registration</p>
                <div className="space-y-2">
                  {['Event access & recording', 'Certificate of participation', 'QNexus community membership', 'Networking with researchers'].map((item) => (
                    <div key={item} className="flex items-center gap-2.5 text-sm text-foreground/70">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Registration Form */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-display tracking-tight mb-2">Register for Event</h1>
              <p className="text-foreground/55">Fill in your details below to secure your spot.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Personal Info */}
              <div className="p-6 rounded-2xl border border-foreground/10 bg-foreground/[0.015] space-y-4">
                <p className="text-xs font-mono text-foreground/40 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Personal Information
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-foreground/50 mb-1.5">Full Name *</label>
                    <input
                      type="text" required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl border border-foreground/15 bg-background text-foreground placeholder:text-foreground/30 text-sm focus:outline-none focus:border-foreground/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-foreground/50 mb-1.5">Email Address *</label>
                    <input
                      type="email" required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-foreground/15 bg-background text-foreground placeholder:text-foreground/30 text-sm focus:outline-none focus:border-foreground/40 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-foreground/50 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-3 rounded-xl border border-foreground/15 bg-background text-foreground placeholder:text-foreground/30 text-sm focus:outline-none focus:border-foreground/40 transition-colors"
                  />
                </div>
              </div>

              {/* Professional Info */}
              <div className="p-6 rounded-2xl border border-foreground/10 bg-foreground/[0.015] space-y-4">
                <p className="text-xs font-mono text-foreground/40 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5" /> Professional Details
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-foreground/50 mb-1.5">Organization / Institution</label>
                    <input
                      type="text"
                      value={form.organization}
                      onChange={(e) => setForm({ ...form, organization: e.target.value })}
                      placeholder="IIT, C-DAC, TCS, etc."
                      className="w-full px-4 py-3 rounded-xl border border-foreground/15 bg-background text-foreground placeholder:text-foreground/30 text-sm focus:outline-none focus:border-foreground/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-foreground/50 mb-1.5">Your Role</label>
                    <input
                      type="text"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      placeholder="Student / Researcher / Engineer"
                      className="w-full px-4 py-3 rounded-xl border border-foreground/15 bg-background text-foreground placeholder:text-foreground/30 text-sm focus:outline-none focus:border-foreground/40 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-foreground/50 mb-1.5">Quantum Background</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                      <button
                        key={level} type="button"
                        onClick={() => setForm({ ...form, background: level })}
                        className={`py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                          form.background === level
                            ? 'bg-foreground text-background border-foreground'
                            : 'border-foreground/15 text-foreground/60 hover:border-foreground/30 hover:text-foreground'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hackathon-specific: Team name */}
              {eventId === '3' && (
                <div className="p-6 rounded-2xl border border-amber-400/20 bg-amber-50/5 space-y-4">
                  <p className="text-xs font-mono text-amber-600/70 dark:text-amber-400/70 uppercase tracking-wider flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5" /> Hackathon Team Info
                  </p>
                  <div>
                    <label className="block text-xs font-mono text-foreground/50 mb-1.5">Team Name *</label>
                    <input
                      type="text" required={eventId === '3'}
                      value={form.teamName}
                      onChange={(e) => setForm({ ...form, teamName: e.target.value })}
                      placeholder="Your team name"
                      className="w-full px-4 py-3 rounded-xl border border-foreground/15 bg-background text-foreground placeholder:text-foreground/30 text-sm focus:outline-none focus:border-foreground/40 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <label className="block text-xs font-mono text-foreground/50 mb-1.5">Additional Message (Optional)</label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Any specific questions or accessibility requirements..."
                  className="w-full px-4 py-3 rounded-xl border border-foreground/15 bg-background text-foreground placeholder:text-foreground/30 text-sm focus:outline-none focus:border-foreground/40 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background rounded-2xl font-semibold text-base hover:bg-foreground/90 transition-all duration-200 group"
              >
                Confirm Registration
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>

              <p className="text-xs text-center text-foreground/40 font-mono">
                By registering, you agree to QNexus India's community guidelines and privacy policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
