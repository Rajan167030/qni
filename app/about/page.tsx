'use client';

import Link from "next/link";
import { ArrowRight, Zap, Users, Rocket, Globe, Target, BookOpen } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Hero Section — full-width event image background, starts directly below fixed nav */}
      <section className="relative h-[70vh] min-h-[480px] flex items-end overflow-hidden">
        {/* Background event image from gallery */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=80"
          alt="QNG Event"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark gradient — transparent at top, dark only at bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />

        {/* Content pinned to bottom */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 pb-10 w-full">
          <span className="text-xs font-mono tracking-[0.25em] uppercase text-foreground/50 mb-3 block">
            Quantum Nexus Global
          </span>
          <h1 className="text-5xl lg:text-7xl font-display leading-tight mb-5">
            About QNG
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-6">
            
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/join"
              className="px-7 py-3 bg-foreground hover:bg-foreground/90 text-background rounded-full font-medium transition-all inline-flex items-center gap-2"
            >
              Join Our Team
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-7 py-3 border border-foreground/20 hover:bg-foreground/5 text-foreground rounded-full font-medium transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative px-6 lg:px-12 py-10 lg:py-16 border-t border-foreground/10">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-4xl lg:text-5xl font-display mb-10">Our Mission & Vision</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-7 border border-foreground/10 rounded-2xl hover:border-foreground/20 transition-all">
              <Target className="w-10 h-10 mb-5 text-foreground/60" />
              <h3 className="text-2xl font-display mb-3">Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To advance quantum computing research, develop practical quantum solutions, and build a collaborative ecosystem where researchers, enterprises, and innovators can explore quantum technologies and drive technological excellence.
              </p>
            </div>
            <div className="p-7 border border-foreground/10 rounded-2xl hover:border-foreground/20 transition-all">
              <Rocket className="w-10 h-10 mb-5 text-foreground/60" />
              <h3 className="text-2xl font-display mb-3">Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To position India as a global leader in quantum computing innovation, making quantum technology accessible and practical for solving real-world problems across industries, research, and society.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative px-6 lg:px-12 py-10 lg:py-16 border-t border-foreground/10">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-4xl lg:text-5xl font-display mb-10">Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Innovation", description: "Pushing boundaries with cutting-edge quantum research and breakthrough solutions" },
              { icon: Users, title: "Collaboration", description: "Building a thriving community of researchers, developers, and quantum enthusiasts" },
              { icon: Globe, title: "Accessibility", description: "Making quantum computing education and tools available to everyone globally" },
              { icon: Target, title: "Excellence", description: "Maintaining the highest standards of research and development quality" },
              { icon: BookOpen, title: "Knowledge Sharing", description: "Open collaboration and transparent sharing of research findings and insights" },
              { icon: Rocket, title: "Impact", description: "Creating practical, real-world applications that solve meaningful problems" },
            ].map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="p-6 border border-foreground/10 rounded-2xl hover:border-foreground/20 transition-all group">
                  <Icon className="w-10 h-10 mb-4 text-foreground/60 group-hover:text-foreground transition-colors" />
                  <h3 className="text-xl font-display mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="relative px-6 lg:px-12 py-10 lg:py-16 border-t border-foreground/10">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-4xl lg:text-5xl font-display mb-10">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { title: "Quantum Research", description: "Conducting advanced research in quantum algorithms, hardware, and applications to push the boundaries of what's possible in quantum computing." },
              { title: "Enterprise Solutions", description: "Developing practical quantum solutions for enterprise clients across finance, pharmaceutical, optimization, and AI-ML sectors." },
              { title: "Community Building", description: "Hosting events, workshops, and hackathons to foster a vibrant quantum computing community and nurture emerging talent." },
              { title: "Education & Training", description: "Providing comprehensive quantum computing education programs, courses, and mentorship to build the next generation of quantum scientists." },
              { title: "Industry Partnerships", description: "Collaborating with leading quantum hardware providers and tech companies to accelerate quantum computing adoption and innovation." },
              { title: "Open Innovation", description: "Supporting open-source quantum projects and publishing research to advance the entire quantum computing ecosystem." },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-5 p-6 border border-foreground/10 rounded-2xl hover:border-foreground/20 transition-all group">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0 group-hover:bg-foreground/20 transition-colors">
                  <span className="text-sm font-display font-bold">{String(idx + 1).padStart(2, '0')}</span>
                </div>
                <div>
                  <h3 className="text-xl font-display mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Highlight */}
      <section className="relative px-6 lg:px-12 py-10 lg:py-16 border-t border-foreground/10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-display leading-tight mb-6">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-7">
                Our team comprises leading quantum researchers, experienced engineers, and visionary leaders from around the world, united in the mission to advance quantum computing.
              </p>
              <Link
                href="/team"
                className="px-7 py-3 bg-foreground hover:bg-foreground/90 text-background rounded-full font-medium transition-all inline-flex items-center gap-2"
              >
                View Our Team
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-7 bg-gradient-to-br from-foreground/10 to-foreground/5 rounded-2xl border border-foreground/10">
                <Users className="w-10 h-10 mb-4 text-foreground/40" />
                <p className="text-3xl font-display mb-1">8+</p>
                <p className="text-sm text-muted-foreground">Dedicated Team Members</p>
              </div>
              <div className="p-7 bg-gradient-to-br from-foreground/10 to-foreground/5 rounded-2xl border border-foreground/10">
                <Globe className="w-10 h-10 mb-4 text-foreground/40" />
                <p className="text-3xl font-display mb-1">Global</p>
                <p className="text-sm text-muted-foreground">International Reach</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 lg:px-12 py-10 lg:py-16 border-t border-foreground/10">
        <div className="max-w-[1400px] mx-auto">
          <div className="p-10 lg:p-16 rounded-3xl border border-foreground/20 bg-background/60 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-foreground/5 blur-3xl rounded-full pointer-events-none" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-foreground/20 bg-foreground/5 text-xs font-mono tracking-widest uppercase mb-6 text-foreground">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Join Quantum Nexus Global</span>
              </span>
              <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-4 max-w-2xl text-foreground">
                Ready to Shape the <br />
                <span className="text-muted-foreground">Quantum Future?</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                Join our global network of quantum researchers, developers, and enterprise innovators building tomorrow&apos;s computational landscape.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/join"
                  className="px-8 py-4 bg-foreground hover:bg-foreground/90 text-background rounded-full font-medium transition-all inline-flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl group"
                >
                  <span>Join Our Community</span>
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/events"
                  className="px-8 py-4 border border-foreground/20 hover:bg-foreground/10 text-foreground rounded-full font-medium transition-all inline-flex items-center justify-center gap-2"
                >
                  Attend Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </main>
  );
}
