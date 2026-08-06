"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, Calendar, MapPin, Clock, Users, ArrowRight, ExternalLink, ChevronRight } from "lucide-react";

const events = [
  {
    id: "1",
    month: "AUG",
    day: "02",
    dayLabel: "Sat",
    title: "Intro to Qiskit — Bengaluru chapter",
    description: "Hands-on workshop, no prior quantum background needed.",
    location: "IISC Campus, Bengaluru",
    time: "10:00 AM – 2:00 PM IST",
    attendees: "120",
    badge: "In person",
    category: "Workshop",
    fullDescription: "An accessible, hands-on introduction to IBM Qiskit. No prior quantum physics background required. You'll build your first quantum circuits, run simulations on real QPU hardware, and network with fellow developers.",
    speakers: ["Dr. Ramesh Nair", "Ankit Verma"],
    price: "Free (Registration Required)",
    schedule: [
      { time: "10:00 AM", title: "Introduction to Quantum Bits & Qiskit Setup" },
      { time: "11:00 AM", title: "Hands-on: Your First Quantum Circuit" },
      { time: "1:30 PM", title: "Real QPU Run Demo & Q&A" },
    ],
  },
  {
    id: "2",
    month: "AUG",
    day: "16",
    dayLabel: "Sat",
    title: "Variational algorithms reading group",
    description: "Open to all chapters, hosted online, recording shared after.",
    location: "Online (Zoom)",
    time: "3:00 PM – 5:00 PM IST",
    attendees: "250+",
    badge: "Online",
    category: "Seminar",
    fullDescription: "A deep-dive reading group session covering the latest advances in Variational Quantum Eigensolvers (VQE) and QAOA. Open to all QNexus chapter members globally.",
    speakers: ["Prof. Shreya Mehta", "QNexus Research Team"],
    price: "Free for Members",
    schedule: [
      { time: "3:00 PM", title: "Paper Review: VQE with Adaptive Circuits" },
      { time: "4:00 PM", title: "Open Discussion & Q&A" },
    ],
  },
  {
    id: "3",
    month: "SEP",
    day: "05-06",
    dayLabel: "Sat-Sun",
    title: "QNI National Hackathon 2026",
    description: "48-hour build sprint with real QPU access, hosted in Hyderabad.",
    location: "T-Hub, Hyderabad",
    time: "Sep 5 9:00 AM – Sep 6 9:00 PM IST",
    attendees: "500+",
    badge: "Flagship",
    category: "Hackathon",
    fullDescription: "India's premier quantum computing hackathon. Build real-world solutions using QNexus India's quantum cloud platform with direct QPU access on IBM Quantum hardware. Win prizes worth ₹5 Lakhs.",
    speakers: ["Sharvan Kumar Sharma", "Dr. Ananya Sharma", "Prof. Rajesh Varma"],
    price: "₹500/team (up to 4 members)",
    schedule: [
      { time: "Sep 5, 9 AM", title: "Opening Ceremony & Problem Statements" },
      { time: "Sep 5, 11 AM", title: "Hackathon Sprint Begins" },
      { time: "Sep 6, 9 PM", title: "Final Submissions & Prize Ceremony" },
    ],
  },
  {
    id: "4",
    month: "SEP",
    day: "20",
    dayLabel: "Sun",
    title: "Careers in quantum — mentor panel",
    description: "Engineers from partner labs answer questions on internships and PhDs.",
    location: "Online (Google Meet)",
    time: "5:00 PM – 7:00 PM IST",
    attendees: "300+",
    badge: "Online",
    category: "Panel",
    fullDescription: "A candid mentor panel where engineers and researchers from IIT Madras, IISc, IBM Quantum, and TCS Labs answer your questions about careers in quantum computing.",
    speakers: ["Dr. Ananya Sharma", "Prof. Rajesh Varma", "Vikramaditya Singh"],
    price: "Free",
    schedule: [
      { time: "5:00 PM", title: "Panelist Introductions & Pathways discussion" },
      { time: "6:00 PM", title: "Open Q&A from Audience" },
    ],
  },
];

