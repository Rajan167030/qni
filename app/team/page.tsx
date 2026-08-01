'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Linkedin, Twitter, ArrowRight } from 'lucide-react';

const teamMembers = [
  {
    id: '1',
    name: 'Sharvan Kumar Sharma',
    role: 'CEO & Co-Founder',
    image: '/team/sharvan-kumar-sharma.png',
    bio: 'Visionary leader with 15+ years in quantum computing and enterprise software architecture.',
    fullBio: 'Sharvan Kumar Sharma is the CEO and co-founder of Optimus, bringing extensive experience in quantum computing research and enterprise software architecture. He has published over 40 papers on quantum algorithms and leads the strategic vision for making quantum computing accessible to enterprises worldwide.',
    expertise: ['Quantum Circuits', 'Enterprise Strategy', 'Research Leadership'],
    email: 'sharvan@optimus.com',
    linkedin: '#',
    twitter: '#',
  },
  {
    id: '2',
    name: 'Rajan Jha',
    role: 'CTO & Co-Founder',
    image: '/team/rajan-jha.png',
    bio: 'Technical architect specializing in hybrid quantum-classical systems and machine learning infrastructure.',
    fullBio: 'Rajan Jha serves as CTO and co-founder, overseeing the technical architecture of Optimus. With expertise in both quantum and classical ML systems, Rajan has designed systems processing petabyte-scale data while optimizing for quantum advantage. His work on error mitigation algorithms has been cited in leading quantum computing journals.',
    expertise: ['Quantum ML', 'System Architecture', 'Error Mitigation'],
    email: 'rajan@optimus.com',
    linkedin: '#',
    twitter: '#',
  },
  {
    id: '3',
    name: 'Subham',
    role: 'Lead Quantum Algorithm Engineer',
    image: '/team/subham.png',
    bio: 'Expert in VQE, QAOA, and advanced quantum circuit optimization techniques.',
    fullBio: 'Subham leads the quantum algorithms research team, specializing in Variational Quantum Eigensolver (VQE) and Quantum Approximate Optimization Algorithm (QAOA) implementations. His innovations in circuit depth reduction have improved execution fidelity by over 40% on NISQ devices.',
    expertise: ['VQE', 'QAOA', 'Circuit Optimization'],
    email: 'subham@optimus.com',
    linkedin: '#',
    twitter: '#',
  },
  {
    id: '4',
    name: 'Myank',
    role: 'Head of Product & Design',
    image: '/team/myank.png',
    bio: 'Product strategist focused on making quantum computing intuitive and accessible for enterprises.',
    fullBio: 'Myank leads product development and design strategy at Optimus, ensuring complex quantum workflows are simplified for enterprise users. His human-centered design approach has resulted in a 5x improvement in developer adoption and has received recognition from leading design publications.',
    expertise: ['Product Strategy', 'UX/UI Design', 'User Research'],
    email: 'myank@optimus.com',
    linkedin: '#',
    twitter: '#',
  },
];

const teamPageStyles = `
  .team-card {
    position: relative;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .team-card:hover {
    transform: translateY(-12px);
  }

  .team-image-container {
    position: relative;
    width: 100%;
    aspect-ratio: 3/4;
    overflow: hidden;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .team-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .team-card:hover .team-image {
    transform: scale(1.08);
  }

  .team-image-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
    display: flex;
    align-items: flex-end;
    padding: 1.5rem;
  }

  .team-card:hover .team-image-overlay {
    opacity: 1;
  }

  .team-overlay-content {
    width: 100%;
    color: white;
    font-size: 0.875rem;
    line-height: 1.6;
  }

  .expertise-badge {
    display: inline-block;
    font-size: 0.75rem;
    padding: 0.35rem 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.25rem;
    color: rgba(255, 255, 255, 0.6);
    transition: all 0.3s ease;
  }

  .team-card:hover .expertise-badge {
    border-color: rgba(255, 255, 255, 0.3);
    color: rgba(255, 255, 255, 0.8);
  }

  .social-link {
    width: 1.25rem;
    height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    opacity: 0.6;
  }

  .social-link:hover {
    opacity: 1;
    color: rgba(255, 255, 255, 1);
  }

  .header-line {
    width: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
    transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .section-visible .header-line {
    width: 3rem;
  }
`;

