import Image from "next/image";
import dayjs from "dayjs";
import { PortableText } from "next-sanity";

import { components } from "@/sanity/portableTextComponents";
import { urlFor } from "@/sanity/lib/image";
import type { BLOG_POST_QUERY_RESULT } from "@/sanity/types";
import type { PortableTextBlock } from "sanity";

type CoverImage = NonNullable<NonNullable<BLOG_POST_QUERY_RESULT>["mainImage"]>;

type Attachment = {
  url?: string | null;
  filename?: string | null;
  size?: number | null;
};

type NewsletterArticleProps = {
  _id: string;
  title: string | null;
  issueLabel?: string | null;
  publishedAt?: string | null;
  readTime?: string | null;
  excerpt?: string | null;
  coverImage?: CoverImage | null;
  body?: PortableTextBlock[] | null;
  attachment?: Attachment | null;
};

function formatFileSize(bytes?: number | null) {
  if (!bytes || bytes <= 0) return null;
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(publishedAt?: string | null) {
  if (!publishedAt) return null;
  return dayjs(publishedAt).isValid()
    ? dayjs(publishedAt).format("MMMM D, YYYY")
    : publishedAt;
}

export function NewsletterArticle({
  title,
  issueLabel,
  publishedAt,
  readTime,
  excerpt,
  coverImage,
  body,
  attachment,
}: NewsletterArticleProps) {
  const date = formatDate(publishedAt);
  const shouldRenderMeta = issueLabel || date || readTime;
  const downloadUrl = attachment?.url ?? null;
  const downloadLabel = attachment?.filename || "Download PDF";
  const downloadSize = formatFileSize(attachment?.size);

  return (
    <article>
      <header className="flex flex-col items-start gap-5">
        {shouldRenderMeta ? (
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            {issueLabel ? (
              <span className="eyebrow eyebrow-rule">{issueLabel}</span>
            ) : null}
            {date ? (
              <span className="text-sm text-[color:var(--ink-muted)]">{date}</span>
            ) : null}
            {readTime ? (
              <span
                aria-label="Estimated read time"
                className="text-sm text-[color:var(--ink-muted)]"
              >
                {readTime}
              </span>
            ) : null}
          </div>
        ) : null}

        {title ? (
          <h1 className="display max-w-4xl text-4xl text-[color:var(--ink)] md:text-6xl">
            {title}
          </h1>
        ) : null}

        {excerpt ? (
          <p className="max-w-[68ch] text-lg leading-relaxed text-[color:var(--ink-soft)] md:text-xl">
            {excerpt}
          </p>
        ) : null}

        {downloadUrl ? (
          <a href={`${downloadUrl}?dl=`} className="btn mt-2">
            <span>{downloadLabel}</span>
            {downloadSize ? (
              <span className="text-[color:var(--ink-muted)]">({downloadSize})</span>
            ) : null}
          </a>
        ) : null}
      </header>

      {coverImage ? (
        <figure className="mt-12 max-w-4xl border-t border-[color:var(--hairline)] pt-12">
          <div className="overflow-hidden border border-[color:var(--ink)] bg-[color:var(--paper-slot)]">
            <Image
              src={urlFor(coverImage).width(1400).height(788).fit("crop").url()}
              alt=""
              width={1400}
              height={788}
              className="h-auto w-full"
              priority
            />
          </div>
        </figure>
      ) : null}

      {Array.isArray(body) && body.length > 0 ? (
        <div
          className={[
            "prose prose-lg mt-12 max-w-[68ch] text-[color:var(--ink-soft)]",
            coverImage ? "" : "border-t border-[color:var(--hairline)] pt-12",
            "prose-headings:font-serif prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-[color:var(--ink)]",
            "prose-p:text-[color:var(--ink-soft)] prose-li:text-[color:var(--ink-soft)] prose-strong:text-[color:var(--ink)]",
            "prose-a:text-[color:var(--seal)] prose-img:rounded-none",
            "prose-blockquote:border-[color:var(--hairline)] prose-blockquote:font-normal prose-blockquote:not-italic prose-hr:border-[color:var(--hairline)]",
          ].join(" ")}
        >
          <PortableText value={body} components={components} />
        </div>
      ) : null}
    </article>
  );
}
