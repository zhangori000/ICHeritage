import Image from "next/image";
import dayjs from "dayjs";
import { PortableText } from "next-sanity";

import { components } from "@/sanity/portableTextComponents";
import { urlFor } from "@/sanity/lib/image";
import type { BLOG_POST_QUERYResult } from "@/sanity/types";
import type { PortableTextBlock } from "sanity";

type CoverImage = NonNullable<NonNullable<BLOG_POST_QUERYResult>["mainImage"]>;

type NewsletterArticleProps = {
  _id: string;
  title: string | null;
  issueLabel?: string | null;
  publishedAt?: string | null;
  readTime?: string | null;
  excerpt?: string | null;
  coverImage?: CoverImage | null;
  body?: PortableTextBlock[] | null;
};

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
}: NewsletterArticleProps) {
  const shouldRenderMeta = issueLabel || publishedAt || readTime;

  return (
    <article className="grid gap-12 lg:grid-cols-12">
      <header className="lg:col-span-10 lg:col-start-2 space-y-6 text-center lg:text-left">
        {shouldRenderMeta ? (
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-sm text-[color:var(--foreground)]/70">
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
          <p className="text-lg md:text-xl text-[color:var(--foreground)]/80 max-w-3xl mx-auto lg:mx-0">
            {excerpt}
          </p>
        ) : null}
      </header>

      {coverImage ? (
        <figure className="lg:col-span-10 lg:col-start-2 overflow-hidden rounded-3xl shadow-lg">
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
        <div className="lg:col-span-8 lg:col-start-3 prose prose-neutral lg:prose-lg prose-headings:font-serif prose-headings:text-[color:var(--foreground)] prose-p:text-[color:var(--foreground)]/80 prose-li:text-[color:var(--foreground)]/80">
          <PortableText value={body} components={components} />
        </div>
      ) : null}
    </article>
  );
}
