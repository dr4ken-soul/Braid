'use client';

/**
 * Route level error boundary. Preserves case state and explains what failed.
 */

import { ErrorState } from '@braid/ui';

export default function WebError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 py-32 sm:px-8 lg:px-12 xl:px-16">
      <ErrorState
        title="This view could not load"
        body="Something failed while loading this part of the console. The case state is preserved on the service. Retry is safe because this view only reads data."
        retry={
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-[var(--accent)] px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--bg-primary)] transition-colors duration-200 ease-out hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Retry
          </button>
        }
      />
    </div>
  );
}
