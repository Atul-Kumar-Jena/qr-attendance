import Link from 'next/link';

const GITHUB = 'https://github.com/atul-kumar-jena/qr-attendance';
const EMAIL = 'mailto:hello@attendly.app';

export function Footer() {
  return (
    <footer className="section-dark border-t border-ink/10 relative">
      <div className="container py-16 grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
        <div>
          <div className="flex items-center gap-2.5">
            <Logo />
            <span className="font-display text-[1.6rem] tracking-tightish">Attendly</span>
          </div>
          <p className="mt-4 text-[12.5px] text-ink-mute max-w-xs leading-relaxed">
            Built so attendance becomes a non-event — secure, automatic,
            unforgeable.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-ink/12 px-3 py-1.5 text-[11px] text-ink-mute">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 animate-ping opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
            </span>
            All systems operational
          </div>
        </div>
        <Col title="Product" links={[
          { label: 'Features', href: '#features' },
          { label: 'Security', href: '#security' },
          { label: 'Dashboard', href: '#dashboard' },
          { label: 'Pricing', href: '#pricing' },
        ]} />
        <Col title="Explore" links={[
          { label: 'How it works', href: '#solution' },
          { label: 'The shift', href: '#the-shift' },
          { label: 'Live demo', href: '#demo' },
          { label: 'Get started', href: '#pricing' },
        ]} />
        <Col title="Company" links={[
          { label: 'Contact', href: EMAIL },
          { label: 'GitHub', href: GITHUB, external: true },
          { label: 'Request demo', href: '#demo' },
          { label: 'Status', href: '#' },
        ]} />
      </div>
      <div className="border-t border-ink/8">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11.5px] text-ink-mute">
          <span>© {new Date().getFullYear()} Attendly Labs · made with intent.</span>
          <div className="flex items-center gap-5">
            <span className="font-mono">v0.1 · alpha</span>
            <a href="#content" className="link-line">Back to top ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Col({ title, links }: { title: string; links: { label: string; href: string; external?: boolean }[] }) {
  return (
    <div>
      <div className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-ink-mute mb-3">{title}</div>
      <ul className="space-y-1.5 text-[13.5px]">
        {links.map((l) => (
          <li key={l.label}>
            {l.external ? (
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="link-line">{l.label}</a>
            ) : (
              <Link href={l.href} className="link-line">{l.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" className="flex-shrink-0" aria-hidden>
      <rect x="0" y="0" width="9" height="9" rx="2" fill="currentColor" />
      <rect x="13" y="0" width="9" height="9" rx="2" fill="currentColor" />
      <rect x="0" y="13" width="9" height="9" rx="2" fill="currentColor" />
      <rect x="15" y="15" width="7" height="7" rx="2" fill="var(--accent)" />
    </svg>
  );
}
