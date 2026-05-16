import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { Marquee } from '@/components/Marquee';
import { ProblemSolution } from '@/components/ProblemSolution';
import { ParallaxColumns } from '@/components/ParallaxColumns';
import { Features } from '@/components/Features';
import { SecurityLayers } from '@/components/SecurityLayers';
import { DashboardPreview } from '@/components/DashboardPreview';
import { MobilePreview } from '@/components/MobilePreview';
import { Pricing } from '@/components/Pricing';
import { Faq } from '@/components/Faq';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';
import { Cursor } from '@/components/Cursor';
import { ScrollProgress } from '@/components/ScrollProgress';
import { SmoothScroll } from '@/components/SmoothScroll';
import { GridBackground } from '@/components/GridBackground';
import { DarkModeNudge } from '@/components/DarkModeNudge';

export default function Page() {
  return (
    <main className="relative">
      <GridBackground />
      <SmoothScroll />
      <ScrollProgress />
      <Cursor />
      <DarkModeNudge />
      <Nav />
      <Hero />
      <Marquee />
      <ProblemSolution />
      <ParallaxColumns />
      <Features />
      <SecurityLayers />
      <DashboardPreview />
      <MobilePreview />
      <Pricing />
      <Faq />
      <CTA />
      <Footer />
    </main>
  );
}
