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
    bio: 'Quantum computing visionary',
    fullBio: 'Strategic leader with 15+ years building quantum solutions for enterprises. Published 40+ papers on quantum algorithms.',
    expertise: ['Quantum Circuits', 'Enterprise Strategy', 'Research'],
    email: 'sharvan@qni.com',
    linkedin: '#',
    twitter: '#',
  },
  {
    id: '2',
    name: 'Rajan Jha',
    role: 'CTO & Co-Founder',
    image: '/team/rajan-jha.png',
    bio: 'Quantum ML systems architect',
    fullBio: 'Technical architect specializing in hybrid quantum-classical systems. Expert in error mitigation on NISQ devices.',
    expertise: ['Quantum ML', 'System Architecture', 'Error Mitigation'],
    email: 'rajan@qni.com',
    linkedin: '#',
    twitter: '#',
  },
  {
    id: '3',
    name: 'Subham',
    role: 'Lead Quantum Algorithm Engineer',
    image: '/team/subham.png',
    bio: 'VQE & QAOA specialist',
    fullBio: 'Expert in variational quantum algorithms. Improved circuit depth reduction by 40% on NISQ devices.',
    expertise: ['VQE', 'QAOA', 'Circuit Optimization'],
    email: 'subham@qni.com',
    linkedin: '#',
    twitter: '#',
  },
  {
    id: '4',
    name: 'Myank',
    role: 'Head of Product & Design',
    image: '/team/myank.png',
    bio: 'UX architect for quantum tools',
    fullBio: 'Product strategist making quantum computing intuitive. Led design of enterprise dashboard serving 500+ users.',
    expertise: ['Product Strategy', 'UX Design', 'User Research'],
    email: 'myank@qni.com',
    linkedin: '#',
    twitter: '#',
  },
  {
    id: '5',
    name: 'Aisha Patel',
    role: 'Senior Quantum Researcher',
    image: '/team/aisha-patel.png',
    bio: 'Quantum simulation expert',
    fullBio: 'Research lead focusing on quantum simulation algorithms. Specializes in noise modeling and error analysis.',
    expertise: ['Simulation', 'Noise Modeling', 'Algorithm Design'],
    email: 'aisha@qni.com',
    linkedin: '#',
    twitter: '#',
  },
  {
    id: '6',
    name: 'Rajesh Kumar',
    role: 'Backend Systems Engineer',
    image: '/team/rajesh-kumar.png',
    bio: 'Distributed systems engineer',
    fullBio: 'Builds scalable backend infrastructure for quantum workloads. Handles petabyte-scale data processing.',
    expertise: ['Distributed Systems', 'Backend', 'Cloud Infra'],
    email: 'rajesh@qni.com',
    linkedin: '#',
    twitter: '#',
  },
  {
    id: '7',
    name: 'Priya Singh',
    role: 'ML Operations Manager',
    image: '/team/priya-singh.png',
    bio: 'MLOps and deployment specialist',
    fullBio: 'Manages quantum ML pipeline infrastructure. Ensures 99.99% uptime for production quantum services.',
    expertise: ['MLOps', 'Pipeline', 'Deployment'],
    email: 'priya@qni.com',
    linkedin: '#',
    twitter: '#',
  },
  {
    id: '8',
    name: 'Vikram Singh',
    role: 'DevOps & Cloud Architect',
    image: '/team/vikram-singh.png',
    bio: 'Cloud infrastructure expert',
    fullBio: 'Architected multi-region quantum computing infrastructure. Expert in quantum hardware integration.',
    expertise: ['DevOps', 'Cloud Architecture', 'Hardware Integration'],
    email: 'vikram@qni.com',
    linkedin: '#',
    twitter: '#',
  },
];

const teamStyles = `
  .team-card {
    position: relative;
    overflow: hidden;
    border-radius: 0.5rem;
    aspect-ratio: 1;
    cursor: pointer;
  }

  .team-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .team-card:hover .team-image {
    transform: scale(1.08);
  }

  .team-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 100%);
    opacity: 0;
    transition: opacity 0.5s ease;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 1.5rem;
  }

  .team-card:hover .team-overlay {
    opacity: 1;
  }

  .team-info {
    color: white;
    text-align: left;
  }

  .team-name {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    letter-spacing: -0.5px;
  }

  .team-role {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 0.75rem;
  }

  .team-bio {
    font-size: 0.8125rem;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 1rem;
  }

  .team-expertise {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .expertise-tag {
    display: inline-block;
    font-size: 0.7rem;
    padding: 0.25rem 0.5rem;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.25rem;
    color: rgba(255, 255, 255, 0.8);
  }

  .team-socials {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .social-icon {
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.375rem;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .social-icon:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
  }

  .team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    animation: fadeIn 0.6s ease-out;
  }

  @media (max-width: 768px) {
    .team-grid {
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 1rem;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default function TeamPage() {
  const [isVisible, setIsVisible] = useState(false);
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
    <div className="min-h-screen bg-background noise-overlay">
      <style>{teamStyles}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-foreground/5 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <span className="font-display text-2xl font-bold text-foreground">QNI</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Our Team
            </span>
          </div>
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground leading-tight">
              Meet the Minds Building Quantum Nexus India
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A diverse team of quantum researchers, engineers, and designers pushing the boundaries of quantum computing technology.
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section ref={sectionRef} className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
        <div className={`team-grid transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="team-card border border-foreground/10 hover:border-foreground/30 transition-colors"
              style={{
                animation: isVisible ? `fadeIn 0.6s ease-out ${index * 50}ms forwards` : 'none',
                opacity: 0,
              }}
            >
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="team-image"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              
              <div className="team-overlay">
                <div className="team-info">
                  <div className="team-name">{member.name}</div>
                  <div className="team-role">{member.role}</div>
                  <div className="team-bio">{member.bio}</div>
                  <div className="team-expertise">
                    {member.expertise.map((skill) => (
                      <span key={skill} className="expertise-tag">{skill}</span>
                    ))}
                  </div>
                  <div className="team-socials">
                    <a
                      href={`mailto:${member.email}`}
                      className="social-icon hover:opacity-100"
                      title="Email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={member.linkedin}
                      className="social-icon hover:opacity-100"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={member.twitter}
                      className="social-icon hover:opacity-100"
                      title="Twitter"
                    >
                      <Twitter className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <div className="border-t border-foreground/10 pt-16">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Join Our Mission
            </h2>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              We're always looking for talented individuals passionate about quantum computing. Whether you're a researcher, engineer, or designer, there's a place for you at QNI.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/contact"
                className="px-6 py-3 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-colors"
              >
                Get In Touch
              </Link>
              <Link
                href="/"
                className="px-6 py-3 border border-foreground/20 text-foreground rounded-lg font-medium hover:border-foreground/40 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
