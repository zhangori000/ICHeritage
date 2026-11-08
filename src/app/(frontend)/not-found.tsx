import Link from "next/link";

/** Friendly 404 that keeps the site header and footer. */
export default function NotFound() {
  return (
    <section className="bg-[var(--background)]">
      <div className="container mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-24 text-center sm:py-32">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
          404
        </p>
        <h1 className="font-noto-serif-sc text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
          We couldn&apos;t find that page
        </h1>
        <p className="text-base text-[var(--muted-foreground)]">
          The link may be out of date, or the page may have moved. Try one of
          these instead.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm hover:brightness-110"
          >
            Go to the home page
          </Link>
          <Link
            href="/resources"
            className="inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
          >
            Browse resources
          </Link>
        </div>
      </div>
    </section>
  );
}
