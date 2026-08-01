'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Calendar, MapPin, Users } from 'lucide-react';

const allEvents = [
  {
    id: '1',
    title: 'Optimus Summit 2024',
    date: 'Oct 15 - Oct 17',
    startDate: new Date('2024-10-15'),
    location: 'San Francisco, CA',
    description: 'Join industry leaders and innovators for three days of talks, workshops, and networking.',
    fullDescription: 'The premier event for quantum ML professionals, featuring keynotes from industry leaders, hands-on workshops, and networking opportunities.',
    status: 'Upcoming',
    attendees: '2,500+',
    category: 'Conference',
    speakers: ['Alex Chen', 'Jordan Williams', 'Priya Patel'],
  },
  {
    id: '2',
    title: 'Developer Workshop Series',
    date: 'Every Wednesday',
    startDate: new Date('2024-09-01'),
    location: 'Online',
    description: 'Weekly hands-on workshops covering AI workflows, deployment strategies, and best practices.',
    fullDescription: 'Weekly online sessions designed for developers wanting to master quantum ML infrastructure and deployment patterns.',
    status: 'Recurring',
    attendees: '500+',
    category: 'Workshop',
    speakers: ['Marcus Rodriguez'],
  },
  {
    id: '3',
    title: 'Enterprise Bootcamp',
    date: 'Nov 1 - Nov 5',
    startDate: new Date('2024-11-01'),
    location: 'New York, NY',
    description: 'Intensive five-day program for enterprise teams looking to scale their AI operations.',
    fullDescription: 'A comprehensive bootcamp for enterprise teams covering scaling, security, compliance, and production deployment of quantum ML systems.',
    status: 'Limited Seats',
    attendees: '100',
    category: 'Bootcamp',
    speakers: ['Alex Chen', 'Jordan Williams'],
  },
  {
    id: '4',
    title: 'Global Community Meetup',
    date: 'Monthly',
    startDate: new Date('2024-09-15'),
    location: 'Multiple Cities',
    description: 'Connect with fellow developers and share your experiences using Optimus in production.',
    fullDescription: 'Monthly gatherings across the globe where developers share real-world experiences, best practices, and build lasting connections.',
    status: 'Ongoing',
    attendees: '1,000+',
    category: 'Meetup',
    speakers: [],
  },
  {
    id: '5',
    title: 'Advanced Quantum ML Training',
    date: 'Dec 1 - Dec 15',
    startDate: new Date('2024-12-01'),
    location: 'Mountain View, CA',
    description: 'Deep dive into quantum machine learning algorithms and production optimization techniques.',
    fullDescription: 'Intensive two-week certification program covering advanced quantum ML algorithms, optimization, and real-world applications.',
    status: 'Upcoming',
    attendees: '50',
    category: 'Training',
    speakers: ['Priya Patel', 'Marcus Rodriguez'],
  },
  {
    id: '6',
    title: 'Security & Compliance Summit',
    date: 'Oct 28 - Oct 29',
    startDate: new Date('2024-10-28'),
    location: 'Boston, MA',
    description: 'Comprehensive coverage of security best practices and compliance frameworks for AI infrastructure.',
    fullDescription: 'Expert-led sessions on zero-trust architectures, compliance certifications, and security protocols for enterprise AI deployments.',
    status: 'Upcoming',
    attendees: '300+',
    category: 'Summit',
    speakers: ['Jordan Williams'],
  },
  {
    id: '7',
    title: 'Community Hackathon',
    date: 'Nov 10 - Nov 12',
    startDate: new Date('2024-11-10'),
    location: 'Online',
    description: 'Build innovative quantum ML solutions with the community and compete for prizes.',
    fullDescription: '48-hour online hackathon where developers build quantum ML applications, with mentorship from Optimus engineers and exciting prizes.',
    status: 'Upcoming',
    attendees: '1,500+',
    category: 'Hackathon',
    speakers: [],
  },
  {
    id: '8',
    title: 'AI Infrastructure Masterclass',
    date: 'Sept 15 - Sept 16',
    startDate: new Date('2024-09-15'),
    location: 'Austin, TX',
    description: 'Learn scaling strategies from industry experts and Optimus architects.',
    fullDescription: 'Two-day masterclass covering infrastructure design, scaling strategies, and best practices for production AI systems.',
    status: 'Happening Now',
    attendees: '200',
    category: 'Workshop',
    speakers: ['Alex Chen', 'Marcus Rodriguez'],
  },
];