export default function TeamPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{teamPageStyles}</style>
      <main className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="border-b border-foreground/10 sticky top-0 z-50 bg-background/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
            <Link href="/" className="text-2xl font-display font-bold text-foreground">
              optimus
            </Link>
            <Link
              href="/"
              className="text-sm text-foreground/70 hover:text-foreground transition-colors flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative py-24 px-6 lg:px-8 border-b border-foreground/5 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className={`space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex items-center gap-3">
                <div className="header-line" />
                <span className="text-sm font-mono text-foreground/50 uppercase tracking-widest">Leadership</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground leading-tight">
                Building the Future of Quantum Computing
              </h1>
              <p className="text-xl text-foreground/60 max-w-2xl leading-relaxed">
                Meet the visionary team behind Optimus. Experts in quantum algorithms, enterprise architecture, and human-centered design working to democratize quantum computing.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section ref={sectionRef} className={`relative py-24 px-6 lg:px-8 section-visible`}>
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className={`mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">Leadership Team</h2>
              <p className="text-lg text-foreground/60">
                Collective expertise spanning quantum computing, machine learning, and enterprise software.
              </p>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={member.id}
                  className={`team-card transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Team Member Image */}
                  <div className="team-image-container">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="team-image"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      priority={index < 2}
                    />
                    <div className="team-image-overlay">
                      <div className="team-overlay-content">
                        <p className="font-medium leading-relaxed">{member.fullBio}</p>
                      </div>
                    </div>
                  </div>

                  {/* Team Member Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl font-medium text-foreground leading-tight">
                        {member.name}
                      </h3>
                      <p className="text-sm text-foreground/70 mt-1">{member.role}</p>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-foreground/60 leading-relaxed">
                      {member.bio}
                    </p>

                    {/* Expertise Badges */}
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill) => (
                        <span key={skill} className="expertise-badge">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-4 pt-4 border-t border-foreground/10">
                      <a
                        href={`mailto:${member.email}`}
                        className="social-link hover:text-foreground"
                        aria-label="Email"
                        title={member.email}
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                      <a
                        href={member.linkedin}
                        className="social-link hover:text-foreground"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                      <a
                        href={member.twitter}
                        className="social-link hover:text-foreground"
                        aria-label="Twitter"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="relative py-24 px-6 lg:px-8 border-t border-foreground/5">
          <div className="max-w-4xl mx-auto">
            <div className={`text-center space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">Our Mission</h2>
              <p className="text-xl text-foreground/60 leading-relaxed">
                We believe quantum computing is not just the future—it's the present. Our mission is to bridge the gap between quantum research and real-world enterprise applications, empowering organizations to solve previously unsolvable problems.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                {[
                  { title: 'Innovation', desc: 'Pioneering quantum algorithms and hybrid systems' },
                  { title: 'Accessibility', desc: 'Making quantum computing simple and intuitive' },
                  { title: 'Impact', desc: 'Solving real-world problems at enterprise scale' },
                ].map((item) => (
                  <div key={item.title} className="space-y-3">
                    <h3 className="text-lg font-medium text-foreground">{item.title}</h3>
                    <p className="text-foreground/60">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 px-6 lg:px-8 border-t border-foreground/5">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Join Our Team</h2>
            <p className="text-lg text-foreground/60">
              We're always looking for talented individuals passionate about quantum computing and enterprise software.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-3 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-all duration-300"
              >
                Get in Touch
              </Link>
              <Link
                href="/"
                className="px-8 py-3 border border-foreground/20 text-foreground rounded-lg font-medium hover:border-foreground/40 transition-all duration-300"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
