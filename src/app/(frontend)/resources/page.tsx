import { PageBuilder } from "@/components/PageBuilder";
import { sanityFetch } from "@/sanity/lib/live";
import { PAGE_QUERY, NEWSLETTERS_QUERY } from "@/sanity/lib/queries";
import type { PAGE_QUERYResult, NEWSLETTERS_QUERYResult } from "@/sanity/types";

export default async function ResourcesPage() {
  const [{ data: pageData }, { data: newsletterData }] = await Promise.all([
    sanityFetch<typeof PAGE_QUERY>({
      query: PAGE_QUERY,
      params: { slug: "resources" },
    }),
    sanityFetch<typeof NEWSLETTERS_QUERY>({
      query: NEWSLETTERS_QUERY,
    }),
  ]);

  const page: PAGE_QUERYResult | null = pageData ?? null;
  const newsletters: NEWSLETTERS_QUERYResult = newsletterData ?? [];

  if (!page?.content) {
    return null;
  }

  const newsletterCards = newsletters.map((item, index) => {
    const slugValue = item?.slug ?? null;
    return {
      _key: item?._id ?? slugValue ?? `newsletter-${index}`,
      title: item?.title || undefined,
      summary: item?.excerpt || undefined,
      issue: item?.issueLabel || undefined,
      date: item?.publishedAt || undefined,
      readTime: item?.readTime || undefined,
      image: item?.coverImage ?? undefined,
      href: slugValue ? `/resources/newsletter/${slugValue}` : undefined,
    };
  });

  const contentWithNewsletters = page.content.map((block) =>
    block && block._type === "newsletterArchive"
      ? { ...block, newsletters: newsletterCards }
      : block
  );

  return (
    <PageBuilder
      documentId={page._id}
      documentType={page._type}
      content={contentWithNewsletters}
    />
  );
}
