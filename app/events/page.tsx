'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Calendar, MapPin, Clock, ArrowRight, ExternalLink, ArrowLeft, ChevronRight, Users } from 'lucide-react';
import { getEvents, EventItem } from '@/lib/events-store';

const allEvents = [
  {
    id: '1',
    month: 'AUG',
    day: '02',
    dayLabel: 'Sat',
    title: 'Intro to Qiskit — Bengaluru chapter',
    description: 'Hands-on workshop, no prior quantum background needed.',
    location: 'IISC Campus, Bengaluru',
    time: '10:00 AM – 2:00 PM IST',
    attendees: '120',
    badge: 'In person',
    category: 'Workshop',
    fullDescription: 'An accessible, hands-on introduction to IBM Qiskit. No prior quantum physics background required. You\'ll build your first quantum circuits, run simulations on real QPU hardware, and network with fellow developers from the Bengaluru quantum chapter.',
    speakers: ['Dr. Ramesh Nair', 'Ankit Verma'],
    price: 'Free (Registration Required)',
    schedule: [
      { time: '10:00 AM', title: 'Introduction to Quantum Bits & Qiskit Setup', speaker: 'Dr. Ramesh Nair' },
      { time: '11:00 AM', title: 'Hands-on: Your First Quantum Circuit', speaker: 'Ankit Verma' },
      { time: '12:30 PM', title: 'Networking Lunch', speaker: '' },
      { time: '1:30 PM', title: 'Real QPU Run Demo & Q&A', speaker: 'Dr. Ramesh Nair' },
    ],
  },
  {
    id: '2',
    month: 'AUG',
    day: '16',
    dayLabel: 'Sat',
    title: 'Variational algorithms reading group',
    description: 'Open to all chapters, hosted online, recording shared after.',
    location: 'Online (Zoom)',
    time: '3:00 PM – 5:00 PM IST',
    attendees: '250+',
    badge: 'Online',
    category: 'Seminar',
    fullDescription: 'A deep-dive reading group session covering the latest advances in Variational Quantum Eigensolvers (VQE) and QAOA. Open to all QNexus chapter members globally. Recording will be shared with all members after the session.',
    speakers: ['Prof. Shreya Mehta', 'QNexus Research Team'],
    price: 'Free for Members',
    schedule: [
      { time: '3:00 PM', title: 'Paper Review: VQE with Adaptive Circuits', speaker: 'Prof. Shreya Mehta' },
      { time: '4:00 PM', title: 'Open Discussion', speaker: 'All Members' },
      { time: '4:45 PM', title: 'Q&A & Next Session Preview', speaker: 'QNexus Team' },
    ],
  },
  {
    id: '3',
    month: 'SEP',
    day: '05–06',
    dayLabel: 'Sat–Sun',
    title: 'QNI National Hackathon 2026',
    description: '48-hour build sprint with real QPU access, hosted in Hyderabad.',
    location: 'T-Hub, Hyderabad',
    time: 'Sep 5 9:00 AM – Sep 6 9:00 PM IST',
    attendees: '500+',
    badge: 'Flagship',
    category: 'Hackathon',
    fullDescription: 'India\'s premier quantum computing hackathon. Build real-world solutions using QNexus India\'s quantum cloud platform with direct QPU access on IBM Quantum hardware. Win prizes worth ₹5 Lakhs and gain direct mentorship from top researchers.',
    speakers: ['Sharvan Kumar Sharma', 'Dr. Ananya Sharma', 'Prof. Rajesh Varma'],
    price: '₹500/team (up to 4 members)',
    schedule: [
      { time: 'Sep 5, 9 AM', title: 'Opening Ceremony & Problem Statements', speaker: 'QNI Leadership' },
      { time: 'Sep 5, 11 AM', title: 'Hackathon Sprint Begins', speaker: '' },
      { time: 'Sep 6, 12 PM', title: 'Midpoint Mentorship Slots', speaker: 'Expert Panel' },
      { time: 'Sep 6, 9 PM', title: 'Final Submissions & Prize Ceremony', speaker: 'QNI Team' },
    ],
  },
  {
    id: '4',
    month: 'SEP',
    day: '20',
    dayLabel: 'Sun',
    title: 'Careers in quantum — mentor panel',
    description: 'Engineers from partner labs answer questions on internships and PhDs.',
    location: 'Online (Google Meet)',
    time: '5:00 PM – 7:00 PM IST',
    attendees: '300+',
    badge: 'Online',
    category: 'Panel',
    fullDescription: 'A candid mentor panel where engineers and researchers from IIT Madras, IISc, IBM Quantum, and TCS Labs answer your questions about careers in quantum computing — internships, PhDs, and industry transitions.',
    speakers: ['Dr. Ananya Sharma (C-DAC)', 'Prof. Rajesh Varma (IIT Madras)', 'Vikramaditya Singh (TCS)'],
    price: 'Free',
    schedule: [
      { time: '5:00 PM', title: 'Panelist Introductions', speaker: 'Moderator' },
      { time: '5:15 PM', title: 'Career Pathways in Quantum', speaker: 'All Panelists' },
      { time: '6:00 PM', title: 'Open Q&A from Audience', speaker: 'All Panelists' },
      { time: '6:45 PM', title: 'Networking Breakout Rooms', speaker: '' },
    ],
  },
  {
    id: '5',
    month: 'OCT',
    day: '11',
    dayLabel: 'Sat',
    title: 'Quantum error correction deep-dive',
    description: 'Technical masterclass on surface codes and fault-tolerant computing.',
    location: 'IIT Bombay, Mumbai',
    time: '10:00 AM – 4:00 PM IST',
    attendees: '80',
    badge: 'In person',
    category: 'Workshop',
    fullDescription: 'An advanced technical masterclass covering quantum error correction, surface codes, and fault-tolerant quantum computation. Ideal for researchers and developers with a basic quantum mechanics background.',
    speakers: ['Prof. Deepak Khosla', 'Rajan Jha (QNI CTO)'],
    price: '₹299 (Students: ₹99)',
    schedule: [
      { time: '10:00 AM', title: 'Introduction to Error Correction', speaker: 'Rajan Jha' },
      { time: '11:30 AM', title: 'Surface Code Deep-Dive', speaker: 'Prof. Deepak Khosla' },
      { time: '1:00 PM', title: 'Lunch Break', speaker: '' },
      { time: '2:00 PM', title: 'Hands-on Lab: Simulating Error Correction', speaker: 'Both Speakers' },
    ],
  },
  {
    id: '6',
    month: 'NOV',
    day: '08',
    dayLabel: 'Sat',
    title: 'Post-quantum cryptography workshop',
    description: 'Securing systems for the quantum era — enterprise focus.',
    location: 'Online (Zoom)',
    time: '2:00 PM – 5:00 PM IST',
    attendees: '400+',
    badge: 'Enterprise',
    category: 'Workshop',
    fullDescription: 'An enterprise-focused workshop covering post-quantum cryptography standards (NIST PQC), lattice-based cryptography, and transitioning enterprise security systems to quantum-safe protocols.',
    speakers: ['QNI Security Team', 'Industry Expert (TBC)'],
    price: 'Free for Enterprise Partners',
    schedule: [
      { time: '2:00 PM', title: 'NIST PQC Standards Overview', speaker: 'QNI Security Team' },
      { time: '3:00 PM', title: 'Enterprise Migration Strategies', speaker: 'Industry Expert' },
      { time: '4:00 PM', title: 'Live Q&A', speaker: 'All Speakers' },
    ],
  },
];

