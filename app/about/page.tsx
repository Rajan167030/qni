'use client';

import Link from "next/link";
import { ArrowRight, Zap, Users, Rocket, Globe, Target, BookOpen } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Navigation spacing */}
      <div className="h-24" />

      {/* Hero Section */}
      <section className="relative px-6 lg:px-12 py-16 lg:py-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div>
              <h1 className="text-5xl lg:text-7xl font-display leading-tight mb-8">
                About QNI
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Quantum Nexus India is a pioneering quantum computing research and development organization dedicated to advancing quantum technology, democratizing quantum computing access, and building a thriving quantum innovation ecosystem in India and globally.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/join"
                  className="px-8 py-3 bg-foreground hover:bg-foreground/90 text-background rounded-full font-medium transition-all inline-flex items-center gap-2"
                >
                  Join Our Team
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-3 border border-foreground/20 hover:bg-foreground/5 text-foreground rounded-full font-medium transition-all"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
            <div className="relative h-96 lg:h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 via-foreground/5 to-transparent rounded-3xl" />
              <div className="absolute inset-4 border border-foreground/20 rounded-3xl" />
              <div className="relative p-8 h-full flex flex-col justify-center">
                <div className="text-center">
                  <Zap className="w-16 h-16 mx-auto mb-4 text-foreground/40" />
                  <p className="text-sm font-mono text-muted-foreground">
                    Building the future of quantum computing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative px-6 lg:px-12 py-16 lg:py-32 border-t border-foreground/10">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-4xl lg:text-5xl font-display mb-16">Our Mission & Vision</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="p-8 border border-foreground/10 rounded-2xl hover:border-foreground/20 transition-all">
              <Target className="w-12 h-12 mb-6 text-foreground/60" />
              <h3 className="text-2xl font-display mb-4">Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To advance quantum computing research, develop practical quantum solutions, and build a collaborative ecosystem where researchers, enterprises, and innovators can explore quantum technologies and drive technological excellence.
              </p>
            </div>
            
            <div className="p-8 border border-foreground/10 rounded-2xl hover:border-foreground/20 transition-all">
              <Rocket className="w-12 h-12 mb-6 text-foreground/60" />
              <h3 className="text-2xl font-display mb-4">Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To position India as a global leader in quantum computing innovation, making quantum technology accessible and practical for solving real-world problems across industries, research, and society.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative px-6 lg:px-12 py-16 lg:py-32 border-t border-foreground/10">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-4xl lg:text-5xl font-display mb-16">Core Values</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Innovation",
                description: "Pushing boundaries with cutting-edge quantum research and breakthrough solutions"
              },
              {
                icon: Users,
                title: "Collaboration",
                description: "Building a thriving community of researchers, developers, and quantum enthusiasts"
              },
              {
                icon: Globe,
                title: "Accessibility",
                description: "Making quantum computing education and tools available to everyone globally"
              },
              {
                icon: Target,
                title: "Excellence",
                description: "Maintaining the highest standards of research and development quality"
              },
              {
                icon: BookOpen,
                title: "Knowledge Sharing",
                description: "Open collaboration and transparent sharing of research findings and insights"
              },
              {
                icon: Rocket,
                title: "Impact",
                description: "Creating practical, real-world applications that solve meaningful problems"
              }
            ].map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="p-8 border border-foreground/10 rounded-2xl hover:border-foreground/20 transition-all group">
                  <Icon className="w-12 h-12 mb-4 text-foreground/60 group-hover:text-foreground transition-colors" />
                  <h3 className="text-xl font-display mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="relative px-6 lg:px-12 py-16 lg:py-32 border-t border-foreground/10">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-4xl lg:text-5xl font-display mb-16">What We Do</h2>
          
          <div className="space-y-8">
            {[
              {
                title: "Quantum Research",
                description: "Conducting advanced research in quantum algorithms, hardware, and applications to push the boundaries of what's possible in quantum computing."
              },
              {
                title: "Enterprise Solutions",
                description: "Developing practical quantum solutions for enterprise clients across finance, pharmaceutical, optimization, and AI-ML sectors."
              },
              {
                title: "Community Building",
                description: "Hosting events, workshops, and hackathons to foster a vibrant quantum computing community and nurture emerging talent."
              },
              {
                title: "Education & Training",
                description: "Providing comprehensive quantum computing education programs, courses, and mentorship to build the next generation of quantum scientists."
              },
              {
                title: "Industry Partnerships",
                description: "Collaborating with leading quantum hardware providers and tech companies to accelerate quantum computing adoption and innovation."
              },
              {
                title: "Open Innovation",
                description: "Supporting open-source quantum projects and publishing research to advance the entire quantum computing ecosystem."
              }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 p-8 border border-foreground/10 rounded-2xl hover:border-foreground/20 transition-all group">
                <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0 group-hover:bg-foreground/20 transition-colors">
                  <span className="text-sm font-display font-bold">{String(idx + 1).padStart(2, '0')}</span>
                </div>
                <div>
                  <h3 className="text-xl font-display mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Highlight */}
      <section className="relative px-6 lg:px-12 py-16 lg:py-32 border-t border-foreground/10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-display leading-tight mb-8">
                Meet Our Team
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Our team comprises leading quantum researchers, experienced engineers, and visionary leaders from around the world, united in the mission to advance quantum computing.
              </p>
              <Link
                href="/team"
                className="px-8 py-3 bg-foreground hover:bg-foreground/90 text-background rounded-full font-medium transition-all inline-flex items-center gap-2"
              >
                View Our Team
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-8 bg-gradient-to-br from-foreground/10 to-foreground/5 rounded-2xl border border-foreground/10">
                <Users className="w-12 h-12 mb-4 text-foreground/40" />
                <p className="text-3xl font-display mb-2">8+</p>
                <p className="text-sm text-muted-foreground">Dedicated Team Members</p>
              </div>
              <div className="p-8 bg-gradient-to-br from-foreground/10 to-foreground/5 rounded-2xl border border-foreground/10">
                <Globe className="w-12 h-12 mb-4 text-foreground/40" />
                <p className="text-3xl font-display mb-2">Global</p>
                <p className="text-sm text-muted-foreground">International Reach</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 lg:px-12 py-16 lg:py-32 border-t border-foreground/10">
        <div className="max-w-[1400px] mx-auto">
          <div className="p-12 lg:p-20 rounded-3xl border border-foreground/10 bg-gradient-to-br from-foreground/5 via-background to-background">
            <h2 className="text-4xl lg:text-5xl font-display mb-8 max-w-2xl">
           
            </h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
              
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/join"
                className="px-8 py-4 bg-foreground hover:bg-foreground/90 text-background rounded-full font-medium transition-all inline-flex items-center justify-center gap-2"
              >
                Join Our Community
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/events"
                className="px-8 py-4 border border-foreground/20 hover:bg-foreground/5 rounded-full font-medium transition-all inline-flex items-center justify-center gap-2"
              >
                Attend Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer spacing */}
      <div className="h-12" />
    </main>
  );
}
