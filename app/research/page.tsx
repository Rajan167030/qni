"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Cpu,
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  ArrowRight,
  CheckCircle2,
  Send,
  Loader2,
  Users,
  Terminal,
  FileText,
  Clock,
  ShieldCheck,
  Building2,
  ExternalLink,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveResearchApplication } from "@/lib/submissions-store";

export default function ResearchPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    institution: "",
    programLevel: "PhD Scholar",
    researchDomain: "Quantum Algorithms & Optimization",
    projectTitle: "",
    projectAbstract: "",
    supportTypes: ["Cloud QPU Credits", "1-on-1 Mentorship"],
    currentPaperStatus: "Work In Progress",
    githubOrArxiv: "",
    computeHoursRequested: "50 QPU Hours",
  });

  const toggleSupportType = (type: string) => {
    setFormData((prev) => {
      const exists = prev.supportTypes.includes(type);
      return {
        ...prev,
        supportTypes: exists
          ? prev.supportTypes.filter((t) => t !== type)
          : [...prev.supportTypes, type],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      status: "Under Review" as const,
    };

    saveResearchApplication(payload);

    try {
      await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn("MongoDB API error:", err);
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <span className="font-mono text-xs text-foreground/40 uppercase tracking-widest">
            QNI / Research & Student Support
          </span>
        </div>
      </div>

      {/* Full-Width Seamless Hero Header with No Box / No Borders */}
      <div className="relative w-full min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex flex-col justify-end pt-32 pb-16 overflow-hidden">
        {/* Full-Width Background Image */}
        <img
          src="/fe526f_a94fcf924c0f4efc8ea8a0e21663d499~mv2.avif"
          alt="Quantum Research Center"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />
        {/* Natural gradient overlay to keep text readable without fading the image */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/20" />

        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-400/40 bg-black/60 backdrop-blur-md text-cyan-300 font-mono text-xs">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>QNexus Academic & Research Support Initiative</span>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white leading-tight">
            Empowering Quantum Research <br />
            <span className="text-cyan-200">For Students & Academics in India.</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-200 leading-relaxed font-sans max-w-3xl">
            Democratizing access to quantum computing infrastructure. We provide cloud QPU hardware credits, 1-on-1 PhD mentorship, and open-access publication grants to ensure your research reaches the global stage.
          </p>
          <div className="pt-2">
            <Button
              onClick={() => setModalOpen(true)}
              className="rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-7 py-3 text-base gap-2 shadow-xl shadow-cyan-500/25"
            >
              <Sparkles className="w-4 h-4" /> Apply for Research Support
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* 2 Column Section: Details & Application Action */}
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left Column: Program Pillars */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl border border-foreground/10 bg-foreground/[0.02] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-display font-semibold">1. Hardware & Compute Credits</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Direct access to IBM Quantum superconducting quantum processors (QPUs) and QNexus high-memory simulator clusters. No waiting in long public queues.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-foreground/10 bg-foreground/[0.02] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-display font-semibold">2. Research Mentorship</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Connect directly with researchers from IISc, IIT Madras, C-DAC, and IBM Quantum for weekly office hours, code reviews, and Hamiltonian formulation guidance.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-foreground/10 bg-foreground/[0.02] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-display font-semibold">3. Publication & Travel Support</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Financial coverage for Article Processing Charges (APCs) for open-access journals (IEEE, APS, arXiv) and travel sponsorships to present accepted quantum papers.
              </p>
            </div>

            {/* Eligibility Info Box */}
            <div className="p-6 rounded-3xl border border-amber-500/20 bg-amber-500/5 space-y-3">
              <span className="font-mono text-xs text-amber-400 uppercase tracking-wider block">Who is Eligible?</span>
              <ul className="space-y-2 text-xs text-foreground/70">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  Undergraduate & Postgraduate STEM Students in India
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  PhD Scholars & Postdoctoral Fellows working on Quantum Tech
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  Independent Quantum Algorithm Researchers & Open-Source Contributors
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Application Trigger Card */}
          <div className="lg:col-span-3">
            <div className="p-8 sm:p-10 rounded-3xl border border-foreground/15 bg-gradient-to-br from-foreground/[0.03] via-background to-cyan-950/10 backdrop-blur-md shadow-2xl relative overflow-hidden space-y-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-cyan-400 font-mono text-xs mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Applications Open for 2026 Batch</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-foreground mb-3">
                  Apply for Quantum Research Support
                </h2>
                <p className="text-foreground/70 leading-relaxed text-sm sm:text-base">
                  Ready to accelerate your research? Submit your project proposal to get cloud QPU hours, scientific mentorship from doctoral fellows, and publication grant coverage.
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="grid sm:grid-cols-2 gap-4 py-2">
                {[
                  "Free IBM Quantum Hardware Credits",
                  "1-on-1 PhD & Postdoc Mentorship",
                  "Fast 48-Hour Scientific Review",
                  "Article Processing Charge (APC) Grants",
                  "High-Memory State-Vector Simulators",
                  "Verified Compute Certificate",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5 text-sm text-foreground/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Main Action Button to open Modal */}
              <div className="space-y-4 pt-4 border-t border-foreground/10">
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full flex items-center justify-center gap-3 py-4 sm:py-5 px-8 rounded-2xl bg-foreground text-background font-bold text-base hover:bg-foreground/90 transition-all shadow-xl shadow-cyan-500/5 group"
                >
                  <span>Open Researcher Application Form</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-xs text-center text-foreground/50 font-mono flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Applications reviewed weekly • Data saved securely to database
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Researcher Application Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => setModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-2xl bg-background border border-foreground/15 rounded-3xl p-6 sm:p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full border border-foreground/15 flex items-center justify-center hover:bg-foreground/10 transition-colors"
            >
              <X className="w-4 h-4 text-foreground/60" />
            </button>

            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-2">Application Submitted!</h3>
                <p className="text-foreground/60 text-sm mb-6 max-w-md mx-auto">
                  Thank you, <strong>{formData.fullName}</strong>. Your research proposal has been logged to the database. Our scientific advisory committee will review your proposal and contact you at <strong>{formData.email}</strong> within 48 hours.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/events"
                    className="px-6 py-3 bg-foreground text-background rounded-full font-medium text-sm hover:bg-foreground/90 transition-colors"
                  >
                    Explore Online Masterclasses
                  </Link>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setModalOpen(false);
                    }}
                    className="px-6 py-3 border border-foreground/20 rounded-full text-foreground/70 hover:text-foreground text-sm transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 font-mono text-xs mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>QNexus Research Support Application</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold">Apply for Quantum Research Support</h3>
                  <p className="text-sm text-foreground/60 mt-1">
                    Fill in your research details. Applications are reviewed on a rolling basis.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-foreground/50 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Dr. / Prof. / Student Name"
                        className="w-full px-4 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-foreground/50 mb-1">Institutional Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="scholar@university.ac.in"
                        className="w-full px-4 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/40"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-foreground/50 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 9876543210"
                        className="w-full px-4 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-foreground/50 mb-1">Institution / Department *</label>
                      <input
                        type="text"
                        required
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        placeholder="IIT / IISc / IIIT / Central Univ."
                        className="w-full px-4 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/40"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-foreground/50 mb-1">Academic Level *</label>
                      <select
                        value={formData.programLevel}
                        onChange={(e) => setFormData({ ...formData, programLevel: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/40"
                      >
                        <option value="Undergraduate">Undergraduate Student (B.Tech / B.Sc)</option>
                        <option value="Postgraduate">Postgraduate Student (M.Tech / M.Sc)</option>
                        <option value="PhD Scholar">PhD Scholar / Doctoral Fellow</option>
                        <option value="Postdoc">Postdoctoral Researcher</option>
                        <option value="Faculty">Faculty / Professor</option>
                        <option value="Independent Researcher">Independent Researcher</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-foreground/50 mb-1">Research Domain *</label>
                      <select
                        value={formData.researchDomain}
                        onChange={(e) => setFormData({ ...formData, researchDomain: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/40"
                      >
                        <option value="Quantum Algorithms & Optimization">Quantum Algorithms & Optimization</option>
                        <option value="Quantum Machine Learning">Quantum Machine Learning (QML)</option>
                        <option value="Quantum Error Correction">Quantum Error Correction & Surface Codes</option>
                        <option value="Quantum Chemistry & Materials">Quantum Chemistry & Simulation</option>
                        <option value="Quantum Hardware & Physics">Quantum Hardware & Superconducting Qubits</option>
                        <option value="Post-Quantum Cryptography">Post-Quantum Cryptography (PQC)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-foreground/50 mb-1">Project Title / Thesis Objective *</label>
                    <input
                      type="text"
                      required
                      value={formData.projectTitle}
                      onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                      placeholder="e.g. Scalable VQE for High-Entropy Alloys on NISQ Hardware"
                      className="w-full px-4 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-foreground/50 mb-1">Project Abstract & Methodology *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.projectAbstract}
                      onChange={(e) => setFormData({ ...formData, projectAbstract: e.target.value })}
                      placeholder="Briefly describe your hypothesis, quantum algorithms employed, and compute resource needs..."
                      className="w-full px-4 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/40 resize-none"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-foreground/50 mb-1">Paper Status</label>
                      <select
                        value={formData.currentPaperStatus}
                        onChange={(e) => setFormData({ ...formData, currentPaperStatus: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/40"
                      >
                        <option value="Ideation">Ideation & Formulation</option>
                        <option value="Work In Progress">Work In Progress (Simulation phase)</option>
                        <option value="Manuscript Ready">Manuscript Ready for Benchmarking</option>
                        <option value="Under Peer Review">Under Peer Review (Revision experiment)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-foreground/50 mb-1">GitHub / arXiv Link (Optional)</label>
                      <input
                        type="url"
                        value={formData.githubOrArxiv}
                        onChange={(e) => setFormData({ ...formData, githubOrArxiv: e.target.value })}
                        placeholder="https://github.com/... or arxiv.org/..."
                        className="w-full px-4 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-foreground/50 mb-1.5">Support Types Requested</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        "Cloud QPU Credits",
                        "1-on-1 Mentorship",
                        "Publication Grant",
                        "Sandbox Access",
                      ].map((type) => {
                        const isSelected = formData.supportTypes.includes(type);
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => toggleSupportType(type)}
                            className={`p-2.5 rounded-xl text-xs font-medium border transition-all text-center ${
                              isSelected
                                ? "bg-cyan-500/15 border-cyan-500 text-cyan-400"
                                : "border-foreground/15 text-foreground/60 hover:border-foreground/30"
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-4 bg-foreground text-background rounded-2xl font-semibold text-sm hover:bg-foreground/90 transition-all disabled:opacity-50 shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Application to Database...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
