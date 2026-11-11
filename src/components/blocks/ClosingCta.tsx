import Link from "next/link";
import { stegaClean } from "next-sanity";
import type { PAGE_QUERY_RESULT } from "@/sanity/types";

type ClosingCtaBlock = Extract<
  NonNullable<NonNullable<PAGE_QUERY_RESULT>["content"]>[number],
  { _type: "closingCta" }
>;

function clean(value: string | null | undefined): string {
  return typeof value === "string" ? stegaClean(value).trim() : "";
}

/**
 * The one dark band at the end of a page: display heading on the left,
 * supporting text and buttons on the right.
 */
export function ClosingCta({ heading, body, primaryCta, secondaryCta }: ClosingCtaBlock) {
  const safeHeading = clean(heading);
  const safeBody = clean(body);
  const primary =
    clean(primaryCta?.label) && clean(primaryCta?.href)
      ? { label: clean(primaryCta?.label), href: clean(primaryCta?.href) }
      : null;
  const secondary =
    clean(secondaryCta?.label) && clean(secondaryCta?.href)
      ? { label: clean(secondaryCta?.label), href: clean(secondaryCta?.href) }
      : null;

  if (!safeHeading) return null;

  return (
    <section className="band py-24 md:py-32">
      <div className="wrap grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
        <h2 className="display m-0 text-5xl text-[color:var(--band-text)] md:text-6xl lg:text-7xl">
          {safeHeading}
        </h2>
        <div className="flex max-w-md flex-col gap-7 md:justify-self-end">
          {safeBody ? (
            <p className="m-0 text-lg leading-relaxed text-[color:var(--band-muted)]">
              {safeBody}
            </p>
          ) : null}
          {primary || secondary ? (
            <div className="flex flex-wrap items-center gap-4">
              {primary ? (
                <Link href={primary.href} className="btn btn-primary">
                  {primary.label}
                </Link>
              ) : null}
              {secondary ? (
                <Link href={secondary.href} className="btn btn-light">
                  {secondary.label}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
