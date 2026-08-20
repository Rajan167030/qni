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
  // Extended fields
  imageUrl?: string;
  eventDate?: string; // ISO date string — used to compute upcoming vs past
  status?: 'upcoming' | 'past';
}

const STORAGE_KEY = 'qni_events_v3';

const DEFAULT_EVENTS: EventItem[] = [
  // Only the 4 Online Masterclass Sessions
  {
    id: 'q-session-1',
    month: 'SEP', day: '12', dayLabel: 'Sat',
    title: 'Quantum Circuit Design & Qiskit 1.0 Mastery (Online Masterclass 1/4)',
    description: 'Part 1 of 4: Quantum state vectors, unitary operators, multi-qubit entanglement & compilation.',
    location: 'Online (Live Stream + Cloud Jupyter Lab)',
    time: '10:00 AM – 1:00 PM IST',
    attendees: '500+',
    badge: 'Online Masterclass',
    category: 'Workshop',
    fullDescription: 'Part 1 of the 4-part Quantum Online Masterclass Series. Master modern Qiskit 1.0 primitives, state vector simulations, Bloch sphere manipulations, and efficient circuit transpilation for NISQ hardware. Designed to fast-track research and student projects with cloud compute access.',
    speakers: ['Dr. Ananya Sharma (C-DAC / QNI)', 'Rajan Jha (QNI CTO)'],
    price: 'Free for Students & Researchers',
    schedule: [
      { time: '10:00 AM', title: 'Qubit Superposition, Phase & Bloch Sphere Dynamics', speaker: 'Dr. Ananya Sharma' },
      { time: '11:00 AM', title: 'Building Multi-Qubit Entangled Circuits in Qiskit 1.0', speaker: 'Rajan Jha' },
      { time: '12:00 PM', title: 'Hands-on Lab: Transpilation & Circuit Optimization', speaker: 'Dr. Ananya Sharma' },
      { time: '12:45 PM', title: 'Interactive Q&A & Research Project Guidelines', speaker: 'All Speakers' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    eventDate: '2026-09-12T10:00:00Z',
    status: 'upcoming',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-session-2',
    month: 'SEP', day: '26', dayLabel: 'Sat',
    title: 'Variational Quantum Algorithms: VQE & QAOA in Practice (Online Masterclass 2/4)',
    description: 'Part 2 of 4: Hybrid quantum-classical optimization, Hamiltonian mapping, molecular states & Max-Cut.',
    location: 'Online (Live Stream + Cloud Jupyter Lab)',
    time: '10:00 AM – 1:00 PM IST',
    attendees: '500+',
    badge: 'Online Masterclass',
    category: 'Workshop',
    fullDescription: 'Part 2 of the 4-part Quantum Online Masterclass Series. Deep-dive into Variational Quantum Algorithms (VQE, QAOA). Learn how to formulate molecular Hamiltonians, construct efficient Ansätze, and execute classical-quantum optimization loops for real scientific papers.',
    speakers: ['Prof. Shreya Mehta (IISc Research Fellow)', 'Vikramaditya Singh (Quantum AI Lead)'],
    price: 'Free for Students & Researchers',
    schedule: [
      { time: '10:00 AM', title: 'Variational Principle & Parameterized Quantum Circuits (Ansatz Design)', speaker: 'Prof. Shreya Mehta' },
      { time: '11:00 AM', title: 'Hands-on VQE: Solving Molecular Ground State Energies', speaker: 'Prof. Shreya Mehta' },
      { time: '12:00 PM', title: 'QAOA for Combinatorial Optimization: Graph Max-Cut & Routing', speaker: 'Vikramaditya Singh' },
      { time: '12:45 PM', title: 'Benchmarking on Cloud Simulators & Open Discussion', speaker: 'All Speakers' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    eventDate: '2026-09-26T10:00:00Z',
    status: 'upcoming',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-session-3',
    month: 'OCT', day: '10', dayLabel: 'Sat',
    title: 'Quantum Machine Learning (QML) with PennyLane & PyTorch (Online Masterclass 3/4)',
    description: 'Part 3 of 4: Quantum Neural Networks (QNNs), Quantum Kernels, Data Encoding & Hybrid Models.',
    location: 'Online (Live Stream + Cloud Jupyter Lab)',
    time: '10:00 AM – 1:00 PM IST',
    attendees: '500+',
    badge: 'Online Masterclass',
    category: 'Workshop',
    fullDescription: 'Part 3 of the 4-part Quantum Online Masterclass Series. Explore the intersection of Artificial Intelligence and Quantum Mechanics. Learn Quantum Data Encoding, Quantum Kernels, Parameter-Shift Rules, and how to build Hybrid Classical-Quantum Neural Networks with PennyLane and PyTorch.',
    speakers: ['Dr. Ramesh Nair (Senior Quantum Scientist)', 'Priya Patel (QML Researcher)'],
    price: 'Free for Students & Researchers',
    schedule: [
      { time: '10:00 AM', title: 'Quantum Data Embeddings: Amplitude, Angle & Basis Encoding', speaker: 'Dr. Ramesh Nair' },
      { time: '11:00 AM', title: 'Quantum Neural Networks (QNNs) & Parameter Shift Rules', speaker: 'Priya Patel' },
      { time: '12:00 PM', title: 'Hands-on Lab: Hybrid PyTorch + Quantum Kernel Classifier', speaker: 'Priya Patel' },
      { time: '12:45 PM', title: 'Barren Plateaus & Mitigating Vanishing Gradients (Q&A)', speaker: 'Dr. Ramesh Nair' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    eventDate: '2026-10-10T10:00:00Z',
    status: 'upcoming',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-session-4',
    month: 'OCT', day: '24', dayLabel: 'Sat',
    title: 'Fault-Tolerant Architectures, Error Mitigation & Real QPU Runs (Online Masterclass 4/4)',
    description: 'Part 4 of 4: Zero-Noise Extrapolation (ZNE), Readout Error Mitigation, Surface Codes & Live Hardware Runs.',
    location: 'Online (Live Stream + Cloud QPU Hardware Execution)',
    time: '10:00 AM – 1:30 PM IST',
    attendees: '500+',
    badge: 'Online Masterclass',
    category: 'Workshop',
    fullDescription: 'Part 4 & Grand Finale of the Quantum Online Masterclass Series. Master Quantum Error Mitigation techniques (ZNE, Pauli Twirling, Readout Mitigation) and execute verified quantum algorithms directly on real superconducting QPUs. Compute grant awards and certificates will be distributed.',
    speakers: ['Prof. Deepak Khosla (Hardware Lead)', 'Sharvan Kumar Sharma (QNI Founder)'],
    price: 'Free for Students & Researchers',
    schedule: [
      { time: '10:00 AM', title: 'Quantum Decoherence, T1/T2 Relaxation & Noise Channels', speaker: 'Prof. Deepak Khosla' },
      { time: '11:00 AM', title: 'Active Error Mitigation: Zero-Noise Extrapolation & Pauli Twirling', speaker: 'Prof. Deepak Khosla' },
      { time: '12:00 PM', title: 'Live Execution of Error-Mitigated Circuits on Cloud QPUs', speaker: 'Sharvan Kumar Sharma' },
      { time: '1:00 PM', title: 'Capstone Research Submissions & Compute Grant Allocation', speaker: 'QNI Leadership' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    eventDate: '2026-10-24T10:00:00Z',
    status: 'upcoming',
    createdAt: new Date().toISOString(),
  },
];

const LEGACY_EVENT_IDS = ['1', '2', '3', '4', '5', '6', 'event-1', 'event-2', 'event-3', 'event-4', 'event-5', 'event-6'];

function loadEvents(): EventItem[] {
  if (typeof window === 'undefined') return DEFAULT_EVENTS;
  try {
    // Clear old storage keys from previous builds
    localStorage.removeItem('qni_events');
    localStorage.removeItem('qni_events_v2');

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EVENTS));
      return DEFAULT_EVENTS;
    }
    const parsed = JSON.parse(raw) as EventItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EVENTS));
      return DEFAULT_EVENTS;
    }

    // Filter out any legacy dummy events so ONLY the 4 online masterclass sessions remain
    const clean = parsed.filter((e) => !LEGACY_EVENT_IDS.includes(e.id));
    if (clean.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EVENTS));
      return DEFAULT_EVENTS;
    }
    return clean;
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

/** Determine if event is upcoming or past based on eventDate field */
export function resolveEventStatus(event: EventItem): 'upcoming' | 'past' {
  if (event.status) return event.status;
  if (event.eventDate) {
    return new Date(event.eventDate) >= new Date() ? 'upcoming' : 'past';
  }
  return 'upcoming';
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
    imageUrl: '',
    eventDate: '',
    status: 'upcoming',
    createdAt: new Date().toISOString(),
  };
}
