import ExperiencesSection from "@/app/components/ExperiencesSection";
import Hero from "@/app/components/Hero";
import NewsletterSection from "@/app/components/NewsletterSection";
import PlanYourTripSection from "@/app/components/PlanYourTripSection";
import WeAreSection from "@/app/components/WeAreSection";
import WeOfferSection from "@/app/components/WeOfferSection";

export default function Home() {
  return (
    <main className="min-w-0 max-w-full pt-[64px] sm:pt-[72px] md:pt-[84px]">
      <Hero />
      <WeAreSection />
      <ExperiencesSection />
      <WeOfferSection />
      <PlanYourTripSection />
      <NewsletterSection />
    </main>
  );
}