export function EventsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      setTimeout(() => setPanelOpen(true), 10);
      document.body.style.overflow = "hidden";
    } else {
      setPanelOpen(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedEvent]);

  const closePanel = () => {
    setPanelOpen(false);
    setTimeout(() => setSelectedEvent(null), 300);
  };

  return (
    <section
      id="events"
      ref={sectionRef}
      className="relative py-24 lg:py-32 border-t border-foreground/10 bg-background text-foreground"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-20">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Events
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Join our events.
            <br />
            <span className="text-muted-foreground">Connect with the community.</span>
          </h2>
        </div>

        {/* Events List — matching exact screenshot style */}
        <div className="divide-y divide-foreground/10 border-t border-b border-foreground/10">
          {events.map((event, index) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className={`group flex items-start gap-8 py-8 cursor-pointer transition-all duration-300 hover:px-4 hover:-mx-4 hover:bg-foreground/[0.02] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              {/* Date column (Exact reference style) */}
              <div className="w-16 shrink-0 text-left select-none">
                <div className="font-mono text-xs text-foreground/40 uppercase tracking-widest leading-none">
                  {event.month}
                </div>
                <div className="font-display text-3xl lg:text-4xl font-bold text-foreground leading-tight tracking-tight my-1">
                  {event.day}
                </div>
                <div className="font-mono text-[11px] text-foreground/45 leading-none">
                  {event.dayLabel}
                </div>
              </div>

              {/* Title & description in the center */}
              <div className="flex-1 min-w-0 py-0.5">
                <h3 className="text-lg lg:text-xl font-medium leading-snug text-foreground mb-1.5 group-hover:text-foreground/80 transition-colors">
                  {event.title}
                </h3>
                <p className="text-sm text-foreground/50 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Badge on the right */}
              <div className="shrink-0 flex items-center gap-3 pt-1">
                <span className="text-xs font-mono text-foreground/60 border border-foreground/15 px-3 py-1 rounded-full whitespace-nowrap bg-background">
                  {event.badge}
                </span>
                <ChevronRight className="w-4 h-4 text-foreground/25 group-hover:text-foreground/50 group-hover:translate-x-0.5 transition-all duration-200" />
              </div>
            </div>
          ))}
        </div>

        {/* View all button */}
        <div className="mt-12 text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-mono text-foreground/50 hover:text-foreground transition-colors"
          >
            <span>Explore all scheduled events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Slide-in detail panel overlay */}
      {selectedEvent && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-45 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
              panelOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={closePanel}
          />

          {/* Panel */}
          <div
            className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[500px] bg-background border-l border-foreground/10 shadow-2xl overflow-y-auto transition-transform duration-300 ease-out ${
              panelOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-foreground/10 px-8 py-5 flex items-center justify-between">
              <span className="font-mono text-xs text-foreground/40 uppercase tracking-widest">
                Event Overview
              </span>
              <button
                onClick={closePanel}
                className="w-9 h-9 rounded-full border border-foreground/15 flex items-center justify-center hover:bg-foreground/10 transition-colors"
              >
                <X className="w-4 h-4 text-foreground/60" />
              </button>
            </div>

            {/* Content */}
            <div className="px-8 py-8 space-y-8">
              {/* Date & Badge */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono text-xs text-foreground/40 uppercase tracking-wider">
                    {selectedEvent.month} {selectedEvent.day}, 2026
                  </div>
                  <div className="font-mono text-xs text-foreground/30 mt-0.5">
                    {selectedEvent.dayLabel}
                  </div>
                </div>
                <span className="text-xs font-mono text-foreground/60 border border-foreground/15 px-3 py-1 rounded-full">
                  {selectedEvent.badge}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-2xl lg:text-3xl font-display leading-tight text-foreground mb-4">
                  {selectedEvent.title}
                </h2>
                <p className="text-foreground/60 leading-relaxed text-sm">
                  {selectedEvent.fullDescription}
                </p>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: MapPin, label: "Location", value: selectedEvent.location },
                  { icon: Clock, label: "Time", value: selectedEvent.time },
                  { icon: Users, label: "Attendees", value: `${selectedEvent.attendees} expected` },
                  { icon: Calendar, label: "Tickets", value: selectedEvent.price },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="p-4 rounded-2xl border border-foreground/10 bg-foreground/[0.015]">
                    <div className="flex items-center gap-1.5 text-foreground/45 mb-1.5">
                      <Icon className="w-3.5 h-3.5" />
                      <span className="font-mono text-[10px] uppercase tracking-widest">{label}</span>
                    </div>
                    <p className="text-foreground text-sm font-medium leading-snug">{value}</p>
                  </div>
                ))}
              </div>

              {/* Agenda */}
              <div>
                <h3 className="font-display text-lg mb-4 text-foreground">Agenda</h3>
                <div className="border-l border-foreground/15 pl-5 space-y-4">
                  {selectedEvent.schedule.map((item, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-foreground/20 border-2 border-background" />
                      <div className="font-mono text-[10px] text-foreground/30 uppercase tracking-wider mb-0.5">
                        {item.time}
                      </div>
                      <div className="text-foreground text-sm font-medium">{item.title}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Register Button */}
              <div className="pt-2 space-y-3">
                <Link href={`/events/${selectedEvent.id}/register`}>
                  <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-foreground text-background rounded-2xl font-semibold text-sm hover:bg-foreground/90 transition-colors group">
                    Register for This Event
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-foreground/12 text-foreground/50 hover:text-foreground hover:border-foreground/25 text-sm font-medium transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
