"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ZoomIn, X, Calendar, MapPin } from "lucide-react";

const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&auto=format&fit=crop&q=80",
    alt: "QNI National Hackathon 2025",
    event: "QNI National Hackathon 2025",
    date: "Sep 2025",
    location: "T-Hub, Hyderabad",
    cols: "col-span-2",
    rows: "row-span-2",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&auto=format&fit=crop&q=80",
    alt: "Qiskit Workshop Bengaluru",
    event: "Intro to Qiskit Workshop",
    date: "Jun 2025",
    location: "IISC, Bengaluru",
    cols: "",
    rows: "",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=80",
    alt: "QNI Summit 2024 Keynote",
    event: "QNI Summit 2024",
    date: "Dec 2024",
    location: "IIT Delhi",
    cols: "",
    rows: "",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
    alt: "Mentor Panel Session",
    event: "Careers in Quantum Panel",
    date: "Apr 2025",
    location: "Online",
    cols: "col-span-2",
    rows: "",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80",
    alt: "Research Collaboration IIT Madras",
    event: "Research Collaboration Day",
    date: "May 2025",
    location: "IIT Madras",
    cols: "",
    rows: "",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop&q=80",
    alt: "Workshop Presentation",
    event: "Variational Algorithms Seminar",
    date: "Aug 2024",
    location: "Online",
    cols: "",
    rows: "",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?w=600&auto=format&fit=crop&q=80",
    alt: "Hackathon Awards Night",
    event: "Hackathon Awards Night",
    date: "Nov 2024",
    location: "Hyderabad",
    cols: "",
    rows: "",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=900&auto=format&fit=crop&q=80",
    alt: "Chapter Meet Delhi",
    event: "QNI Chapter Meet Delhi",
    date: "Oct 2024",
    location: "New Delhi",
    cols: "col-span-2",
    rows: "row-span-2",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop&q=80",
    alt: "Annual Gathering",
    event: "QNI Annual Gathering",
    date: "Mar 2024",
    location: "Bengaluru",
    cols: "",
    rows: "",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&auto=format&fit=crop&q=80",
    alt: "Quantum Hackathon 2024",
    event: "Quantum Hackathon 2024",
    date: "Feb 2024",
    location: "Hyderabad",
    cols: "",
    rows: "",
  },
];

export function GallerySection() {
  const [isVisible, setIsVisible] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<typeof galleryImages[0] | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (lightboxImg) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxImg]);

  return (
    <section ref={ref} className="relative py-28 lg:py-36 border-t border-foreground/10 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div>
            <span className="inline-flex items-center gap-3 text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
              <span className="w-6 h-px bg-foreground/30" />
              Our Moments
            </span>
            <h2 className="text-4xl md:text-6xl font-display tracking-tight text-foreground leading-[1.0]">
              Events in Pictures
            </h2>
            <p className="text-foreground/50 mt-3 text-base max-w-md leading-relaxed">
              Glimpses from workshops, hackathons, summits & community gatherings around the world.
            </p>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-foreground/20 text-foreground/60 hover:text-foreground hover:border-foreground/40 text-sm font-medium transition-all duration-200 group whitespace-nowrap self-start md:self-auto"
          >
            View Full Gallery
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Rich bento grid */}
        <div
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[180px] md:auto-rows-[200px] transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {galleryImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => setLightboxImg(img)}
              className={`relative group overflow-hidden rounded-2xl cursor-pointer bg-foreground/5 ${img.cols} ${img.rows}`}
              style={{ transitionDelay: `${idx * 30}ms` }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Always-visible subtle bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

              {/* Hover overlay content */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <ZoomIn className="absolute top-3 right-3 w-4 h-4 text-white/70" />
                <p className="text-white font-semibold text-sm leading-tight">{img.event}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-white/60 text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />{img.date}
                  </span>
                  <span className="text-white/60 text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{img.location}
                  </span>
                </div>
              </div>

              {/* Always-visible bottom caption on large spans */}
              {(img.cols === 'col-span-2' && img.rows === 'row-span-2') && (
                <div className="absolute bottom-4 left-4">
                  <p className="text-white/90 font-semibold text-base leading-tight drop-shadow">{img.event}</p>
                  <p className="text-white/60 text-xs mt-0.5">{img.location} · {img.date}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div
          className={`mt-10 pt-8 border-t border-foreground/10 grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {[
            { value: "Free", label: "To Attend" },
            { value: "2026", label: "Launch Year" },
            { value: "Global", label: "Open Community" },
            { value: "Student-Led", label: "Always" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="font-mono text-xs text-foreground/40 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImg(null)}
        >
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="max-w-5xl w-full flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImg.src}
              alt={lightboxImg.alt}
              className="rounded-2xl object-contain max-h-[75vh] w-full"
            />
            <div className="mt-4 text-center">
              <p className="text-white font-semibold text-lg">{lightboxImg.event}</p>
              <div className="flex items-center justify-center gap-4 mt-1.5 text-white/50 text-sm">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{lightboxImg.date}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{lightboxImg.location}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
