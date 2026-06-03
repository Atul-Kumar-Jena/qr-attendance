import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '../styles/globals.css';
import { PageTransition } from '@/components/PageTransition';
import { Providers } from '@/components/Providers';
import { DeepLinkRestore } from '@/components/DeepLinkRestore';
import { Loader } from '@/components/Loader';
import { GridBackground } from '@/components/GridBackground';
import { GlobalAurora } from '@/components/GlobalAurora';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const SITE_URL = 'https://atul-kumar-jena.github.io/qr-attendance';

// Brand mark as an inline SVG favicon (no extra network request).
const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 22 22'%3E%3Crect width='22' height='22' rx='5' fill='%23000'/%3E%3Crect x='3' y='3' width='6.5' height='6.5' rx='1.6' fill='%23fff'/%3E%3Crect x='12.5' y='3' width='6.5' height='6.5' rx='1.6' fill='%23fff'/%3E%3Crect x='3' y='12.5' width='6.5' height='6.5' rx='1.6' fill='%23fff'/%3E%3Crect x='13' y='13' width='6' height='6' rx='1.6' fill='%23fff' fill-opacity='0.55'/%3E%3C/svg%3E";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Attendly — secure QR attendance for modern institutions',
    template: '%s · Attendly',
  },
  description:
    'Stop proxy attendance at the protocol layer. Dynamic signed QR tokens, device binding, geofencing and app attestation — built for schools, colleges and organizations.',
  applicationName: 'Attendly',
  authors: [{ name: 'Attendly Labs' }],
  creator: 'Attendly Labs',
  keywords: [
    'QR attendance', 'attendance management', 'proxy attendance', 'geofencing attendance',
    'device binding', 'signed QR', 'school attendance software', 'college attendance system',
    'secure attendance', 'attendance SaaS',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Attendly',
    title: 'Attendly — attendance, unforgeable.',
    description:
      'Dynamic signed QR · device binding · geofence · app attestation. The proxy-attendance problem, solved at the protocol layer.',
    url: SITE_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Attendly — attendance, unforgeable.',
    description:
      'Dynamic signed QR · device binding · geofence · app attestation. Proxy attendance, solved.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: { icon: FAVICON, apple: FAVICON },
  category: 'technology',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

// Structured data — helps search engines understand the product.
const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Attendly',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  description:
    'Secure QR attendance with dynamic signed tokens, device binding, geofencing and app attestation.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  url: SITE_URL,
};

/* Flash-free theme boot. Runs before paint, resolves the stored preference
   (default: dark, matching the dark-first design) and applies the class so
   React hydrates against the already-correct theme — no FOUC, no desync. */
const THEME_BOOT = `(function(){try{var m=localStorage.getItem('attendly-theme-mode')||'dark';var t=m==='auto'?((new Date().getHours()>=7&&new Date().getHours()<19)?'light':'dark'):m;var d=document.documentElement;if(t==='dark')d.classList.add('dark');else d.classList.remove('dark');d.dataset.theme=t;d.dataset.mode=m;if(sessionStorage.getItem('attendly-loaded'))d.classList.add('loaded');}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={jakarta.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body className="font-sans antialiased">
        <a href="#content" className="skip-link">Skip to content</a>
        <GlobalAurora />
        <GridBackground />
        <Loader />
        <Providers>
          <DeepLinkRestore />
          <PageTransition>
            <div id="content">{children}</div>
          </PageTransition>
        </Providers>
      </body>
    </html>
  );
}
