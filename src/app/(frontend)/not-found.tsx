import Link from "next/link";

/** 404 that keeps the site header and footer. */
export default function NotFound() {
  return (
    <section className="bg-[color:var(--paper)]">
      <div className="wrap py-24 sm:py-32">
        <div className="max-w-2xl">
          <p className="eyebrow eyebrow-rule">404</p>
          <h1 className="display mt-5 text-4xl text-[color:var(--ink)] md:text-6xl">
            We couldn&apos;t find that page
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[color:var(--ink-soft)]">
            The link may be out of date, or the page may have moved. Try one of
            these instead.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-primary">
              Go to the home page
            </Link>
            <Link href="/resources" className="btn">
              Browse resources
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
