'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Mail, Sparkles, Users } from 'lucide-react';

const statusOptions = [
  'UG student',
  'PG student',
  'PhD / researcher',
  'Working professional',
  'Educator / academic',
  'Quantum computing enthusiast',
  'Other',
];

const contributionOptions = [
  'Content / blogs',
  'Quantum research and education',
  'Community management',
  'Outreach',
  'Events and programs',
  'Partnerships and industry relations',
  'Media and communication',
  'Design and creative',
  'Technology and website',
  'Operations and strategy',
  'Research mentorship',
  'Other',
];

const availabilityOptions = ['1-2 hours / week', '3-5 hours / week', '5-10 hours / week'];

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  currentStatus: string;
  contributionAreas: string[];
  skills: string;
  availability: string;
};

const initialForm: FormState = {
  fullName: '',
  phone: '',
  email: '',
  currentStatus: '',
  contributionAreas: [],
  skills: '',
  availability: '',
};

export default function JoinTeamPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const toggleContribution = (area: string) => {
    setForm((current) => ({
      ...current,
      contributionAreas: current.contributionAreas.includes(area)
        ? current.contributionAreas.filter((item) => item !== area)
        : [...current.contributionAreas, area],
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (form.contributionAreas.length === 0) {
      setError('Choose at least one area where you would like to contribute.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/team-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Something went wrong. Please try again.');
      setSubmitted(true);
    } catch (submitError: any) {
      setError(submitError.message || 'Unable to submit your application right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = 'w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10';
  const labelClass = 'mb-2 block text-sm font-semibold text-slate-800';

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f8f7] text-slate-950">
      <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_18%_5%,rgba(148,163,184,0.14),transparent_34%),radial-gradient(circle_at_82%_8%,rgba(203,213,225,0.18),transparent_30%)]" />
      <header className="relative z-10 border-b border-slate-900/10 bg-white/60 px-5 py-4 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950">
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">QNexus / Team</span>
        </div>
      </header>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-20">
        <section className="lg:sticky lg:top-10 lg:self-start">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-700/15 bg-white/70 px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-cyan-800">
            <Sparkles className="h-3.5 w-3.5" /> Build what comes next
          </div>
          <div className="mt-10 grid gap-3 text-sm text-slate-700">
            <div className="flex items-center gap-3 rounded-xl border border-slate-900/10 bg-white/60 p-4"><Users className="h-5 w-5 text-emerald-600" />Work with a welcoming, student-first community</div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-900/10 bg-white/60 p-4"><Mail className="h-5 w-5 text-cyan-600" />We will confirm your application by email</div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-900/10 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-10">
          {submitted ? (
            <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-8 w-8" /></div>
              <h2 className="text-3xl font-bold tracking-tight">Thank you for stepping forward.</h2>
              <p className="mt-4 max-w-md leading-7 text-slate-600">Your application is safely with our team. We have sent a confirmation to <strong>{form.email}</strong> and will contact you after reviewing your interests and availability.</p>
              <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">Return home <ArrowRight className="h-4 w-4" /></Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-700">01 / Your details</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">Tell us about yourself</h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label htmlFor="fullName" className={labelClass}>Full name</label><input id="fullName" required className={inputClass} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Your name" /></div>
                <div><label htmlFor="phone" className={labelClass}>Phone number</label><input id="phone" required type="tel" className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" /></div>
                <div className="sm:col-span-2"><label htmlFor="email" className={labelClass}>Email address</label><input id="email" required type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></div>
              </div>

              <fieldset><legend className="mb-3 text-sm font-semibold text-slate-800">Current status</legend><div className="grid gap-2 sm:grid-cols-2">{statusOptions.map((option) => <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-sm transition ${form.currentStatus === option ? 'border-cyan-500 bg-cyan-50 text-cyan-950' : 'border-slate-200 hover:border-slate-300'}`}><input required type="radio" name="currentStatus" value={option} checked={form.currentStatus === option} onChange={(e) => setForm({ ...form, currentStatus: e.target.value })} className="accent-cyan-600" />{option}</label>)}</div></fieldset>

              <fieldset><legend className="mb-3 text-sm font-semibold text-slate-800">How would you like to contribute?</legend><p className="mb-3 text-xs text-slate-500">Select all the areas where you would enjoy making an impact.</p><div className="grid gap-2 sm:grid-cols-2">{contributionOptions.map((option) => { const selected = form.contributionAreas.includes(option); return <button type="button" key={option} onClick={() => toggleContribution(option)} className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-sm transition ${selected ? 'border-emerald-500 bg-emerald-50 text-emerald-950' : 'border-slate-200 hover:border-slate-300'}`}><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${selected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'}`}>{selected && <Check className="h-3.5 w-3.5" />}</span>{option}</button>; })}</div></fieldset>

              <div><label htmlFor="skills" className={labelClass}>What would you bring to the team?</label><textarea id="skills" required rows={5} className={inputClass} value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Tell us about your skills, experience, projects, or ideas. There is no need to use formal language." /></div>

              <fieldset><legend className="mb-3 text-sm font-semibold text-slate-800">What time can you comfortably commit?</legend><div className="grid gap-2 sm:grid-cols-3">{availabilityOptions.map((option) => <label key={option} className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-center text-sm transition ${form.availability === option ? 'border-cyan-500 bg-cyan-50 text-cyan-950' : 'border-slate-200 hover:border-slate-300'}`}><input required type="radio" name="availability" value={option} checked={form.availability === option} onChange={(e) => setForm({ ...form, availability: e.target.value })} className="sr-only" />{option}</label>)}</div></fieldset>

              {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
              <button disabled={isSubmitting} type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? 'Sending your application...' : 'Submit my application'} <ArrowRight className="h-4 w-4" /></button>
              <p className="text-center text-xs leading-5 text-slate-500">Your information is used only to review your application and connect you with the QNexus team.</p>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
