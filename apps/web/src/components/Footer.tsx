import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-cream-100/60">
      <div className="container py-14 grid md:grid-cols-4 gap-10">
        <div>
          <div className="font-display text-[1.6rem] tracking-tightish">Attendly</div>
          <p className="mt-3 text-[12.5px] text-ink-mute max-w-xs">
            Built so attendance becomes a non-event — secure, automatic,
            unforgeable.
          </p>
        </div>
        <Col title="Product" links={[
          { label: 'Features', href: '#features' },
          { label: 'Security', href: '#security' },
          { label: 'Pricing', href: '#pricing' },
          { label: 'Mobile app', href: '#' },
        ]} />
        <Col title="Resources" links={[
          { label: 'Docs', href: '#' },
          { label: 'API reference', href: '#' },
          { label: 'Changelog', href: '#' },
          { label: 'Status', href: '#' },
        ]} />
        <Col title="Company" links={[
          { label: 'About', href: '#' },
          { label: 'Contact', href: '#' },
          { label: 'Cookies', href: '/cookies' },
          { label: 'Terms', href: '/terms' },
        ]} />
      </div>
      <div className="border-t border-ink/8">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between text-[11.5px] text-ink-mute">
          <span>© {new Date().getFullYear()} Attendly Labs · made with intent.</span>
          <span className="font-mono">v0.1 · alpha</span>
        </div>
      </div>
    </footer>
  );
}

function Col({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-ink-mute mb-3">{title}</div>
      <ul className="space-y-1.5 text-[13.5px]">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="link-line">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
