"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, Linkedin, Twitter, X } from "lucide-react";
import Image from "next/image";

const speakers = [
  {
    id: "1",
    name: "Alex Chen",
    role: "AI Infrastructure Lead",
    company: "Optimus Core",
    bio: "Pioneering scalable AI systems",
    image: "/speakers/alex-chen.png",
    fullBio: "With 10+ years in distributed systems and ML infrastructure, Alex leads the technical architecture at Optimus, ensuring scalability and reliability for enterprise deployments.",
    expertise: ["ML Ops", "Distributed Systems", "DevOps"],
    social: {
      twitter: "#",
      linkedin: "#",
      email: "#",
    },
  },
  {
    id: "2",
    name: "Jordan Williams",
    role: "Security Architect",
    company: "Optimus Security",
    bio: "Enterprise security at scale",
    image: "/speakers/jordan-williams.png",
    fullBio: "Jordan brings 15+ years of cybersecurity expertise, specializing in zero-trust architectures and compliance frameworks for global enterprises at scale.",
    expertise: ["Cloud Security", "Zero Trust", "Compliance"],
    social: {
      twitter: "#",
      linkedin: "#",
      email: "#",
    },
  },
  {
    id: "3",
    name: "Priya Patel",
    role: "Developer Relations",
    company: "Optimus DevX",
    bio: "Crafting exceptional developer experiences",
    image: "/speakers/priya-patel.png",
    fullBio: "Priya has built developer communities from the ground up, focusing on creating intuitive APIs and tools that empower developers to build faster and smarter.",
    expertise: ["API Design", "Developer Tools", "Community"],
    social: {
      twitter: "#",
      linkedin: "#",
      email: "#",
    },
  },
  {
    id: "4",
    name: "Marcus Rodriguez",
    role: "Performance Engineer",
    company: "Optimus Performance",
    bio: "Optimizing for speed and efficiency",
    image: "/speakers/marcus-rodriguez.png",
    fullBio: "Marcus specializes in performance optimization and benchmarking, helping teams squeeze every millisecond out of their infrastructure and applications.",
    expertise: ["Performance", "Benchmarking", "Optimization"],
    social: {
      twitter: "#",
      linkedin: "#",
      email: "#",
    },
  },
];

const speakerAnimationStyles = `
  .speaker-card {
    position: relative;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .speaker-card:hover {
    transform: translateY(-8px);
  }
  
  .speaker-image-container {
    position: relative;
    width: 100%;
    aspect-ratio: 3/4;
    overflow: hidden;
    border-radius: 0.5rem;
    cursor: pointer;
    margin-bottom: 1.5rem;
  }
  
  .speaker-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .speaker-card:hover .speaker-image {
    transform: scale(1.05);
  }
  
  .speaker-image-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
    display: flex;
    align-items: flex-end;
    padding: 1.5rem;
  }
  
  .speaker-card:hover .speaker-image-overlay {
    opacity: 1;
  }
  
  .speaker-overlay-content {
    width: 100%;
    color: white;
    font-size: 0.875rem;
    line-height: 1.5;
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
  
  .speaker-card:hover .expertise-badge {
    border-color: rgba(255, 255, 255, 0.3);
    color: rgba(255, 255, 255, 0.8);
  }
  
  .social-icon {
    width: 1.25rem;
    height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    opacity: 0.6;
  }
  
  .social-icon:hover {
    opacity: 1;
  }
`;

export function SpeakersSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="speakers"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden border-t border-foreground/10"
    >
      <style dangerouslySetInnerHTML={{ __html: speakerAnimationStyles }} />
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-16">
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Featured speakers
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-6">
              Meet our
              <br />
              <span className="text-muted-foreground">expert speakers</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Industry leaders and visionaries sharing their insights on building the future of AI infrastructure and development platforms.
            </p>
          </div>
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {speakers.map((speaker, index) => (
            <div
              key={speaker.id}
              className={`speaker-card transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Speaker Image with Hover Overlay */}
              <div className="speaker-image-container">
                <Image
                  src={speaker.image}
                  alt={speaker.name}
                  fill
                  className="speaker-image"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="speaker-image-overlay">
                  <div className="speaker-overlay-content">
                    <p className="font-medium mb-2">{speaker.fullBio}</p>
                  </div>
                </div>
              </div>

              {/* Speaker Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground leading-tight">
                    {speaker.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{speaker.role}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">{speaker.company}</p>
                </div>

                {/* Bio */}
                <p className="text-sm text-muted-foreground italic">
                  &quot;{speaker.bio}&quot;
                </p>

                {/* Expertise Badges */}
                <div className="flex flex-wrap gap-2">
                  {speaker.expertise.map((skill) => (
                    <span key={skill} className="expertise-badge">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-3 pt-4 border-t border-foreground/10">
                  <a
                    href={speaker.social.email}
                    className="social-icon hover:text-foreground"
                    aria-label="Email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                  <a
                    href={speaker.social.linkedin}
                    className="social-icon hover:text-foreground"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={speaker.social.twitter}
                    className="social-icon hover:text-foreground"
                    aria-label="Twitter"
                  >
                    <X className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security Badge */}
        <div
          className={`mt-16 p-8 border border-foreground/10 rounded-lg bg-foreground/[0.02] transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">🔒 Security & Privacy</h3>
              <p className="text-muted-foreground">
                All speaker information is handled with enterprise-grade security. Your data is encrypted and never shared with third parties.
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-display text-foreground">Enterprise Grade</p>
              <p className="text-sm text-muted-foreground">End-to-end encryption</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