const categories = ['All', 'Conference', 'Workshop', 'Bootcamp', 'Meetup', 'Training', 'Summit', 'Hackathon'];

function EventCard({ event, index }: { event: typeof allEvents[0]; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const statusColors = {
    'Upcoming': 'bg-green-400/10 text-green-400 border-green-400/20',
    'Limited Seats': 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
    'Ongoing': 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    'Recurring': 'bg-purple-400/10 text-purple-400 border-purple-400/20',
    'Happening Now': 'bg-red-400/10 text-red-400 border-red-400/20',
  };

  return (
    <div
      ref={cardRef}
      className={`group transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <Link href={`/events/${event.id}`}>
        <div className="h-full border border-foreground/10 rounded-xl p-6 lg:p-8 bg-background/40 hover:bg-background/80 hover:border-foreground/20 transition-all duration-500 hover:shadow-xl cursor-pointer">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className={`text-xs font-mono px-3 py-1 rounded border ${statusColors[event.status as keyof typeof statusColors] || 'bg-foreground/5 text-foreground/60 border-foreground/10'}`}>
                  {event.status}
                </span>
                <span className="text-xs font-mono text-foreground/40 bg-foreground/5 px-3 py-1 rounded">
                  {event.category}
                </span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl lg:text-2xl font-display mb-3 group-hover:translate-x-1 transition-transform duration-300 line-clamp-2">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-foreground/60 text-sm mb-6 line-clamp-2">
            {event.description}
          </p>

          {/* Details */}
          <div className="space-y-3 mb-6 pb-6 border-t border-foreground/10">
            <div className="flex items-center gap-3 text-sm mt-4">
              <Calendar className="w-4 h-4 text-foreground/40" />
              <span className="text-foreground/80">{event.date}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-foreground/40" />
              <span className="text-foreground/80">{event.location}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Users className="w-4 h-4 text-foreground/40" />
              <span className="text-foreground/80">{event.attendees} attendees</span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 text-sm font-medium text-foreground group-hover:translate-x-1 transition-transform duration-300">
            View Details
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function EventsListPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isVisible, setIsVisible] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const filteredEvents = selectedCategory === 'All'
    ? allEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    : allEvents.filter((event) => event.category === selectedCategory)
        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  return (
    <div ref={pageRef} className="min-h-screen bg-background">
      {/* Navigation Back */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            <span>←</span> Back to home
          </a>
        </div>
      </div>

      {/* Header */}
      <div className="pt-32 pb-20 border-b border-foreground/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Community
            </span>
            <h1 className="text-5xl lg:text-7xl font-display tracking-tight mb-6">
              All Events
            </h1>
            <p className="text-lg text-foreground/60 max-w-2xl leading-relaxed">
              Explore our comprehensive calendar of conferences, workshops, bootcamps, and networking events designed for quantum ML professionals worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-20 z-40 border-b border-foreground/10 bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <span className="text-sm font-mono text-foreground/50 uppercase tracking-wider whitespace-nowrap">
              Filter:
            </span>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap text-sm ${
                    selectedCategory === category
                      ? 'bg-foreground text-background'
                      : 'border border-foreground/10 text-foreground/60 hover:text-foreground hover:border-foreground/30'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {filteredEvents.length > 0 ? (
            <>
              <div className="mb-8 text-sm text-foreground/60">
                Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredEvents.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-foreground/60 mb-4">
                No events found in this category.
              </p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="px-6 py-2 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-all duration-300"
              >
                View All Events
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
