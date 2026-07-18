import { Hero } from "@/components/sections/hero";
import { WhyIBuild } from "@/components/sections/why-i-build";
import { ArchitectureDiagram } from "@/components/sections/architecture-diagram";
import { FeaturedWork } from "@/components/sections/featured-work";
import { AISection } from "@/components/sections/ai-section";
import { Philosophy } from "@/components/sections/philosophy";
import { JourneyTimeline } from "@/components/sections/journey-timeline";
import { Metrics } from "@/components/sections/metrics";
import { Terminal } from "@/components/sections/terminal";
import { Testimonials } from "@/components/sections/testimonials";
import { BlogPreview } from "@/components/sections/blog-preview";
import { CTA } from "@/components/sections/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyIBuild variant="compact" index="01" />
      <ArchitectureDiagram />
      <FeaturedWork />
      <AISection />
      <Philosophy index="04" />
      <JourneyTimeline index="05" />
      <Metrics />
      <Terminal />
      <Testimonials />
      <BlogPreview />
      <CTA />
    </>
  );
}
