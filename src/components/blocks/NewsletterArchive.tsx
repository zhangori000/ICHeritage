import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { stegaClean } from "next-sanity";

import { urlFor } from "@/sanity/lib/image";
import type { PAGE_QUERYResult } from "@/sanity/types";

const FALLBACK_IMAGE = "/Gemini_Generated_Image_newsletter_default.png";

type NewsletterArchiveBlock = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["content"]>[number],
  { _type: "newsletterArchive" }
>;

type Newsletter = NonNullable<NewsletterArchiveBlock["newsletters"]>[number];

function clean(value: string | null | undefined) {
  return typeof value === "string" ? stegaClean(value) : value ?? "";
}

function formatDate(date?: string | null) {
  if (!date) return null;
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format("M/D/YYYY") : date;
}

export function NewsletterArchive({
  heading,
  description,
  searchPlaceholder,
  filterLabel,
  newsletters,
  cta,
  loadMoreLabel,
}: NewsletterArchiveBlock) {
  const list = Array.isArray(newsletters)
    ? newsletters.filter((item): item is Newsletter => Boolean(item))
    : [];

  const subscribeTitle = clean(cta?.title);
  const subscribeBody = clean(cta?.body);
  const subscribeDisclaimer = clean(cta?.disclaimer);
  const subscribePlaceholder = clean(cta?.placeholder) || "Enter your email";
  const subscribeButton = clean(cta?.buttonLabel) || "Subscribe";

  return (
    <section
      id="newsletter"
      className="py-20"
      style={{ backgroundColor: "color-mix(in oklab, var(--background) 92%, var(--muted) 8%)" }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            {heading ? (
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-[color:var(--foreground)]">
                {clean(heading)}
              </h2>
            ) : null}
            {description ? (
              <p className="text-lg md:text-xl text-[color:var(--foreground)]/80 max-w-3xl mx-auto text-pretty">
                {clean(description)}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <label className="relative flex-1">
              <span className="sr-only">{searchPlaceholder || "Search newsletters"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[color:var(--foreground)]/60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                className="flex h-10 w-full rounded-md border border-[color:var(--input)] bg-[color:var(--card)] pl-10 pr-3 py-2 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--foreground)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder={clean(searchPlaceholder) || "Search newsletters by title or content..."}
                type="search"
                readOnly
              />
            </label>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-2 text-sm font-medium transition-colors duration-200 shadow-xs hover:bg-[color:var(--accent)] hover:text-[color:var(--accent-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="lucide lucide-filter h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              {filterLabel || "Filter"}
            </button>
          </div>

          {list.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {list.map((item) => {
                const date = formatDate(item.date);
                const readTime = clean(item.readTime);
                const issue = clean(item.issue);
                const title = clean(item.title);
                const summary = clean(item.summary);
                const href = clean(item.href);
                const coverSrc = item.image?.asset
                  ? urlFor(item.image).width(600).height(400).url()
                  : FALLBACK_IMAGE;

                return (
                  <article
                    key={item._key}
                    className="group flex flex-col gap-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] py-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <Image
                        src={coverSrc}
                        alt={title || "Newsletter cover"}
                        width={600}
                        height={400}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="px-6 space-y-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[color:var(--foreground)]/65">
                        {issue ? (
                          <span className="inline-flex items-center rounded-full border border-transparent bg-[color:var(--secondary)] px-2.5 py-0.5 font-semibold text-[color:var(--secondary-foreground)]">
                            {issue}
                          </span>
                        ) : null}
                        {date ? (
                          <div className="flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="lucide lucide-calendar h-3 w-3"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M8 2v4" />
                              <path d="M16 2v4" />
                              <rect x="3" y="4" width="18" height="18" rx="2" />
                              <path d="M3 10h18" />
                            </svg>
                            <span>{date}</span>
                          </div>
                        ) : null}
                        {readTime ? (
                          <div className="flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="lucide lucide-clock h-3 w-3"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>{readTime}</span>
                          </div>
                        ) : null}
                      </div>

                      {title ? (
                        <h3 className="font-serif text-xl font-semibold leading-tight text-[color:var(--foreground)] transition-colors duration-300 group-hover:text-[color:var(--primary)]">
                          {title}
                        </h3>
                      ) : null}

                      {summary ? (
                        <p className="text-[color:var(--foreground)]/80 leading-relaxed text-pretty">
                          {summary}
                        </p>
                      ) : null}
                    </div>

                    {href ? (
                      <div className="px-6">
                        <Link
                          href={href}
                          className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 px-0 py-0 text-[color:var(--primary)] hover:text-[color:var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        >
                          Read Full Newsletter
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-arrow-right ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                          >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-[color:var(--foreground)]/60">
              No newsletters available yet.
            </p>
          )}

          {(subscribeTitle || subscribeBody) && (
            <div className="mt-16">
              <div className="flex flex-col gap-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--primary)] text-[color:var(--primary-foreground)] shadow-sm">
                <div className="space-y-6 p-8 text-center">
                  {subscribeTitle ? (
                    <h3 className="font-serif text-2xl md:text-3xl font-semibold">
                      {subscribeTitle}
                    </h3>
                  ) : null}
                  {subscribeBody ? (
                    <p className="text-[color:var(--primary-foreground)]/90 text-lg max-w-2xl mx-auto">
                      {subscribeBody}
                    </p>
                  ) : null}
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                      type="email"
                      className="flex h-10 w-full rounded-md border border-[color:var(--primary-foreground)]/20 bg-[color:var(--primary-foreground)]/10 px-3 py-2 text-sm text-[color:var(--primary-foreground)] placeholder:text-[color:var(--primary)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                      placeholder={subscribePlaceholder}
                      readOnly
                    />
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-[color:var(--primary-foreground)] px-4 py-2 text-sm font-medium text-[color:var(--primary)] transition-colors hover:bg-[color:var(--primary-foreground)]/90"
                    >
                      {subscribeButton}
                    </button>
                  </div>
                  {subscribeDisclaimer ? (
                    <p className="text-xs text-[color:var(--primary-foreground)]/80">
                      {subscribeDisclaimer}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {loadMoreLabel ? (
            <div className="text-center mt-12">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 border border-[color:var(--border)] bg-transparent px-8 py-3 h-10 rounded-md hover:bg-[color:var(--accent)] hover:text-[color:var(--accent-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {clean(loadMoreLabel)}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
