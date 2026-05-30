import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '../styles/globals.css';
import { PageTransition } from '@/components/PageTransition';
import { Providers } from '@/components/Providers';
import { DeepLinkRestore } from '@/components/DeepLinkRestore';
import { Loader } from '@/components/Loader';
import { InputRobot } from '@/components/InputRobot';
import { GlobalAurora } from '@/components/GlobalAurora';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Attendly — secure QR attendance for modern institutions',
  description: 'Dynamic signed QR tokens, device binding, geofencing and app attestation — built for schools, colleges and organizations.',
  metadataBase: new URL('https://attendly.app'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={jakarta.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var m=localStorage.getItem('attendly-theme-mode')||'dark';if(m!=='light')document.documentElement.classList.add('dark');}catch(e){}})();` }} />
      </head>
      <body className="font-sans antialiased">
        <GlobalAurora />
        <Loader />
        <InputRobot />
        <Providers>
          <DeepLinkRestore />
          <PageTransition>{children}</PageTransition>
        </Providers>
      </body>
    </html>
  );
}
