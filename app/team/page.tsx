'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Linkedin, Twitter, ArrowLeft } from 'lucide-react';

const teamMembers = [
  {
    id: '1',
    name: 'Sharvan Kumar Sharma',
    role: 'CEO & Co-Founder',
    image: '/team/sharvan-kumar-sharma.png',
    category: 'Leadership',
    bio: 'Quantum computing visionary with 15+ years of enterprise experience',
    expertise: ['Quantum Circuits', 'Enterprise Strategy', 'Research'],
  },
  {
    id: '2',
    name: 'Rajan Jha',
    role: 'CTO & Co-Founder',
    image: '/team/rajan-jha.png',
    category: 'Leadership',
    bio: 'Technical architect specializing in hybrid quantum-classical systems',
    expertise: ['Quantum ML', 'System Architecture', 'Error Mitigation'],
  },
  {
    id: '3',
    name: 'Subham',
    role: 'Lead Quantum Algorithm Engineer',
    image: '/team/subham.png',
    category: 'Engineering',
    bio: 'Expert in variational quantum algorithms and circuit optimization',
    expertise: ['VQE', 'QAOA', 'Circuit Optimization'],
  },
  {
    id: '4',
    name: 'Myank',
    role: 'Head of Product & Design',
    image: '/team/myank.png',
    category: 'Product',
    bio: 'Product strategist making quantum computing intuitive',
    expertise: ['Product Strategy', 'UX Design', 'User Research'],
  },
  {
    id: '5',
    name: 'Aisha Patel',
    role: 'Senior Quantum Researcher',
    image: '/team/aisha-patel.png',
    category: 'Research',
    bio: 'Research lead focusing on quantum simulation algorithms',
    expertise: ['Simulation', 'Noise Modeling', 'Algorithm Design'],
  },
  {
    id: '6',
    name: 'Rajesh Kumar',
    role: 'Backend Systems Engineer',
    image: '/team/rajesh-kumar.png',
    category: 'Engineering',
    bio: 'Builds scalable backend infrastructure for quantum workloads',
    expertise: ['Distributed Systems', 'Backend', 'Cloud Infra'],
  },
  {
    id: '7',
    name: 'Priya Singh',
    role: 'ML Operations Manager',
    image: '/team/priya-singh.png',
    category: 'Operations',
    bio: 'Optimizes machine learning pipelines and deployment workflows',
    expertise: ['ML Ops', 'DevOps', 'Cloud Architecture'],
  },
  {
    id: '8',
    name: 'Vikram Singh',
    role: 'DevOps & Cloud Architect',
    image: '/team/vikram-singh.png',
    category: 'Infrastructure',
    bio: 'Designs and maintains scalable cloud infrastructure',
    expertise: ['Cloud Architecture', 'Infrastructure', 'DevOps'],
  },
];

const categories = ['All', 'Leadership', 'Engineering', 'Research', 'Product', 'Operations', 'Infrastructure'];

export default function TeamPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const filteredMembers =
    selectedCategory === 'All'
      ? teamMembers
      : teamMembers.filter((member) => member.category === selectedCategory);

  const teamPageStyles = `
    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
      animation: fadeInUp 0.6s ease;
    }

    @media (max-width: 1024px) {
      .team-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .team-grid {
        grid-template-columns: 1fr;
      }
    }

    .team-card {
      position: relative;
      overflow: hidden;
      border-radius: 0.5rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .team-card:hover {
      border-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-4px);
    }

    .team-card-image {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      overflow: hidden;
      background: linear-gradient(135deg, rgba(18, 18, 18, 0.8), rgba(45, 45, 45, 0.6));
    }

    .team-card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .team-card:hover .team-card-image img {
      transform: scale(1.08);
    }

    .team-card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.8) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 1.5rem;
    }

    .team-card:hover .team-card-overlay {
      opacity: 1;
    }

    .team-card-info {
      position: relative;
      padding: 1rem;
      background: rgba(18, 18, 18, 0.6);
      backdrop-filter: blur(4px);
    }

    .team-card-title {
      font-size: 1rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.95);
      margin-bottom: 0.25rem;
    }

    .team-card-role {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 0.75rem;
    }

    .team-card-bio {
      font-size: 0.8125rem;
      color: rgba(255, 255, 255, 0.5);
      line-height: 1.4;
      margin-bottom: 0.75rem;
    }

    .team-card-overlay-text {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.5;
    }

    .category-filter {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }

    .category-btn {
      padding: 0.5rem 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: transparent;
      color: rgba(255, 255, 255, 0.6);
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.3s ease;
    }

    .category-btn:hover,
    .category-btn.active {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.95);
      border-color: rgba(255, 255, 255, 0.3);
    }

    @keyframes fadeInUp {
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

  return (
    <div className="min-h-screen bg-background">
      <style>{teamPageStyles}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-filter border-b border-foreground/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display text-xl tracking-tight">QNI</span>
            <span className="text-muted-foreground font-mono text-xs">Quantum</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
            >
              <h1 className="font-display text-4xl tracking-tight mb-2">Meet Our Team</h1>
              <p className="text-foreground/60 text-sm mb-8">
                Brilliant minds advancing quantum computing and artificial intelligence
              </p>

              <div className="sticky top-24 space-y-6">
                <div>
                  <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3">
                    Filter by role
                  </p>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`category-btn w-full text-left ${
                          selectedCategory === category ? 'active' : ''
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-foreground/10">
                  <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3">
                    Team count
                  </p>
                  <p className="text-2xl font-display font-bold">{filteredMembers.length}</p>
                  <p className="text-xs text-foreground/50">members</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Grid */}
          <div className="flex-1 min-w-0">
            <div
              ref={containerRef}
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="team-grid">
                {filteredMembers.map((member, index) => (
                  <div
                    key={member.id}
                    className="team-card group"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onMouseEnter={() => setHoveredId(member.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div className="team-card-image">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="team-card-overlay">
                        <div className="team-card-overlay-text">{member.bio}</div>
                        <div className="flex gap-2 mt-3 pt-3 border-t border-white/20">
                          <a
                            href={`mailto:${member.name.toLowerCase().replace(' ', '.')}@qni.com`}
                            className="p-1.5 rounded hover:bg-white/10 transition-colors"
                            aria-label="Email"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                          <a
                            href="#"
                            className="p-1.5 rounded hover:bg-white/10 transition-colors"
                            aria-label="LinkedIn"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                          <a
                            href="#"
                            className="p-1.5 rounded hover:bg-white/10 transition-colors"
                            aria-label="Twitter"
                          >
                            <Twitter className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="team-card-info">
                      <div className="team-card-title">{member.name}</div>
                      <div className="team-card-role">{member.role}</div>
                      <div className="team-card-bio">{member.bio}</div>
                      <div className="flex flex-wrap gap-1">
                        {member.expertise.map((skill) => (
                          <span
                            key={skill}
                            className="inline-block px-2 py-0.5 text-xs rounded bg-foreground/5 text-foreground/70 border border-foreground/10"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
