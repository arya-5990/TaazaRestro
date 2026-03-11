import PrimaryNavigation from "@/components/PrimaryNavigation";
import ExplodedHero from "@/components/ExplodedHero";
import ExperienceSection from "@/components/ExperienceSection";
import MenuSection from "@/components/MenuSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import SiteFooter from "@/components/SiteFooter";

export default function HomePage() {
  return (
    <>
      <PrimaryNavigation />
      <main>
        <ExplodedHero />
        <ExperienceSection />
        <MenuSection />
        <TestimonialsSection />
      </main>
      <SiteFooter />
    </>
  );
}
