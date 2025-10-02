import { PageBuilder } from "@/components/PageBuilder";
import { sanityFetch } from "@/sanity/lib/live";
import { PAGE_QUERY, NEWSLETTERS_QUERY } from "@/sanity/lib/queries";
import type { PAGE_QUERYResult, NEWSLETTERS_QUERYResult } from "@/sanity/types";

export default async function ResourcesPage() {
  const [{ data: page }, { data: newsletters }] = await Promise.all([
    sanityFetch<{ data: PAGE_QUERYResult }>({
      query: PAGE_QUERY,
      params: { slug: "resources" },
    }),
    sanityFetch<{ data: NEWSLETTERS_QUERYResult }>({
      query: NEWSLETTERS_QUERY,
    }),
  ]);

  if (!page?.content) {
    return null;
  }

  const newsletterCards = Array.isArray(newsletters)
    ? newsletters.map((item, index) => {
        const slugValue = item?.slug ?? null;
        return {
          _key: item?._id ?? slugValue ?? `newsletter-${index}`,
          title: item?.title ?? null,
          summary: item?.excerpt ?? null,
          issue: item?.issueLabel ?? null,
          date: item?.publishedAt ?? null,
          readTime: item?.readTime ?? null,
          image: item?.coverImage ?? null,
          href: slugValue ? `/resources/newsletter/${slugValue}` : null,
        };
      })
    : [];

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
