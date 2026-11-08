import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { stegaClean } from "next-sanity";

import { urlFor } from "@/sanity/lib/image";
import type { PAGE_QUERY_RESULT } from "@/sanity/types";

const FALLBACK_IMAGE = "/Gemini_Generated_Image_newsletter_default.png";

type NewsletterArchiveBlock = Extract<
  NonNullable<NonNullable<PAGE_QUERY_RESULT>["content"]>[number],
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
  newsletters,
  cta,
}: NewsletterArchiveBlock) {
  const list = Array.isArray(newsletters)
    ? newsletters.filter((item): item is Newsletter => Boolean(item))
    : [];

  const subscribeTitle = clean(cta?.title);
  const subscribeBody = clean(cta?.body);

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
                <div className="space-y-5 p-8 text-center">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--primary-foreground)]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    Coming soon
                  </span>
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
                  <p className="text-sm text-[color:var(--primary-foreground)]/80">
                    Email sign-up is on its way. In the meantime, new articles are
                    published right here.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
