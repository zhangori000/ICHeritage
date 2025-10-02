import { notFound } from "next/navigation";

import { NewsletterArticle } from "@/components/NewsletterArticle";
import { sanityFetch } from "@/sanity/lib/live";
import { NEWSLETTER_QUERY } from "@/sanity/lib/queries";
import type { BLOG_POST_QUERYResult } from "@/sanity/types";
import type { PortableTextBlock } from "sanity";

type NewsletterPageParams = { slug: string };

type CoverImage = NonNullable<NonNullable<BLOG_POST_QUERYResult>["mainImage"]>;

type NewsletterQueryResult = {
  _id: string;
  title: string | null;
  issueLabel?: string | null;
  publishedAt?: string | null;
  readTime?: string | null;
  excerpt?: string | null;
  coverImage?: CoverImage | null;
  body?: PortableTextBlock[] | null;
} | null;

export default async function NewsletterPage({
  params,
}: {
  params: Promise<NewsletterPageParams>;
}) {
  const { slug } = await params;

  const { data } = await sanityFetch<NewsletterQueryResult>({
    query: NEWSLETTER_QUERY,
    params: { slug },
  });

  if (!data) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-16 space-y-16">
      <NewsletterArticle {...data} />
    </main>
  );
}
