'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Users, Clock, Share2 } from 'lucide-react';

const eventDetails: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Optimus Summit 2024',
    date: 'October 15 - 17, 2024',
    time: '9:00 AM - 5:00 PM PST',
    location: 'San Francisco, CA',
    venue: 'Moscone Center, San Francisco',
    description: 'Join industry leaders and innovators for three days of talks, workshops, and networking.',
    status: 'Upcoming',
    attendees: '2,500+',
    fullDescription: `The Optimus Summit 2024 is the premier event for AI infrastructure builders and platform engineers. Over three days, you'll experience cutting-edge talks from industry leaders, hands-on workshops covering real-world implementations, and extensive networking opportunities.

This year's summit features keynotes from top AI researchers, breakout sessions on scaling AI workloads, and exclusive roundtables with enterprise architects. Whether you're building AI applications or managing infrastructure at scale, this summit offers invaluable insights and connections.`,
    schedule: [
      {
        day: 'Day 1: October 15',
        events: [
          { time: '9:00 AM', title: 'Opening Keynote: The Future of AI Infrastructure', speaker: 'Sarah Chen' },
          { time: '10:30 AM', title: 'Coffee Break & Networking', speaker: '' },
          { time: '11:00 AM', title: 'Parallel Track 1: Scaling LLMs in Production', speaker: 'Alex Chen' },
          { time: '12:30 PM', title: 'Lunch', speaker: '' },
          { time: '2:00 PM', title: 'Parallel Track 2: Building Secure AI Systems', speaker: 'Jordan Williams' },
          { time: '3:30 PM', title: 'Afternoon Break', speaker: '' },
          { time: '4:00 PM', title: 'Community Showcase', speaker: 'Various' },
        ]
      },
      {
        day: 'Day 2: October 16',
        events: [
          { time: '9:00 AM', title: 'Keynote: Enterprise AI Adoption Strategies', speaker: 'Michael Zhang' },
          { time: '10:30 AM', title: 'Workshop: Deploying with Optimus', speaker: 'Priya Patel' },
          { time: '12:00 PM', title: 'Lunch', speaker: '' },
          { time: '1:00 PM', title: 'Panel Discussion: Challenges in AI Operations', speaker: 'Panel' },
          { time: '2:30 PM', title: 'Breakout Sessions (Multiple topics)', speaker: 'Various' },
        ]
      },
      {
        day: 'Day 3: October 17',
        events: [
          { time: '9:00 AM', title: 'Advanced Workshop: Performance Optimization', speaker: 'Marcus Rodriguez' },
          { time: '11:00 AM', title: 'Final Keynote: The Road Ahead', speaker: 'Industry Visionary' },
          { time: '12:00 PM', title: 'Closing Reception & Networking Lunch', speaker: '' },
        ]
      }
    ],
    speakers: ['Alex Chen', 'Jordan Williams', 'Priya Patel', 'Marcus Rodriguez'],
    price: 'Early Bird: $299 | Regular: $399 | VIP: $799',
  },
  '2': {
    id: '2',
    title: 'Developer Workshop Series',
    date: 'Every Wednesday',
    time: '2:00 PM - 3:30 PM PST',
    location: 'Online',
    venue: 'Zoom',
    description: 'Weekly hands-on workshops covering AI workflows, deployment strategies, and best practices.',
    status: 'Recurring',
    attendees: '500+',
    fullDescription: `Join our weekly Developer Workshop Series to master the essentials of building with Optimus. Each week features a different topic, from foundational concepts to advanced techniques. These hands-on sessions are perfect for developers at all levels who want to stay updated with the latest practices.

Recordings are available for all sessions, so you can catch up on any sessions you miss.`,
    schedule: [
      {
        day: 'This Week\'s Topic',
        events: [
          { time: '2:00 PM', title: 'Getting Started with Optimus SDK', speaker: 'Priya Patel' },
          { time: '2:15 PM', title: 'Live Coding Demo', speaker: 'Priya Patel' },
          { time: '3:00 PM', title: 'Q&A Session', speaker: '' },
          { time: '3:30 PM', title: 'Session Ends', speaker: '' },
        ]
      }
    ],
    speakers: ['Priya Patel', 'Marcus Rodriguez', 'Various Engineers'],
    price: 'Free',
  },
  '3': {
    id: '3',
    title: 'Enterprise Bootcamp',
    date: 'November 1 - 5, 2024',
    time: '9:00 AM - 5:00 PM EST',
    location: 'New York, NY',
    venue: 'Enterprise Training Center, Manhattan',
    description: 'Intensive five-day program for enterprise teams looking to scale their AI operations.',
    status: 'Limited Seats',
    attendees: '100',
    fullDescription: `The Enterprise Bootcamp is an intensive five-day program designed specifically for teams managing AI infrastructure at scale. This immersive experience covers architecture design, deployment strategies, security considerations, and operational best practices.

Participants will work through real-world case studies and leave with actionable implementation plans for their organizations.`,
    schedule: [
      {
        day: 'Day 1-5 Overview',
        events: [
          { time: '9:00 AM', title: 'Daily Keynote & Framework', speaker: 'Senior Architects' },
          { time: '10:00 AM', title: 'Deep Dive Sessions', speaker: 'Various' },
          { time: '12:30 PM', title: 'Working Lunch & Discussions', speaker: '' },
          { time: '2:00 PM', title: 'Hands-on Labs', speaker: 'Engineers' },
          { time: '4:00 PM', title: 'Group Project Work', speaker: '' },
          { time: '5:00 PM', title: 'Day Ends', speaker: '' },
        ]
      }
    ],
    speakers: ['Alex Chen', 'Jordan Williams', 'Priya Patel', 'Marcus Rodriguez'],
    price: 'Team Package (5 people): $4,999',
  },
  '4': {
    id: '4',
    title: 'Global Community Meetup',
    date: 'Monthly - Check Schedule',
    time: '6:00 PM - 8:00 PM Local',
    location: 'Multiple Cities',
    venue: 'Various venues worldwide',
    description: 'Connect with fellow developers and share your experiences using Optimus in production.',
    status: 'Ongoing',
    attendees: '1,000+',
    fullDescription: `Our monthly Global Community Meetups bring together developers from around the world. These casual yet informative gatherings feature local speakers, peer discussions, and plenty of networking opportunities.

Upcoming meetups are scheduled in San Francisco, New York, London, Tokyo, and Singapore. Whether you're experienced or just getting started, these meetups are perfect for connecting with the community.`,
    schedule: [
      {
        day: 'Typical Meetup Format',
        events: [
          { time: '6:00 PM', title: 'Welcome & Networking', speaker: '' },
          { time: '6:30 PM', title: 'Lightning Talks (5 mins each)', speaker: 'Community Members' },
          { time: '7:00 PM', title: 'Featured Presentation', speaker: 'Local Expert' },
          { time: '7:30 PM', title: 'Open Discussion & Q&A', speaker: '' },
          { time: '8:00 PM', title: 'Informal Networking', speaker: '' },
        ]
      }
    ],
    speakers: ['Community Members', 'Local Experts'],
    price: 'Free',
  },
};

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [isVisible, setIsVisible] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      setEventId(resolvedParams.id);
    })();
  }, [params]);

  const event = eventId ? eventDetails[eventId] : null;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display mb-4">Event not found</h1>
          <Link href="/" className="text-foreground hover:text-foreground/80">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header Navigation */}
      <div className="border-b border-foreground/10 sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4 flex items-center gap-4">
          <Link href="/" className="inline-flex items-center gap-2 hover:text-foreground/70 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to events
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div
        ref={sectionRef}
        className={`relative py-16 lg:py-24 border-b border-foreground/10 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${
              event.status === 'Upcoming' 
                ? 'bg-green-400' 
                : event.status === 'Limited Seats'
                ? 'bg-yellow-400'
                : 'bg-blue-400'
            }`} />
            <span className="text-sm font-mono text-foreground/60">{event.status}</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-display tracking-tight mb-8">
            {event.title}
          </h1>

          {/* Quick Info Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="flex items-start gap-4">
              <Calendar className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-mono text-foreground/40 uppercase tracking-wider mb-1">Date</p>
                <p className="text-foreground">{event.date}</p>
                <p className="text-sm text-foreground/60">{event.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-mono text-foreground/40 uppercase tracking-wider mb-1">Location</p>
                <p className="text-foreground">{event.location}</p>
                <p className="text-sm text-foreground/60">{event.venue}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Users className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-mono text-foreground/40 uppercase tracking-wider mb-1">Attendees</p>
                <p className="text-foreground">{event.attendees}</p>
                <p className="text-sm text-foreground/60">Expected</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-mono text-foreground/40 uppercase tracking-wider mb-1">Price</p>
                <p className="text-foreground text-sm">{event.price}</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-3 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-all duration-300">
              Register Now
            </button>
            <button className="px-8 py-3 border border-foreground/20 text-foreground rounded-lg font-medium hover:border-foreground/40 transition-all duration-300 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Content Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <section>
              <h2 className="text-3xl font-display mb-6">About This Event</h2>
              <p className="text-lg text-foreground/70 leading-relaxed whitespace-pre-line">
                {event.fullDescription}
              </p>
            </section>

            {/* Schedule */}
            <section>
              <h2 className="text-3xl font-display mb-8">Event Schedule</h2>
              <div className="space-y-8">
                {event.schedule.map((scheduleItem: any, index: number) => (
                  <div key={index} className="border-l-2 border-foreground/20 pl-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">{scheduleItem.day}</h3>
                    <div className="space-y-3">
                      {scheduleItem.events.map((item: any, eventIndex: number) => (
                        <div key={eventIndex} className="flex gap-4">
                          <div className="text-sm font-mono text-foreground/60 min-w-24">{item.time}</div>
                          <div>
                            <p className="text-foreground font-medium">{item.title}</p>
                            {item.speaker && <p className="text-sm text-foreground/60">{item.speaker}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Speakers */}
            {event.speakers && event.speakers.length > 0 && (
              <section>
                <h2 className="text-3xl font-display mb-6">Featured Speakers</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {event.speakers.map((speaker: string, index: number) => (
                    <div key={index} className="p-4 border border-foreground/10 rounded-lg hover:border-foreground/20 transition-colors">
                      <p className="text-foreground font-medium">{speaker}</p>
                      <p className="text-sm text-foreground/60">Industry Expert</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Registration Card */}
              <div className="border border-foreground/10 rounded-lg p-8 bg-foreground/[0.02] backdrop-blur">
                <h3 className="text-xl font-display mb-4">Ready to join?</h3>
                <p className="text-foreground/70 mb-6">
                  Secure your spot now. Early registrants get exclusive benefits and access to pre-event materials.
                </p>
                <button className="w-full px-6 py-3 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-all duration-300 mb-4">
                  Register Now
                </button>
                <button className="w-full px-6 py-3 border border-foreground/20 text-foreground rounded-lg font-medium hover:border-foreground/40 transition-all duration-300">
                  Add to Calendar
                </button>
              </div>

              {/* Event Details Card */}
              <div className="border border-foreground/10 rounded-lg p-6 bg-foreground/[0.02]">
                <h4 className="font-display mb-4">Event Details</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-mono text-foreground/40 uppercase mb-1">Format</p>
                    <p className="text-foreground">{event.location === 'Online' ? 'Virtual Event' : 'In-Person'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-foreground/40 uppercase mb-1">Status</p>
                    <p className="text-foreground">{event.status}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-foreground/40 uppercase mb-1">Language</p>
                    <p className="text-foreground">English</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
