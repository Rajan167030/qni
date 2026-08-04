"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatedWave } from "./animated-wave";

const footerLinks = {
  Product: [
    { name: "Features", href: "#features" },
    { name: "How it works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "Integrations", href: "#integrations" },
  ],
  Developers: [
    { name: "Documentation", href: "#developers" },
    { name: "API Reference", href: "#" },
    { name: "SDK", href: "#developers" },
    { name: "Status", href: "#" },
  ],
  Company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#", badge: "Hiring" },
    { name: "Contact", href: "#" },
  ],
  Legal: [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Security", href: "#security" },
  ],
};

const socialLinks = [
  { name: "Twitter", href: "#" },
  { name: "GitHub", href: "#" },
  { name: "LinkedIn", href: "#" },
];

export function FooterSection() {
  return (
    <footer className="relative border-t border-foreground/10 bg-gradient-to-b from-background to-background/80">
      {/* Animated wave background */}
      <div className="absolute inset-0 opacity-100 pointer-events-none overflow-hidden">
        <AnimatedWave />
      </div>
      
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/95 to-background pointer-events-none"></div>
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer */}
        <div className="py-20 lg:py-28">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-12 lg:gap-10">
            {/* Brand Column */}
            <div className="col-span-2 space-y-4">
              <a href="#" className="inline-flex items-center gap-3 group">
                <span className="text-3xl font-display font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">QNI</span>
                <span className="text-xs text-muted-foreground font-mono px-2 py-1 border border-foreground/20 rounded-full group-hover:border-foreground/40 transition-colors">Quantum</span>
              </a>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Advancing quantum computing with cutting-edge research, enterprise solutions, and innovative AI-ML infrastructure.
              </p>

              {/* Social Links */}
              <div className="flex gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">{title}</h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 group"
                      >
                        {link.name}
                        {"badge" in link && link.badge && (
                          <span className="text-xs px-2 py-0.5 bg-foreground/10 text-foreground/80 rounded-full border border-foreground/20">
                            {link.badge}
                          </span>
                        )}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            2025 QNI - Quantum Nexus India. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
