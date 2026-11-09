/**
 * Skeleton for routes rendered on request (newsletter articles, blog posts),
 * shown while their data loads. Mirrors the usual page shape: a hero band
 * followed by a row of cards.
 *
 * Deliberately NOT used as a site-wide loading.tsx: the other pages are
 * prerendered, and a root loading boundary gets baked into their static HTML,
 * where React holds the real content back ~300ms behind the skeleton on
 * every full page load.
 */
export function PageSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      className="animate-pulse bg-[var(--background)]"
    >
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero band */}
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 py-16 text-center">
          <div className="h-3 w-32 rounded-full bg-[var(--muted)]" />
          <div className="h-10 w-3/4 rounded-lg bg-[var(--muted)]" />
          <div className="h-10 w-1/2 rounded-lg bg-[var(--muted)]" />
          <div className="mt-2 h-4 w-2/3 rounded bg-[var(--muted)]" />
          <div className="h-4 w-1/2 rounded bg-[var(--muted)]" />
          <div className="mt-4 flex gap-3">
            <div className="h-11 w-36 rounded-md bg-[var(--muted)]" />
            <div className="h-11 w-28 rounded-md bg-[var(--muted)]" />
          </div>
        </div>

        {/* Card row */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]"
            >
              <div className="aspect-[4/3] bg-[var(--muted)]" />
              <div className="space-y-3 p-6">
                <div className="h-5 w-2/3 rounded bg-[var(--muted)]" />
                <div className="h-4 w-full rounded bg-[var(--muted)]" />
                <div className="h-4 w-5/6 rounded bg-[var(--muted)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
