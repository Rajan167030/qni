"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Twitter, Send, CheckCircle2, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedWave } from "./animated-wave";

const footerLinks = {
  Ecosystem: [
    { name: "About QNexus", href: "/about" },
    { name: "Quantum Events", href: "/events" },
    { name: "Event Gallery", href: "/gallery" },
    { name: "Quantum Team", href: "/team" },
    { name: "QNG Tech Blog", href: "/blog" },
    { name: "Join Community", href: "/join" },
  ],
  Resources: [
    { name: "QNG Tech Blog", href: "/blog" },
    { name: "Team Writer Portal", href: "/team-portal" },
    { name: "Admin Dashboard", href: "/admin" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Security Statement", href: "#" },
    { name: "Compliance", href: "#" },
  ],
};

const socialLinks = [
  { name: "GitHub", href: "https://github.com", icon: Github },
  { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { name: "Twitter / X", href: "https://x.com", icon: Twitter },
];

export function FooterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
    }, 4000);
  };

  return (
    <footer className="relative border-t border-foreground/10 bg-background text-foreground overflow-hidden">
      {/* 🌊 SVG Wave Top Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none overflow-hidden -translate-y-full">
        <svg
          className="w-full h-full text-foreground/5 fill-current preserve-3d animate-pulse"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path d="M0,32L48,42.7C96,53,192,75,288,80C384,85,480,75,576,58.7C672,43,768,21,864,21.3C960,21,1056,43,1152,53.3C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>

      {/* 🌊 Interactive Canvas Quantum Wave Background */}
      <div className="absolute inset-0 opacity-60 dark:opacity-80 pointer-events-none overflow-hidden">
        <AnimatedWave />
      </div>

      {/* Subtle overlay gradient to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Top Newsletter / Community Banner */}
        <div className="py-12 border-b border-foreground/10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-foreground/15 bg-foreground/5 text-xs font-mono tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quantum Dispatch</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground">
              Never miss a free talk or workshop
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Get event invitations, mentorship opportunities, and community updates in your inbox.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full sm:w-auto flex items-center gap-2">
            <div className="relative flex-1 sm:w-80">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your research email..."
                className="w-full px-4 py-3 rounded-full border border-foreground/20 bg-background/80 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-foreground/50 transition-colors"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-6 h-11 text-sm font-semibold shrink-0"
            >
              {subscribed ? (
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Subscribed
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  Subscribe <Send className="w-3.5 h-3.5 ml-1" />
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Main Footer Grid */}
        <div className="py-16 lg:py-24">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-10 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2 space-y-6">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <span className="text-3xl font-display font-bold tracking-tight text-foreground">
                  QNexus India
                </span>
                <span className="text-xs text-foreground/80 font-mono px-2.5 py-1 border border-foreground/20 rounded-full group-hover:border-foreground/40 transition-colors">
                  Quantum
                </span>
              </Link>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                A student-first quantum community connecting students with researchers, industry leaders, and peers through free talks, mentorship, and workshops — open to students everywhere.
              </p>

              {/* Social Links Badges */}
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-foreground/15 bg-foreground/5 hover:bg-foreground/10 hover:border-foreground/30 text-xs font-mono text-foreground transition-all duration-300 group"
                    >
                      <Icon className="w-3.5 h-3.5 text-foreground/80 group-hover:scale-110 transition-transform" />
                      <span>{s.name}</span>
                      <ArrowUpRight className="w-3 h-3 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Navigation Link Columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                  {category}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5 group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar & Status */}
        <div className="py-8 border-t border-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <p className="flex items-center gap-1.5">
            © 2026 QNexus India (QNI). Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for India's Quantum Ecosystem.
          </p>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Free to Join — Always
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
