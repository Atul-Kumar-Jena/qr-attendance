import type { Metadata } from 'next';
import { Nunito_Sans } from 'next/font/google';
import '../styles/globals.css';
import { PageTransition } from '@/components/PageTransition';
import { Providers } from '@/components/Providers';
import { DeepLinkRestore } from '@/components/DeepLinkRestore';
import { GridBackground } from '@/components/GridBackground';
import { Loader } from '@/components/Loader';
import { InputRobot } from '@/components/InputRobot';

// Single rounded sans for both display and body — minimalist, one-family approach.
const nunito = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Attendly — secure QR attendance for modern institutions',
  description:
    'Dynamic signed QR tokens, device binding, geofencing and app attestation — built for schools, colleges and organizations.',
  metadataBase: new URL('https://attendly.app'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={nunito.variable}>
      <head>
        {/* Apply saved theme before first paint to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var m=localStorage.getItem('attendly-theme-mode')||'auto';var h=new Date().getHours();var t=m==='dark'?'dark':m==='light'?'light':(h>=7&&h<19?'light':'dark');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();` }} />
      </head>
      <body className="font-sans antialiased">
        <Loader />
        <InputRobot />
        <Providers>
          <GridBackground />
          <DeepLinkRestore />
          <PageTransition>{children}</PageTransition>
        </Providers>
      </body>
    </html>
  );
}
