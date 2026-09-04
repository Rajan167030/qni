import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { EventsSection } from "@/components/landing/events-section";
import { InfrastructureSection } from "@/components/landing/infrastructure-section";
import { MetricsSection } from "@/components/landing/metrics-section";
import { SpeakersSection } from "@/components/landing/speakers-section";
import { GallerySection } from "@/components/landing/gallery-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { CtaSection } from "@/components/landing/cta-section";
import { getMongoDbDatabase } from "@/lib/mongodb";
import { EventItem } from "@/lib/events-store";

// Cache the rendered page for 30s so repeat visits are served instantly
// instead of round-tripping to MongoDB on every request (ISR).
export const revalidate = 30;

async function fetchEvents(): Promise<EventItem[]> {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return [];
    const docs = await db.collection('events').find({}).sort({ eventDate: 1 }).toArray();
    return docs.map((doc: any) => ({
      ...doc,
      id: doc.id || String(doc._id),
      eventDate: doc.eventDate ? new Date(doc.eventDate).toISOString() : doc.eventDate,
      createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
    })) as EventItem[];
  } catch {
    return [];
  }
}

export default async function Home() {
  const events = await fetchEvents();
  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <EventsSection initialEvents={events} />
      <InfrastructureSection />
      <MetricsSection />
      <SpeakersSection />
      <GallerySection />
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}
