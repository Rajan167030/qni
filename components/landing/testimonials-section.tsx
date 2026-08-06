"use client";

import { useState } from "react";
import { Quote, Star, CheckCircle2, Linkedin, Twitter, Globe, ExternalLink, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: number;
  author: string;
  signature: string;
  role: string;
  company: string;
  organization: string;
  image: string;
  shortQuote: string;
  fullQuote: string;
  metric: string;
  stack: string;
  linkedin: string;
  twitter: string;
  website: string;
  featured?: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    author: "Dr. Ananya Sharma",
    signature: "Ananya Sharma",
    role: "Head of Quantum Systems",
    company: "C-DAC India",
    organization: "Centre for Development of Advanced Computing",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    shortQuote: "The team at QNexus India has provided our research lab with unprecedented quantum leverage. Their error-mitigation pipeline cut our simulation time from weeks to hours.",
    fullQuote: "QNexus India has built a state-of-the-art quantum-classical pipeline. Their fault-tolerant simulators and automated gate optimization allowed our team at C-DAC to accelerate national quantum computing benchmarks by 95%.",
    metric: "95% Faster Quantum Circuits",
    stack: "Quantum VQE • NISQ Error Mitigation",
    linkedin: "https://linkedin.com/in/dr-ananya-sharma-quantum",
    twitter: "https://x.com/ananya_quantum",
    website: "https://cdac.in",
    featured: false,
  },
  {
    id: 2,
    author: "Priya Patel",
    signature: "Priya Patel",
    role: "Product Lead at Lightdash",
    company: "Lightdash Quantum",
    organization: "Lightdash Quantum Systems",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    shortQuote: "QNexus India's hybrid quantum-classical workflows integrated seamlessly into our production. The design, speed, and algorithmic precision are spot on.",
    fullQuote: "Deploying enterprise-grade quantum workflows used to require custom compilers. QNexus India's unified platform enabled our R&D team to ship 14 quantum applications seamlessly within 6 weeks.",
    metric: "14 Production Quantum Apps",
    stack: "Hybrid HPC • Qiskit SDK",
    linkedin: "https://linkedin.com/in/priya-patel-quantum",
    twitter: "https://x.com/priyapatel_q",
    website: "https://lightdash.io",
    featured: true, // Photo card like the center card in screenshot
  },
  {
    id: 3,
    author: "Prof. Rajesh K. Varma",
    role: "Chair of Quantum Computing",
    signature: "Rajesh K. Varma",
    company: "IIT Madras",
    organization: "IIT Madras Quantum Information Lab",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    shortQuote: "QNexus has greatly exceeded our expectations. Communication is excellent, turnaround is extremely quick, and the quantum algorithms are fresh and innovative.",
    fullQuote: "Managing NISQ hardware noise was our biggest bottleneck. QNexus India's quantum noise suppression strategies now ensure 3.5x more reliable results on real quantum processors.",
    metric: "350% Gate Fidelity Boost",
    stack: "NISQ Hardware • Noise Reduction",
    linkedin: "https://linkedin.com/in/prof-rajesh-varma-iit",
    twitter: "https://x.com/rkvarma_quantum",
    website: "https://iitm.ac.in",
    featured: false,
  },
  {
    id: 4,
    author: "Vikramaditya Singh",
    role: "Director of Quantum AI",
    signature: "V. Singh",
    company: "TCS Innovation",
    organization: "TCS Innovation & Deep Tech Labs",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
    shortQuote: "QNexus India bridges theoretical quantum physics and industrial optimization with remarkable efficiency. Their QAOA algorithms saved months of work.",
    fullQuote: "QNexus India's algorithms transformed our financial portfolio optimization. Their QAOA solvers deliver 10,000x speedup in multi-variable combinatorial problem solving.",
    metric: "10,000x Speedup in QAOA",
    stack: "QAOA • Portfolio Optimization",
    linkedin: "https://linkedin.com/in/vikramaditya-singh-tcs",
    twitter: "https://x.com/vikram_quantum",
    website: "https://tcs.com",
    featured: false,
  },
  {
    id: 5,
    author: "Dr. Marcus Vance",
    role: "VP Research & Development",
    signature: "Marcus Vance",
    company: "IBM Quantum",
    organization: "IBM Quantum Network Partner",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
    shortQuote: "Working with QNexus India has given our enterprise clients a competitive edge in quantum readiness and fault-tolerant algorithm deployment.",
    fullQuote: "QNexus India's deep-tech expertise and developer ecosystem are unmatched. They have helped us benchmark novel quantum circuits across global supercomputing networks.",
    metric: "50+ Qubit Hardware Sim",
    stack: "IBM Qiskit • Superposition Sim",
    linkedin: "https://linkedin.com/in/marcus-vance-quantum",
    twitter: "https://x.com/marcus_vance_q",
    website: "https://ibm.com/quantum",
    featured: false,
  },
];

