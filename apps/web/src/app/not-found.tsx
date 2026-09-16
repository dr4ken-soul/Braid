import Link from 'next/link';

/**
 * Not found state. Offers the Open a case action.
 */
export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[80svh] w-full max-w-[1440px] place-items-center px-5 py-32 text-center sm:px-8">
      <div className="flex flex-col items-center gap-6">
        <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
          404
        </p>
        <h1 className="max-w-[16ch] font-display text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.86] tracking-[-0.04em] text-[var(--text-primary)]">
          No case exists here
        </h1>
        <p className="max-w-[28rem] font-display text-xl leading-snug text-[var(--text-secondary)]">
          This reference does not match a case in the challenge store. Open a new case to start an intake.
        </p>
        <Link
          href="/conversation"
          className="inline-flex min-h-12 items-center justify-center rounded-md bg-[var(--accent)] px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--bg-primary)] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
        >
          Open a case
        </Link>
      </div>
    </div>
  );
}
