import { redirect } from "next/navigation";

import { PageBuilder } from "@/components/PageBuilder";
import { sanityFetch } from "@/sanity/lib/live";
import { PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { getSectionVisibility, isPageHidden } from "@/lib/siteVisibility";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [{ data: page }, { data: settings }] = await Promise.all([
    sanityFetch({ query: PAGE_QUERY, params: { slug } }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);

  // Sections switched off in Site Settings (e.g. Workshops, Brands) send
  // visitors home instead of showing the page.
  if (isPageHidden(slug, getSectionVisibility(settings))) {
    redirect("/");
  }

  return page?.content ? (
    <PageBuilder
      documentId={page._id}
      documentType={page._type}
      content={page.content}
    />
  ) : null;
}
