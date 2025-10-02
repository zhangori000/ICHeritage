import { notFound } from "next/navigation";

import { NewsletterArticle } from "@/components/NewsletterArticle";
import { sanityFetch } from "@/sanity/lib/live";
import { NEWSLETTER_QUERY } from "@/sanity/lib/queries";
import type { NEWSLETTER_QUERYResult } from "@/sanity/types";

type NewsletterPageParams = { slug: string };

export default async function NewsletterPage({
  params,
}: {
  params: Promise<NewsletterPageParams>;
}) {
  const { slug } = await params;

  const { data } = await sanityFetch<typeof NEWSLETTER_QUERY>({
    query: NEWSLETTER_QUERY,
    params: { slug },
  });

  const newsletter: NEWSLETTER_QUERYResult | null = data ?? null;

  if (!newsletter) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-16 space-y-16">
      <NewsletterArticle {...newsletter} />
    </main>
  );
}
