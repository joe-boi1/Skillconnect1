export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h1 className="font-display text-xl font-semibold text-ink">{title}</h1>
      {subtitle && <p className="mt-0.5 text-sm text-ink/60">{subtitle}</p>}
    </div>
  );
}
