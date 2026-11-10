import { notFound } from "next/navigation";

import { NewsletterArticle } from "@/components/NewsletterArticle";
import { sanityFetch } from "@/sanity/lib/live";
import { NEWSLETTER_QUERY } from "@/sanity/lib/queries";
import type { NEWSLETTER_QUERY_RESULT } from "@/sanity/types";

type NewsletterPageParams = { slug: string };

export default async function NewsletterPage({
  params,
}: {
  params: Promise<NewsletterPageParams>;
}) {
  const { slug } = await params;

  const { data } = await sanityFetch<typeof NEWSLETTER_QUERY>({
    stega: false,
    query: NEWSLETTER_QUERY,
    params: { slug },
  });

  const newsletter: NEWSLETTER_QUERY_RESULT | null = data ?? null;

  if (!newsletter) {
    notFound();
  }

  return (
    <main className="wrap py-20 md:py-28">
      <NewsletterArticle {...newsletter} />
    </main>
  );
}
