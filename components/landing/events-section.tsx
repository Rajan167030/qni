"use client";

import { useEffect, useRef, useState } from "react";

const events = [
  {
    id: "1",
    title: "Optimus Summit 2024",
    date: "Oct 15 - Oct 17",
    location: "San Francisco, CA",
    description: "Join industry leaders and innovators for three days of talks, workshops, and networking.",
    status: "Upcoming",
    attendees: "2,500+",
  },
  {
    id: "2",
    title: "Developer Workshop Series",
    date: "Every Wednesday",
    location: "Online",
    description: "Weekly hands-on workshops covering AI workflows, deployment strategies, and best practices.",
    status: "Recurring",
    attendees: "500+",
  },
  {
    id: "3",
    title: "Enterprise Bootcamp",
    date: "Nov 1 - Nov 5",
    location: "New York, NY",
    description: "Intensive five-day program for enterprise teams looking to scale their AI operations.",
    status: "Limited Seats",
    attendees: "100",
  },
  {
    id: "4",
    title: "Global Community Meetup",
    date: "Monthly",
    location: "Multiple Cities",
    description: "Connect with fellow developers and share your experiences using Optimus in production.",
    status: "Ongoing",
    attendees: "1,000+",
  },
];

function EventCard({ event, index }: { event: typeof events[0]; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="h-full border border-foreground/10 rounded-2xl p-8 lg:p-10 bg-background/50 hover:bg-background/80 hover:border-foreground/20 transition-all duration-500 hover:shadow-lg">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 mb-6">
          <div className={`w-2 h-2 rounded-full ${
            event.status === "Upcoming" 
              ? "bg-green-400" 
              : event.status === "Limited Seats"
              ? "bg-yellow-400"
              : "bg-blue-400"
          }`} />
          <span className="text-xs font-mono text-foreground/60">{event.status}</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl lg:text-3xl font-display mb-4 group-hover:translate-x-1 transition-transform duration-500">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-foreground/60 leading-relaxed mb-8">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-4 mb-8 pb-8 border-b border-foreground/10">
          <div>
            <span className="text-xs font-mono text-foreground/40 uppercase tracking-wider">Date</span>
            <p className="text-foreground mt-1">{event.date}</p>
          </div>
          <div>
            <span className="text-xs font-mono text-foreground/40 uppercase tracking-wider">Location</span>
            <p className="text-foreground mt-1">{event.location}</p>
          </div>
          <div>
            <span className="text-xs font-mono text-foreground/40 uppercase tracking-wider">Expected Attendees</span>
            <p className="text-foreground mt-1">{event.attendees}</p>
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
          className="w-full py-3 px-6 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-all duration-300 group-hover:translate-y-[-2px]"
        >
          Learn More
        </button>
      </div>
    </div>
  );
}

export function EventsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
      id="events"
      ref={sectionRef}
      className="relative py-24 lg:py-32"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Community
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Join our events.
            <br />
            <span className="text-muted-foreground">Connect with the community.</span>
          </h2>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {events.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