export function TestimonialsSection() {
  const [selectedPartner, setSelectedPartner] = useState<Testimonial | null>(null);

  return (
    <section className="relative py-28 lg:py-36 bg-background text-foreground border-t border-foreground/10 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header matching user's design image */}
        <div className="mb-16">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase block mb-3">
            TESTIMONIALS
          </span>
          <h2 className="text-4xl md:text-6xl font-display tracking-tight text-foreground max-w-2xl leading-[1.05]">
            Don't take our word for it!
            <br />
            Hear it from our partners.
          </h2>
        </div>
      </div>

      {/* Infinite Horizontal Carousel Loop Line */}
      <div className="w-full overflow-hidden py-4 group">
        <div className="flex gap-6 marquee-slow whitespace-nowrap hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing">
          {[...Array(3)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex gap-6 shrink-0 items-stretch">
              {testimonials.map((t) => (
                <div
                  key={`${loopIdx}-${t.id}`}
                  onClick={() => setSelectedPartner(t)}
                  className={`w-[340px] md:w-[380px] shrink-0 rounded-3xl p-8 transition-all duration-300 cursor-pointer flex flex-col justify-between select-none ${
                    t.featured
                      ? "relative text-white overflow-hidden shadow-2xl border border-white/20 hover:scale-[1.02]"
                      : "bg-card border border-border/80 shadow-md hover:shadow-xl hover:border-foreground/40 hover:-translate-y-1"
                  }`}
                  style={
                    t.featured
                      ? {
                          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.85)), url(${t.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : {}
                  }
                >
                  {/* Top Avatar Circle */}
                  <div className="flex items-center justify-between mb-6">
                    <img
                      src={t.image}
                      alt={t.author}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-foreground/20 shadow-md"
                    />
                    <span
                      className={`text-[11px] font-mono px-3 py-1 rounded-full font-semibold ${
                        t.featured
                          ? "bg-white/20 text-white backdrop-blur-md"
                          : "bg-foreground/10 text-foreground"
                      }`}
                    >
                      {t.metric}
                    </span>
                  </div>

                  {/* Quote content */}
                  <div className="my-4">
                    <p
                      className={`text-sm md:text-base leading-relaxed line-clamp-4 ${
                        t.featured ? "text-white/90 font-medium" : "text-muted-foreground font-normal"
                      }`}
                    >
                      "{t.shortQuote}"
                    </p>
                  </div>

                  {/* Signature / Author info at bottom */}
                  <div className="pt-6 mt-2 border-t border-current/10 flex flex-col">
                    <span
                      className={`font-serif italic text-2xl tracking-wide ${
                        t.featured ? "text-white" : "text-foreground font-semibold"
                      }`}
                    >
                      {t.signature}
                    </span>
                    <span
                      className={`text-xs mt-1 ${
                        t.featured ? "text-white/80" : "text-muted-foreground"
                      }`}
                    >
                      {t.role}, {t.company}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="font-mono text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Hover to pause loop • Click any testimonial to view profile & social links
        </p>
      </div>

      {/* Interactive Partner Profile Modal */}
      {selectedPartner && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedPartner(null)}
        >
          <div
            className="bg-card text-card-foreground border border-border w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPartner(null)}
              className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-background/80 hover:bg-background border border-border text-foreground flex items-center justify-center transition-transform hover:scale-105"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header Banner */}
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <img
                src={selectedPartner.image}
                alt={selectedPartner.author}
                className="w-full h-full object-cover object-center filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              <div className="absolute bottom-4 left-6 sm:left-8 flex items-center gap-2">
                <span className="bg-foreground text-background font-mono text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> VERIFIED PARTNER
                </span>
                <span className="bg-background/90 backdrop-blur-md text-foreground font-mono text-xs font-bold px-3 py-1 rounded-full border border-border shadow-md">
                  {selectedPartner.metric}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8">
              {/* Profile Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                    {selectedPartner.author}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground mt-0.5">
                    {selectedPartner.role}
                  </p>
                  <p className="text-xs font-mono text-foreground/80 mt-1">
                    {selectedPartner.organization}
                  </p>
                </div>

                {/* Social Links Buttons */}
                <div className="flex items-center gap-2.5">
                  <a
                    href={selectedPartner.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-semibold shadow-md transition-transform hover:scale-105"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={selectedPartner.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground transition-transform hover:scale-105"
                    title="Twitter / X Profile"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href={selectedPartner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground transition-transform hover:scale-105"
                    title="Organization Website"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Full Testimonial Quote */}
              <div className="py-6">
                <Quote className="w-8 h-8 text-foreground/20 mb-3" />
                <p className="text-base sm:text-lg leading-relaxed text-foreground font-sans">
                  "{selectedPartner.fullQuote}"
                </p>
              </div>

              {/* Tech Stack & Footer */}
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
                <div>
                  <span className="text-foreground/70">Quantum Stack:</span>{" "}
                  <span className="text-foreground font-semibold">{selectedPartner.stack}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => setSelectedPartner(null)}
                >
                  Close Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
