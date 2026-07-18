import type { Metadata } from "next";
import { WhyIBuild } from "@/components/sections/why-i-build";
import { Philosophy } from "@/components/sections/philosophy";
import { JourneyTimeline } from "@/components/sections/journey-timeline";
import { Timeline } from "@/components/sections/timeline";
import { CTA } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Why I Build",
  description:
    "How Real Estate led to software engineering, and why I believe great software disappears into the background.",
};

export default function AboutPage() {
  return (
    <>
      <WhyIBuild variant="full" index="01" />
      <Philosophy index="02" />
      <JourneyTimeline index="03" />
      <Timeline />
      <CTA />
    </>
  );
}
