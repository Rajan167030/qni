import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { EventsSection } from "@/components/landing/events-section";
import { InfrastructureSection } from "@/components/landing/infrastructure-section";
import { MetricsSection } from "@/components/landing/metrics-section";
import { IntegrationsSection } from "@/components/landing/integrations-section";
import { SpeakersSection } from "@/components/landing/speakers-section";
import { GallerySection } from "@/components/landing/gallery-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { CtaSection } from "@/components/landing/cta-section";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <EventsSection />
      <InfrastructureSection />
      <MetricsSection />
      <IntegrationsSection />
      <SpeakersSection />
      <GallerySection />
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}
