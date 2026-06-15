import { DockNav } from '@/components/DockNav';
import { Hero } from '@/components/Hero';
import { Marquee } from '@/components/Marquee';
import { LiveToken } from '@/components/LiveToken';
import { ProblemSolution } from '@/components/ProblemSolution';
import { ShowcaseGallery } from '@/components/ShowcaseGallery';
import { Features } from '@/components/Features';
import { SecurityLayers } from '@/components/SecurityLayers';
import { DashboardPreview } from '@/components/DashboardPreview';
import { ScrollZoom } from '@/components/ScrollZoom';
import { MobilePreview } from '@/components/MobilePreview';
import { Pricing } from '@/components/Pricing';
import { Faq } from '@/components/Faq';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';
import { Cursor } from '@/components/Cursor';
import { ScrollProgress } from '@/components/ScrollProgress';
import { SmoothScroll } from '@/components/SmoothScroll';
import { GridBackground } from '@/components/GridBackground';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const Safe = ({ name, children }: { name: string; children: React.ReactNode }) => (
  <ErrorBoundary name={name} fallback={<div />}>{children}</ErrorBoundary>
);

export default function Page() {
  return (
    <main className="relative pb-28 md:pb-32">
      <Safe name="grid"><GridBackground /></Safe>
      <Safe name="smooth-scroll"><SmoothScroll /></Safe>
      <Safe name="scroll-progress"><ScrollProgress /></Safe>
      <Safe name="cursor"><Cursor /></Safe>
      <Safe name="hero"><Hero /></Safe>
      <Safe name="marquee"><Marquee /></Safe>
      <Safe name="live-token"><LiveToken /></Safe>
      <Safe name="problem-solution"><ProblemSolution /></Safe>
      <Safe name="showcase"><ShowcaseGallery /></Safe>
      <Safe name="features"><Features /></Safe>
      <Safe name="security-layers"><SecurityLayers /></Safe>
      <Safe name="dashboard-preview"><DashboardPreview /></Safe>
      <Safe name="scroll-zoom"><ScrollZoom /></Safe>
      <Safe name="mobile-preview"><MobilePreview /></Safe>
      <Safe name="pricing"><Pricing /></Safe>
      <Safe name="faq"><Faq /></Safe>
      <Safe name="cta"><CTA /></Safe>
      <Safe name="footer"><Footer /></Safe>
      <Safe name="dock-nav"><DockNav /></Safe>
    </main>
  );
}
