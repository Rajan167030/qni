// Shared Events Store — used by both admin dashboard and public events page

export interface EventItem {
  id: string;
  month: string;
  day: string;
  dayLabel: string;
  title: string;
  description: string;
  location: string;
  time: string;
  attendees: string;
  badge: string;
  category: string;
  fullDescription: string;
  speakers: string[];
  price: string;
  schedule: { time: string; title: string; speaker: string }[];
  createdAt: string;
}

const STORAGE_KEY = 'qni_events';

const DEFAULT_EVENTS: EventItem[] = [
  {
    id: '1',
    month: 'AUG', day: '02', dayLabel: 'Sat',
    title: 'Intro to Qiskit — Bengaluru chapter',
    description: 'Hands-on workshop, no prior quantum background needed.',
    location: 'IISC Campus, Bengaluru',
    time: '10:00 AM – 2:00 PM IST',
    attendees: '120',
    badge: 'In person',
    category: 'Workshop',
    fullDescription: "An accessible, hands-on introduction to IBM Qiskit. No prior quantum physics background required. You'll build your first quantum circuits, run simulations on real QPU hardware, and network with fellow developers from the Bengaluru quantum chapter.",
    speakers: ['Dr. Ramesh Nair', 'Ankit Verma'],
    price: 'Free (Registration Required)',
    schedule: [
      { time: '10:00 AM', title: 'Introduction to Quantum Bits & Qiskit Setup', speaker: 'Dr. Ramesh Nair' },
      { time: '11:00 AM', title: 'Hands-on: Your First Quantum Circuit', speaker: 'Ankit Verma' },
      { time: '12:30 PM', title: 'Networking Lunch', speaker: '' },
      { time: '1:30 PM', title: 'Real QPU Run Demo & Q&A', speaker: 'Dr. Ramesh Nair' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    month: 'AUG', day: '16', dayLabel: 'Sat',
    title: 'Variational algorithms reading group',
    description: 'Open to all chapters, hosted online, recording shared after.',
    location: 'Online (Zoom)',
    time: '3:00 PM – 5:00 PM IST',
    attendees: '250+',
    badge: 'Online',
    category: 'Seminar',
    fullDescription: 'A deep-dive reading group session covering the latest advances in Variational Quantum Eigensolvers (VQE) and QAOA. Open to all QNexus chapter members globally.',
    speakers: ['Prof. Shreya Mehta', 'QNexus Research Team'],
    price: 'Free for Members',
    schedule: [
      { time: '3:00 PM', title: 'Paper Review: VQE with Adaptive Circuits', speaker: 'Prof. Shreya Mehta' },
      { time: '4:00 PM', title: 'Open Discussion', speaker: 'All Members' },
      { time: '4:45 PM', title: 'Q&A & Next Session Preview', speaker: 'QNexus Team' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    month: 'SEP', day: '05–06', dayLabel: 'Sat–Sun',
    title: 'QNI National Hackathon 2026',
    description: '48-hour build sprint with real QPU access, hosted in Hyderabad.',
    location: 'T-Hub, Hyderabad',
    time: 'Sep 5 9:00 AM – Sep 6 9:00 PM IST',
    attendees: '500+',
    badge: 'Flagship',
    category: 'Hackathon',
    fullDescription: "India's premier quantum computing hackathon. Build real-world solutions using QNexus India's quantum cloud platform with direct QPU access on IBM Quantum hardware.",
    speakers: ['Sharvan Kumar Sharma', 'Dr. Ananya Sharma', 'Prof. Rajesh Varma'],
    price: '₹500/team (up to 4 members)',
    schedule: [
      { time: 'Sep 5, 9 AM', title: 'Opening Ceremony & Problem Statements', speaker: 'QNI Leadership' },
      { time: 'Sep 5, 11 AM', title: 'Hackathon Sprint Begins', speaker: '' },
      { time: 'Sep 6, 12 PM', title: 'Midpoint Mentorship Slots', speaker: 'Expert Panel' },
      { time: 'Sep 6, 9 PM', title: 'Final Submissions & Prize Ceremony', speaker: 'QNI Team' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    month: 'SEP', day: '20', dayLabel: 'Sun',
    title: 'Careers in quantum — mentor panel',
    description: 'Engineers from partner labs answer questions on internships and PhDs.',
    location: 'Online (Google Meet)',
    time: '5:00 PM – 7:00 PM IST',
    attendees: '300+',
    badge: 'Online',
    category: 'Panel',
    fullDescription: 'A candid mentor panel where engineers and researchers from IIT Madras, IISc, IBM Quantum, and TCS Labs answer your questions about careers in quantum computing.',
    speakers: ['Dr. Ananya Sharma (C-DAC)', 'Prof. Rajesh Varma (IIT Madras)', 'Vikramaditya Singh (TCS)'],
    price: 'Free',
    schedule: [
      { time: '5:00 PM', title: 'Panelist Introductions', speaker: 'Moderator' },
      { time: '5:15 PM', title: 'Career Pathways in Quantum', speaker: 'All Panelists' },
      { time: '6:00 PM', title: 'Open Q&A from Audience', speaker: 'All Panelists' },
      { time: '6:45 PM', title: 'Networking Breakout Rooms', speaker: '' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    month: 'OCT', day: '11', dayLabel: 'Sat',
    title: 'Quantum error correction deep-dive',
    description: 'Technical masterclass on surface codes and fault-tolerant computing.',
    location: 'IIT Bombay, Mumbai',
    time: '10:00 AM – 4:00 PM IST',
    attendees: '80',
    badge: 'In person',
    category: 'Workshop',
    fullDescription: 'An advanced technical masterclass covering quantum error correction, surface codes, and fault-tolerant quantum computation.',
    speakers: ['Prof. Deepak Khosla', 'Rajan Jha (QNI CTO)'],
    price: '₹299 (Students: ₹99)',
    schedule: [
      { time: '10:00 AM', title: 'Introduction to Error Correction', speaker: 'Rajan Jha' },
      { time: '11:30 AM', title: 'Surface Code Deep-Dive', speaker: 'Prof. Deepak Khosla' },
      { time: '1:00 PM', title: 'Lunch Break', speaker: '' },
      { time: '2:00 PM', title: 'Hands-on Lab: Simulating Error Correction', speaker: 'Both Speakers' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    month: 'NOV', day: '08', dayLabel: 'Sat',
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
    createdAt: new Date().toISOString(),
  },
];

function loadEvents(): EventItem[] {
  if (typeof window === 'undefined') return DEFAULT_EVENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EVENTS));
      return DEFAULT_EVENTS;
    }
    return JSON.parse(raw) as EventItem[];
  } catch {
    return DEFAULT_EVENTS;
  }
}

function persist(events: EventItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function getEvents(): EventItem[] {
  return loadEvents();
}

export function saveEvent(event: EventItem): void {
  const all = loadEvents();
  const idx = all.findIndex((e) => e.id === event.id);
  if (idx >= 0) {
    all[idx] = event;
  } else {
    all.push(event);
  }
  persist(all);
}

export function deleteEvent(id: string): void {
  const all = loadEvents().filter((e) => e.id !== id);
  persist(all);
}

export function createBlankEvent(): EventItem {
  return {
    id: Date.now().toString(),
    month: '',
    day: '',
    dayLabel: '',
    title: '',
    description: '',
    location: '',
    time: '',
    attendees: '',
    badge: 'In person',
    category: 'Workshop',
    fullDescription: '',
    speakers: [''],
    price: 'Free',
    schedule: [{ time: '', title: '', speaker: '' }],
    createdAt: new Date().toISOString(),
  };
}
