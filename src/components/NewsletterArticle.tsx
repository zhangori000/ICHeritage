import Image from "next/image";
import dayjs from "dayjs";
import { PortableText } from "next-sanity";

import { components } from "@/sanity/portableTextComponents";
import { urlFor } from "@/sanity/lib/image";
import type { BLOG_POST_QUERYResult } from "@/sanity/types";
import type { PortableTextBlock } from "sanity";

type CoverImage = NonNullable<NonNullable<BLOG_POST_QUERYResult>["mainImage"]>;

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

function RenderDate({ publishedAt }: { publishedAt?: string | null }) {
  if (!publishedAt) return null;
  const formatted = dayjs(publishedAt).isValid()
    ? dayjs(publishedAt).format("MMMM D, YYYY")
    : publishedAt;

  return <span className="text-sm text-[color:var(--foreground)]/70">{formatted}</span>;
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
  const shouldRenderMeta = issueLabel || publishedAt || readTime;
  const downloadUrl = attachment?.url ?? null;
  const downloadLabel = attachment?.filename || "Download PDF";
  const downloadSize = formatFileSize(attachment?.size);

  return (
    <article className="grid gap-10 px-4 sm:px-6 lg:px-10 lg:grid-cols-12">
      <header className="space-y-6 text-center lg:col-span-12 lg:col-start-1 lg:px-12 lg:text-left">
        {shouldRenderMeta ? (
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-[color:var(--foreground)]/70 lg:justify-start">
            {issueLabel ? (
              <span className="inline-flex items-center rounded-full bg-[color:var(--accent)]/20 px-3 py-1 font-medium text-[color:var(--accent)]">
                {issueLabel}
              </span>
            ) : null}
            <RenderDate publishedAt={publishedAt} />
            {readTime ? (
              <span aria-label="Estimated read time">{readTime}</span>
            ) : null}
          </div>
        ) : null}

        {title ? (
          <h1 className="font-serif text-4xl md:text-5xl text-[color:var(--foreground)]">
            {title}
          </h1>
        ) : null}

        {excerpt ? (
          <p className="mx-auto max-w-3xl text-lg text-[color:var(--foreground)]/75 md:text-xl lg:mx-0">
            {excerpt}
          </p>
        ) : null}

        {downloadUrl ? (
          <div className="flex justify-center lg:justify-start">
            <a
              href={`${downloadUrl}?dl=`}
              className="inline-flex items-center gap-2 rounded-md border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-2 text-sm font-medium text-[color:var(--foreground)] shadow-xs transition-colors hover:bg-[color:var(--accent)] hover:text-[color:var(--accent-foreground)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              <span>{downloadLabel}</span>
              {downloadSize ? (
                <span className="text-[color:var(--foreground)]/60">
                  ({downloadSize})
                </span>
              ) : null}
            </a>
          </div>
        ) : null}
      </header>

      <div className="lg:col-span-12 lg:col-start-1 lg:px-12">
        <hr className="mt-2 border-t border-[color:var(--border)]/80" />
      </div>

      {coverImage ? (
        <figure className="overflow-hidden rounded-3xl shadow-lg pt-6 lg:col-span-12 lg:col-start-1 lg:px-12 lg:pt-8">
          <Image
            src={urlFor(coverImage).width(1400).height(700).fit("crop").url()}
            alt=""
            width={1400}
            height={700}
            className="h-full w-full object-cover"
            priority
          />
        </figure>
      ) : null}

      {Array.isArray(body) && body.length > 0 ? (
        <div className="prose prose-neutral pt-4 text-base lg:col-span-12 lg:col-start-1 lg:px-12 lg:pt-8 lg:text-lg prose-headings:font-serif prose-headings:font-normal prose-headings:text-[color:var(--foreground)] prose-headings:tracking-tight prose-h1:mt-8 prose-h1:mb-3 prose-h2:mt-6 prose-h2:mb-2 prose-h3:mt-5 prose-h3:mb-2 prose-h4:mt-4 prose-h4:mb-2 prose-p:text-[color:var(--foreground)]/80 prose-p:leading-normal prose-li:text-[color:var(--foreground)]/80 prose-li:leading-snug">
          <PortableText value={body} components={components} />
        </div>
      ) : null}
    </article>
  );
}
