import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { Marquee } from '@/components/Marquee';
import { ProblemSolution } from '@/components/ProblemSolution';
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

export default function Page() {
  return (
    <main className="relative">
      <SmoothScroll />
      <ScrollProgress />
      <Cursor />
      <Nav />
      <Hero />
      <Marquee />
      <ProblemSolution />
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
