/**
 * Shared section heading block.
 *
 * One unique heading per section, mono eyebrow with the section index, and
 * an optional explanatory body. Server component, no hooks.
 */

export function SectionHeading({
  index,
  kicker,
  title,
  body,
}: {
  index: string;
  kicker: string;
  title: string;
  body?: string;
}) {
  return (
    <header className="grid gap-6 pb-12 sm:pb-16 lg:pb-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
      <div className="grid gap-2">
        <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
          {index} / {kicker}
        </p>
        <h2 className="max-w-[9ch] font-display text-[clamp(2.75rem,6vw,5rem)] font-bold leading-[0.88] tracking-[-0.03em] text-[var(--text-primary)]">
          {title}
        </h2>
      </div>
      {body ? (
        <div className="grid place-items-start gap-4 pt-1 lg:pt-3">
          <p className="max-w-[44rem] font-display text-xl leading-snug text-[var(--text-secondary)] sm:text-2xl">
            {body}
          </p>
        </div>
      ) : null}
    </header>
  );
}
