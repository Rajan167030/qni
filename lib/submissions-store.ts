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

// Live Real Submissions Store (No fake/dummy seed data)
const initialContacts: ContactSubmission[] = [];
const initialJoins: JoinSubmission[] = [];
const initialRegistrations: EventRegistration[] = [];

// Helper functions for LocalStorage & Live Store management
export const getContacts = (): ContactSubmission[] => {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(STORAGE_KEYS.CONTACT);
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    // Filter out old demo seed IDs if any existed previously
    return Array.isArray(parsed) ? parsed.filter((c: ContactSubmission) => !['c-101', 'c-102', 'c-103'].includes(c.id)) : [];
  } catch {
    return [];
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
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(STORAGE_KEYS.JOIN);
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    // Filter out old demo seed IDs if any existed previously
    return Array.isArray(parsed) ? parsed.filter((j: JoinSubmission) => !['j-201', 'j-202', 'j-203'].includes(j.id)) : [];
  } catch {
    return [];
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
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    // Filter out old demo seed IDs if any existed previously
    return Array.isArray(parsed) ? parsed.filter((r: EventRegistration) => !['r-301', 'r-302', 'r-303'].includes(r.id)) : [];
  } catch {
    return [];
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

