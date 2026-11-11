/**
 * Skeleton for routes rendered on request (newsletter articles, blog posts),
 * shown while their data loads. Mirrors the page shape: an eyebrow and
 * display heading, then a rule and a few list rows.
 *
 * Deliberately NOT used as a site-wide loading.tsx: the other pages are
 * prerendered, and a root loading boundary gets baked into their static HTML,
 * where React holds the real content back ~300ms behind the skeleton on
 * every full page load.
 */
export function PageSkeleton() {
  const block = "bg-[color:var(--paper-deep)]";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      className="animate-pulse bg-[color:var(--paper)]"
    >
      <div className="wrap py-20 md:py-28">
        {/* Header */}
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <div className="flex flex-col gap-5">
            <div className={`h-3 w-24 ${block}`} />
            <div className={`h-12 w-full md:h-14 ${block}`} />
            <div className={`h-12 w-2/3 md:h-14 ${block}`} />
          </div>
          <div className="flex max-w-md flex-col gap-3 md:justify-self-end md:w-full">
            <div className={`h-4 w-full ${block}`} />
            <div className={`h-4 w-5/6 ${block}`} />
            <div className={`h-4 w-2/3 ${block}`} />
          </div>
        </div>

        {/* List rows */}
        <div className="mt-12 border-t border-[color:var(--ink)]">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-3 border-b border-[color:var(--hairline)] py-6 md:grid-cols-[140px_minmax(0,1fr)_auto] md:gap-6"
            >
              <div className={`h-3 w-16 ${block}`} />
              <div className="flex flex-col gap-3">
                <div className={`h-7 w-3/4 ${block}`} />
                <div className={`h-4 w-full ${block}`} />
              </div>
              <div className={`h-3 w-24 ${block}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
