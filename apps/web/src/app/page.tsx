import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { Marquee } from '@/components/Marquee';
import { RollCallTransition } from '@/components/RollCallTransition';
import { ProblemSolution } from '@/components/ProblemSolution';
import { HowItWorks } from '@/components/HowItWorks';
import { ParallaxColumns } from '@/components/ParallaxColumns';
import { Features } from '@/components/Features';
import { SecurityLayers } from '@/components/SecurityLayers';
import { Interactive3D } from '@/components/Interactive3D';
import { DashboardPreview } from '@/components/DashboardPreview';
import { MobilePreview } from '@/components/MobilePreview';
import { Testimonials } from '@/components/Testimonials';
import { Pricing } from '@/components/Pricing';
import { Faq } from '@/components/Faq';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';
import { ScrollProgress } from '@/components/ScrollProgress';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SmoothScroll } from '@/components/SmoothScroll';
import { DarkModeNudge } from '@/components/DarkModeNudge';

export default function Page() {
  return (
    <main className="relative">
      <SmoothScroll />
      <ScrollProgress />
      <ScrollReveal />
      <DarkModeNudge />
      <Nav />
      {/* Modern SaaS skeleton: hero → social proof → the problem → how it works
          → features → by-the-numbers → security → product → testimonials →
          pricing → faq → CTA → footer. Vertical spine, GSAP moments throughout. */}
      <Hero />
      <Marquee />
      <RollCallTransition />
      <ProblemSolution />
      <HowItWorks />
      <Features />
      <ParallaxColumns />
      <SecurityLayers />
      <Interactive3D />
      <DashboardPreview />
      <MobilePreview />
      <Testimonials />
      <Pricing />
      <Faq />
      <CTA />
      <Footer />
    </main>
  );
}
