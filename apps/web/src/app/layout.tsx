import type { Metadata } from 'next';
import { DM_Sans, Cormorant_Garamond } from 'next/font/google';
import '../styles/globals.css';
import { PageTransition } from '@/components/PageTransition';
import { Providers } from '@/components/Providers';

const sans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});

const display = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Attendly — secure QR attendance for modern institutions',
  description:
    'Dynamic signed QR tokens, device binding, geofencing and app attestation — built for schools, colleges and organizations.',
  metadataBase: new URL('https://attendly.app'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${display.variable}`}>
      <head>
        {/* Pre-React safety: clear corrupted site config + handle ?reset before hydration */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var clear=function(){try{var keys=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&(k.indexOf('attendly')===0||k.indexOf('atd_')===0)&&k!=='attendly-theme-mode')keys.push(k);}keys.forEach(function(k){localStorage.removeItem(k);});}catch(e){}};if(location.search.indexOf('reset')>=0){clear();try{localStorage.removeItem('attendly-theme-mode');}catch(e){}var u=new URL(location.href);u.searchParams.delete('reset');history.replaceState({},'',u.toString());}var raw=localStorage.getItem('attendly_site_config');if(raw){try{var c=JSON.parse(raw);var valid=['LIMITED_OFFER','PAID','FREE'];if(!c||typeof c!=='object'||(c.pricingMode&&valid.indexOf(c.pricingMode)<0)){clear();}}catch(e){clear();}}}catch(e){try{localStorage.clear();}catch(_){}}})();` }} />
        {/* Apply saved theme before first paint to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var m=localStorage.getItem('attendly-theme-mode')||'auto';var h=new Date().getHours();var t=m==='dark'?'dark':m==='light'?'light':(h>=7&&h<19?'light':'dark');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();` }} />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          <PageTransition>{children}</PageTransition>
        </Providers>
      </body>
    </html>
  );
}