export default function EventsListPage() {
  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setAllEvents(getEvents());
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      setTimeout(() => setPanelOpen(true), 10);
      document.body.style.overflow = 'hidden';
    } else {
      setPanelOpen(false);
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedEvent]);

  const closePanel = () => {
    setPanelOpen(false);
    setTimeout(() => setSelectedEvent(null), 350);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top nav */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-foreground/10 bg-background/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <span className="font-mono text-xs text-foreground/30 tracking-widest">QNI / Events</span>
        </div>
      </div>

      {/* Page header */}
      <div className={`pt-28 pb-12 max-w-5xl mx-auto px-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <span className="font-mono text-xs tracking-widest text-foreground/40 uppercase block mb-3">Community</span>
        <div className="relative">
          <h1
            className="text-5xl lg:text-7xl font-display tracking-tight glitch-heading"
            data-text="Events"
          >
            Events
          </h1>
          {/* Terminal cursor blink */}
          <span
            className="inline-block w-[3px] h-12 lg:h-16 bg-cyan-400 ml-2 align-bottom"
            style={{ animation: 'quantum-pulse 1s step-end infinite' }}
          />
        </div>
      </div>

      {/* Events list */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="divide-y divide-foreground/8">
          {allEvents.map((event, idx) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className={`group flex items-start gap-10 py-7 cursor-pointer transition-all duration-200 hover:px-3 hover:-mx-3 hover:bg-foreground/[0.03] hover:rounded-xl ${
                isVisible ? 'scan-in' : 'opacity-0'
              }`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* Date column */}
              <div className="w-16 shrink-0 text-left select-none">
                <div className="font-mono text-[11px] text-foreground/35 uppercase tracking-wider leading-tight">{event.month}</div>
                <div className="font-display text-3xl lg:text-4xl font-bold text-foreground leading-tight tracking-tight my-0.5">{event.day}</div>
                <div className="font-mono text-[11px] text-foreground/35 leading-tight">{event.dayLabel}</div>
              </div>

              {/* Content column */}
              <div className="flex-1 min-w-0 py-0.5">
                {/* Quantum scan line accent */}
                <div
                  className="h-px w-0 bg-gradient-to-r from-cyan-400/60 to-transparent mb-2 group-hover:w-full transition-all duration-500 ease-out"
                />
                <h3 className="text-lg lg:text-xl text-foreground font-medium leading-snug mb-1.5 group-hover:text-foreground/80 transition-colors">
                  {event.title}
                </h3>
                <p className="text-sm text-foreground/45 leading-relaxed">{event.description}</p>
              </div>

              {/* Badge column */}
              <div className="shrink-0 flex items-center gap-3 pt-1">
                <span
                  className="text-xs font-mono text-foreground/50 border border-foreground/15 px-3 py-1 rounded-full whitespace-nowrap group-hover:border-cyan-400/30 group-hover:text-cyan-500/70 transition-colors duration-300"
                >
                  {event.badge}
                </span>
                <ChevronRight className="w-4 h-4 text-foreground/25 group-hover:text-foreground/50 group-hover:translate-x-0.5 transition-all duration-200" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide-in detail panel */}
      {selectedEvent && (
        <>
          <div
            className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-350 ${panelOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={closePanel}
          />
          <div
            className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[520px] bg-background border-l border-foreground/10 shadow-2xl overflow-y-auto transition-transform duration-350 ease-out ${panelOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            {/* Panel header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-foreground/10 px-8 py-5 flex items-center justify-between">
              <span className="font-mono text-xs text-foreground/35 uppercase tracking-widest">Event Details</span>
              <button
                onClick={closePanel}
                className="w-9 h-9 rounded-full border border-foreground/15 flex items-center justify-center hover:bg-foreground/8 transition-colors"
              >
                <X className="w-4 h-4 text-foreground/60" />
              </button>
            </div>

            <div className="px-8 py-8 space-y-8">
              {/* Date + badge */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono text-xs text-foreground/35 uppercase tracking-wider">{selectedEvent.month} {selectedEvent.day}, 2026</div>
                  <div className="font-mono text-xs text-foreground/30 mt-0.5">{selectedEvent.dayLabel}</div>
                </div>
                <span className="text-xs font-mono text-foreground/50 border border-foreground/15 px-3 py-1 rounded-full">
                  {selectedEvent.badge}
                </span>
              </div>

              {/* Title & description */}
              <div>
                <h2 className="text-2xl lg:text-3xl font-display leading-tight text-foreground mb-3">
                  {selectedEvent.title}
                </h2>
                <p className="text-foreground/55 leading-relaxed text-sm">{selectedEvent.fullDescription}</p>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: MapPin, label: 'Location', value: selectedEvent.location },
                  { icon: Clock, label: 'Time', value: selectedEvent.time },
                  { icon: Users, label: 'Attendees', value: `${selectedEvent.attendees} expected` },
                  { icon: Calendar, label: 'Tickets', value: selectedEvent.price },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="p-4 rounded-2xl border border-foreground/8 bg-foreground/[0.02]">
                    <div className="flex items-center gap-1.5 text-foreground/35 mb-1.5">
                      <Icon className="w-3 h-3" />
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
                      <div className="font-mono text-[10px] text-foreground/30 uppercase tracking-wider mb-0.5">{item.time}</div>
                      <div className="text-foreground text-sm font-medium">{item.title}</div>
                      {item.speaker && <div className="text-xs text-foreground/40 mt-0.5">{item.speaker}</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Speakers */}
              {selectedEvent.speakers.length > 0 && (
                <div>
                  <h3 className="font-display text-lg mb-3 text-foreground">Speakers</h3>
                  <div className="space-y-2">
                    {selectedEvent.speakers.map((s, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-foreground/8 bg-foreground/[0.02]">
                        <div className="w-8 h-8 rounded-full bg-foreground text-background font-display font-bold text-xs flex items-center justify-center shrink-0">
                          {s.charAt(0)}
                        </div>
                        <span className="text-sm text-foreground">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Register CTA */}
              <div className="pt-2 space-y-3">
                <Link href={`/events/${selectedEvent.id}/register`}>
                  <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-foreground text-background rounded-2xl font-semibold text-sm hover:bg-foreground/90 transition-colors group">
                    Register for This Event
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-foreground/12 text-foreground/55 hover:text-foreground hover:border-foreground/25 text-sm font-medium transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
