import Link from "next/link";
import dayjs from "dayjs";
import { stegaClean } from "next-sanity";

import type { PAGE_QUERY_RESULT } from "@/sanity/types";

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
  return parsed.isValid() ? parsed.format("MMMM D, YYYY") : date;
}

const rowClass =
  "grid grid-cols-1 gap-2 border-b border-[color:var(--hairline)] py-6 md:grid-cols-[140px_minmax(0,1fr)_auto] md:items-baseline md:gap-6";

/**
 * Newsletter archive as a list of rows: issue label, title and one-line
 * summary, date. The whole row is the link.
 */
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
    <section id="newsletter" className="bg-[color:var(--paper-deep)] py-20 md:py-28">
      <div className="wrap">
        {heading || description ? (
          <div className="grid gap-6 md:grid-cols-2 md:items-end">
            {heading ? (
              <h2 className="display text-4xl text-[color:var(--ink)] md:text-5xl lg:text-6xl">
                {clean(heading)}
              </h2>
            ) : null}
            {description ? (
              <p className="max-w-md text-lg leading-relaxed text-[color:var(--ink-soft)] md:justify-self-end">
                {clean(description)}
              </p>
            ) : null}
          </div>
        ) : null}

        {list.length > 0 ? (
          <ul className="mt-12 border-t border-[color:var(--ink)]">
            {list.map((item) => {
              const date = formatDate(item.date);
              const readTime = clean(item.readTime);
              const issue = clean(item.issue);
              const title = clean(item.title);
              const summary = clean(item.summary);
              const href = clean(item.href);
              const meta = [date, readTime].filter(Boolean).join(" · ");

              const content = (
                <>
                  {issue ? <span className="eyebrow">{issue}</span> : <span aria-hidden />}
                  <div className="min-w-0">
                    {title ? (
                      <h3 className="font-serif text-2xl leading-tight text-[color:var(--ink)] md:text-[28px]">
                        {title}
                      </h3>
                    ) : null}
                    {summary ? (
                      <p className="mt-2 line-clamp-1 text-[color:var(--ink-muted)]">{summary}</p>
                    ) : null}
                  </div>
                  {meta ? (
                    <span className="text-sm whitespace-nowrap text-[color:var(--ink-muted)]">
                      {meta}
                    </span>
                  ) : null}
                </>
              );

              return (
                <li key={item._key}>
                  {href ? (
                    <Link href={href} className={`row-hover ${rowClass}`}>
                      {content}
                    </Link>
                  ) : (
                    <div className={rowClass}>{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-12 border-t border-[color:var(--ink)] pt-6 text-[color:var(--ink-muted)]">
            No newsletters available yet.
          </p>
        )}

        {subscribeTitle || subscribeBody ? (
          <div className="mt-12 border-t border-[color:var(--hairline)] pt-6">
            <p className="eyebrow eyebrow-rule">
              Coming soon{subscribeTitle ? ` · ${subscribeTitle}` : ""}
            </p>
            {subscribeBody ? (
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[color:var(--ink-muted)]">
                {subscribeBody}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
