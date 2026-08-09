'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ArrowLeft, ZoomIn, Calendar, MapPin, Sparkles } from 'lucide-react';

export interface GalleryItem {
  id: string | number;
  src: string;
  alt: string;
  event: string;
  date: string;
  location: string;
  span?: string;
  featured?: boolean;
}

const defaultGalleryImages: GalleryItem[] = [
  {
    id: 'g-1',
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    alt: 'QNI National Hackathon 2025',
    event: 'QNI National Hackathon 2025',
    date: 'Sep 2025',
    location: 'T-Hub, Hyderabad',
    span: 'col-span-2 row-span-2',
    featured: true,
  },
  {
    id: 'g-2',
    src: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&auto=format&fit=crop&q=80',
    alt: 'Quantum Workshop Bengaluru 2025',
    event: 'Intro to Qiskit Workshop',
    date: 'Jun 2025',
    location: 'IISc, Bengaluru',
    span: '',
    featured: false,
  },
  {
    id: 'g-3',
    src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80',
    alt: 'Research Collaboration Session',
    event: 'Research Collaboration Day',
    date: 'May 2025',
    location: 'IIT Madras',
    span: '',
    featured: false,
  },
  {
    id: 'g-4',
    src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80',
    alt: 'Mentor Panel Session',
    event: 'Careers in Quantum Panel',
    date: 'Apr 2025',
    location: 'Online',
    span: 'col-span-2',
    featured: false,
  },
  {
    id: 'g-5',
    src: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=80',
    alt: 'QNI Summit 2024 Keynote',
    event: 'QNI Summit 2024',
    date: 'Dec 2024',
    location: 'IIT Delhi',
    span: '',
    featured: false,
  },
  {
    id: 'g-6',
    src: 'https://images.unsplash.com/photo-1528901166007-3784c7dd3653?w=600&auto=format&fit=crop&q=80',
    alt: 'Community Hackathon Awards',
    event: 'Hackathon Awards Night',
    date: 'Nov 2024',
    location: 'T-Hub, Hyderabad',
    span: '',
    featured: false,
  },
  {
    id: 'g-7',
    src: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=800&auto=format&fit=crop&q=80',
    alt: 'Team building workshop',
    event: 'QNI Chapter Meet Delhi',
    date: 'Oct 2024',
    location: 'New Delhi',
    span: 'col-span-2 row-span-2',
    featured: true,
  },
  {
    id: 'g-8',
    src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop&q=80',
    alt: 'Presentation at conference',
    event: 'Variational Algorithms Seminar',
    date: 'Aug 2024',
    location: 'Online',
    span: '',
    featured: false,
  },
  {
    id: 'g-9',
    src: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=600&auto=format&fit=crop&q=80',
    alt: 'Networking session at event',
    event: 'Developer Networking Night',
    date: 'Jul 2024',
    location: 'Mumbai',
    span: '',
    featured: false,
  },
  {
    id: 'g-10',
    src: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&auto=format&fit=crop&q=80',
    alt: 'Research lab visit',
    event: 'C-DAC Lab Tour',
    date: 'Jun 2024',
    location: 'Pune',
    span: 'col-span-2',
    featured: false,
  },
];

interface Props {
  detectedImages: string[];
}

export default function GalleryPageClient({ detectedImages }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<GalleryItem | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (lightboxImg) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxImg]);

  // Convert auto-detected folder images into Gallery Items
  const autoDetectedItems: GalleryItem[] = detectedImages.map((imgPath, idx) => {
    const filename = imgPath.split('/').pop() || `Image ${idx + 1}`;
    const cleanName = filename
      .replace(/\.[^.]+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
      id: `auto-${idx}`,
      src: imgPath,
      alt: cleanName,
      event: cleanName,
      date: 'Detected Event',
      location: 'QNG Platform',
      span: idx % 5 === 0 ? 'col-span-2 row-span-2' : idx % 3 === 0 ? 'col-span-2' : '',
      featured: idx % 5 === 0,
    };
  });

  // Combine auto-detected local images with default online gallery items
  const allImages = [...autoDetectedItems, ...defaultGalleryImages];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-foreground/10 bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <span className="font-mono text-xs text-foreground/40 tracking-widest uppercase">QNexus Global / Gallery</span>
        </div>
      </div>

      {/* Header */}
      <div className={`pt-32 pb-16 px-6 max-w-7xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <span className="inline-flex items-center gap-3 text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
          <span className="w-8 h-px bg-foreground/30" /> Our Moments
        </span>
        <h1 className="text-5xl lg:text-8xl font-display tracking-tight mb-4 leading-[0.95]">Gallery</h1>
        <p className="text-lg text-foreground/55 max-w-xl">
          Highlights from Quantum Nexus Global events, research workshops, hackathons, and community gatherings worldwide.
        </p>

        {/* Auto Detection Status Banner */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-foreground/60 bg-foreground/5 p-4 rounded-2xl border border-foreground/10">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Sparkles className="w-4 h-4" /> Auto Image Detection Active
          </div>
          <span>•</span>
          <span>{allImages.length} Total Photos</span>
          <span>•</span>
          <span>{autoDetectedItems.length} Auto-Detected Local Files</span>
          <span>•</span>
          <span className="text-muted-foreground">Place new photos in <code>/public/gallery</code> or <code>/public/speakers</code></span>
        </div>
      </div>

      {/* Masonry-style Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[220px]">
          {allImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => setLightboxImg(img)}
              className={`relative group overflow-hidden rounded-2xl cursor-pointer ${img.span} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } transition-all duration-500`}
              style={{ transitionDelay: `${idx * 30}ms` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <ZoomIn className="absolute top-4 right-4 w-5 h-5 text-white/80" />
                <p className="text-white font-semibold text-sm leading-snug">{img.event}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-white/70 text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {img.date}
                  </span>
                  <span className="text-white/70 text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {img.location}
                  </span>
                </div>
              </div>
              {img.featured && (
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-black text-[10px] font-mono font-bold rounded-full shadow-md">
                  FEATURED
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImg(null)}
        >
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="max-w-5xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImg.src}
              alt={lightboxImg.alt}
              className="rounded-2xl object-contain max-h-[75vh] w-full"
            />
            <div className="mt-4 text-center">
              <p className="text-white font-semibold text-lg">{lightboxImg.event}</p>
              <div className="flex items-center justify-center gap-4 mt-1 text-white/60 text-sm">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {lightboxImg.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {lightboxImg.location}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
