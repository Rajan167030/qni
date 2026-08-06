"use client";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string;
  inquiryType: string;
  subject: string;
  message: string;
  createdAt: string;
  status: "New" | "In Progress" | "Resolved";
}

export interface JoinSubmission {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  expertise: string;
  experience: string;
  country: string;
  message: string;
  createdAt: string;
  status: "Pending" | "Approved" | "Rejected";
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  background: string;
  teamName?: string;
  createdAt: string;
  status: "Confirmed" | "Attended" | "Cancelled";
}

const STORAGE_KEYS = {
  CONTACT: "qni_contact_submissions",
  JOIN: "qni_join_submissions",
  REGISTRATIONS: "qni_event_registrations",
};

// Initial Seed Data for Demo & Testing
const initialContacts: ContactSubmission[] = [
  {
    id: "c-101",
    name: "Dr. Kavita Raman",
    email: "kavita.raman@iisc.ac.in",
    company: "IISc Quantum Lab",
    inquiryType: "Research Grants & Fellowships",
    subject: "QPU Simulator Cluster Access for VQE Research",
    message: "We are conducting molecular VQE benchmarking and would like enterprise cluster access for 100+ simulated qubits.",
    createdAt: "2026-08-06T14:30:00Z",
    status: "New",
  },
  {
    id: "c-102",
    name: "Aditya Roy",
    email: "aditya.roy@tcs.com",
    company: "TCS Innovation Labs",
    inquiryType: "Enterprise Quantum Solutions",
    subject: "QAOA Optimization for Supply Chain Logistics",
    message: "Interested in co-innovating with QNexus India for large-scale combinatorial optimization algorithms.",
    createdAt: "2026-08-05T11:15:00Z",
    status: "In Progress",
  },
  {
    id: "c-103",
    name: "Michael Chang",
    email: "mchang@stanford.edu",
    company: "Stanford Quantum Group",
    inquiryType: "Hardware / QPU Access",
    subject: "International Chapter Collaboration",
    message: "Exploring joint webinar series and student exchange programs between Stanford and QNexus India.",
    createdAt: "2026-08-04T09:45:00Z",
    status: "Resolved",
  },
];

const initialJoins: JoinSubmission[] = [
  {
    id: "j-201",
    fullName: "Siddharth Malhotra",
    email: "sid.malhotra@iitm.ac.in",
    phone: "+91 98765 12345",
    company: "IIT Madras",
    position: "PhD Research Scholar",
    expertise: "quantum-algorithms",
    experience: "Advanced / Fellow",
    country: "India",
    message: "Focused on variational quantum eigensolvers and pulse-level Qiskit control for superconducting qubits.",
    createdAt: "2026-08-06T16:20:00Z",
    status: "Pending",
  },
  {
    id: "j-202",
    fullName: "Elena Rostova",
    email: "elena.r@tum.de",
    phone: "+49 89 289 01",
    company: "TU Munich",
    position: "Quantum ML Engineer",
    expertise: "quantum-ml",
    experience: "Intermediate",
    country: "Germany",
    message: "Building hybrid quantum-classical neural network architectures for drug discovery.",
    createdAt: "2026-08-05T18:00:00Z",
    status: "Approved",
  },
  {
    id: "j-203",
    fullName: "Rohan Gupta",
    email: "rohan.g@bits-pilani.ac.in",
    phone: "+91 91234 56789",
    company: "BITS Pilani",
    position: "Student Lead",
    expertise: "student-chapter",
    experience: "Beginner",
    country: "India",
    message: "Want to launch a QNexus Student Chapter at BITS Pilani campus.",
    createdAt: "2026-08-04T12:10:00Z",
    status: "Pending",
  },
];

const initialRegistrations: EventRegistration[] = [
  {
    id: "r-301",
    eventId: "3",
    eventTitle: "QNI National Hackathon 2026",
    name: "Vikram Rathi",
    email: "vikram.rathi@gmail.com",
    phone: "+91 99887 76655",
    organization: "IIT Hyderabad",
    role: "M.Tech Student",
    background: "Intermediate",
    teamName: "Quantum Qubits",
    createdAt: "2026-08-06T19:00:00Z",
    status: "Confirmed",
  },
  {
    id: "r-302",
    eventId: "1",
    eventTitle: "Intro to Qiskit — Bengaluru chapter",
    name: "Neha Sharma",
    email: "neha.sharma@wipro.com",
    phone: "+91 98112 23344",
    organization: "Wipro Digital",
    role: "Senior Software Engineer",
    background: "Beginner",
    createdAt: "2026-08-06T10:15:00Z",
    status: "Confirmed",
  },
  {
    id: "r-303",
    eventId: "2",
    eventTitle: "Variational algorithms reading group",
    name: "Dr. Arvind Swaminathan",
    email: "arvind.s@cdac.in",
    phone: "+91 94433 22110",
    organization: "C-DAC Pune",
    role: "Senior Scientist",
    background: "Advanced",
    createdAt: "2026-08-05T15:40:00Z",
    status: "Attended",
  },
];

// Helper functions for LocalStorage management
export const getContacts = (): ContactSubmission[] => {
  if (typeof window === "undefined") return initialContacts;
  const saved = localStorage.getItem(STORAGE_KEYS.CONTACT);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.CONTACT, JSON.stringify(initialContacts));
    return initialContacts;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return initialContacts;
  }
};

export const saveContact = (contact: Omit<ContactSubmission, "id" | "createdAt" | "status">): ContactSubmission => {
  const contacts = getContacts();
  const newSubmission: ContactSubmission = {
    ...contact,
    id: `c-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "New",
  };
  const updated = [newSubmission, ...contacts];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.CONTACT, JSON.stringify(updated));
  }
  return newSubmission;
};

export const updateContactStatus = (id: string, status: ContactSubmission["status"]) => {
  const contacts = getContacts();
  const updated = contacts.map(c => (c.id === id ? { ...c, status } : c));
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.CONTACT, JSON.stringify(updated));
  }
};

export const getJoins = (): JoinSubmission[] => {
  if (typeof window === "undefined") return initialJoins;
  const saved = localStorage.getItem(STORAGE_KEYS.JOIN);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.JOIN, JSON.stringify(initialJoins));
    return initialJoins;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return initialJoins;
  }
};

export const saveJoin = (join: Omit<JoinSubmission, "id" | "createdAt" | "status">): JoinSubmission => {
  const joins = getJoins();
  const newSubmission: JoinSubmission = {
    ...join,
    id: `j-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "Pending",
  };
  const updated = [newSubmission, ...joins];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.JOIN, JSON.stringify(updated));
  }
  return newSubmission;
};

export const updateJoinStatus = (id: string, status: JoinSubmission["status"]) => {
  const joins = getJoins();
  const updated = joins.map(j => (j.id === id ? { ...j, status } : j));
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.JOIN, JSON.stringify(updated));
  }
};

export const getRegistrations = (): EventRegistration[] => {
  if (typeof window === "undefined") return initialRegistrations;
  const saved = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(initialRegistrations));
    return initialRegistrations;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return initialRegistrations;
  }
};

export const saveRegistration = (reg: Omit<EventRegistration, "id" | "createdAt" | "status">): EventRegistration => {
  const regs = getRegistrations();
  const newReg: EventRegistration = {
    ...reg,
    id: `r-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "Confirmed",
  };
  const updated = [newReg, ...regs];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));
  }
  return newReg;
};

export const updateRegistrationStatus = (id: string, status: EventRegistration["status"]) => {
  const regs = getRegistrations();
  const updated = regs.map(r => (r.id === id ? { ...r, status } : r));
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));
  }
};
