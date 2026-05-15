import type { Metadata } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import '../styles/globals.css';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const display = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400'],
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
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
