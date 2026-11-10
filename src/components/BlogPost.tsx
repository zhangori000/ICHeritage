import { Author } from "@/components/Author";
import { Categories } from "@/components/Categories";
import { components } from "@/sanity/portableTextComponents";
import { PortableText } from "next-sanity";
import type { BLOG_POST_QUERY_RESULT } from "@/sanity/types";
import { PublishedAt } from "@/components/PublishedAt";
import { Title } from "@/components/Title";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { RelatedBlogPosts } from "@/components/RelatedBlogPosts";

export function BlogPost(props: NonNullable<BLOG_POST_QUERY_RESULT>) {
  const {
    _id,
    title,
    author,
    mainImage,
    body,
    publishedAt,
    categories,
    relatedBlogPosts,
  } = props;

  return (
    <article>
      <header className="flex flex-col items-start gap-5">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <Categories categories={categories} />
          <PublishedAt publishedAt={publishedAt} />
        </div>
        <Title>{title}</Title>
        <Author author={author} />
      </header>

      {mainImage ? (
        <figure className="mt-12 max-w-4xl">
          <div className="overflow-hidden border border-[color:var(--ink)] bg-[color:var(--paper-slot)]">
            <Image
              src={urlFor(mainImage).width(1200).height(750).fit("crop").url()}
              width={1200}
              height={750}
              alt={mainImage.alt || ""}
              className="h-auto w-full"
              priority
            />
          </div>
        </figure>
      ) : null}

      {body ? (
        <div className="prose prose-lg mt-12 max-w-[68ch] text-[color:var(--ink-soft)] prose-headings:font-serif prose-headings:font-normal prose-headings:text-[color:var(--ink)] prose-p:text-[color:var(--ink-soft)] prose-li:text-[color:var(--ink-soft)] prose-strong:text-[color:var(--ink)] prose-a:text-[color:var(--seal)] prose-img:rounded-none prose-blockquote:border-[color:var(--hairline)] prose-blockquote:font-normal prose-blockquote:not-italic prose-hr:border-[color:var(--hairline)]">
          <PortableText value={body} components={components} />
          <RelatedBlogPosts
            relatedBlogPosts={relatedBlogPosts}
            documentId={_id}
            documentType="post"
          />
        </div>
      ) : null}
    </article>
  );
}
