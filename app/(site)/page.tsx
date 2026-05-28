import { Hero } from "@/components/landing/Hero";
import { StatsRow } from "@/components/landing/StatsRow";
import { CapabilitiesGrid } from "@/components/landing/CapabilitiesGrid";
import { Testimonial } from "@/components/landing/Testimonial";
import { FinalCta } from "@/components/landing/FinalCta";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <StatsRow />
      <CapabilitiesGrid />
      <Testimonial />
      <FinalCta />
    </>
  );
}
