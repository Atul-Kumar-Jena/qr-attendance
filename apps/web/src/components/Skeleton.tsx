'use client';

export function SkeletonRow({ cols = 4 }: { cols?: number }) {
  const widths = [55, 75, 45, 65, 80, 50, 70];
  return (
    <tr className="border-b border-ink/6">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-3.5">
          <div
            className="h-3 bg-ink/8 dark:bg-white/8 rounded-full animate-pulse"
            style={{ width: `${widths[i % widths.length]}%` }}
          />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="rounded-xl border border-ink/8 bg-cream-50 dark:bg-[#13161D] p-5 space-y-3 animate-pulse">
      <div className="h-2.5 bg-ink/10 dark:bg-white/10 rounded-full w-24" />
      <div className="h-8 bg-ink/10 dark:bg-white/10 rounded-lg w-16" />
      {lines > 2 && <div className="h-2 bg-ink/6 dark:bg-white/6 rounded-full w-32" />}
    </div>
  );
}

export function SkeletonText({ width = '60%' }: { width?: string }) {
  return <div className="h-3 bg-ink/8 dark:bg-white/8 rounded-full animate-pulse" style={{ width }} />;
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <table className="w-full text-[13px]">
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} cols={cols} />
        ))}
      </tbody>
    </table>
  );
}
