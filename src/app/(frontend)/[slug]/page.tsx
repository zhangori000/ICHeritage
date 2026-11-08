import { redirect } from "next/navigation";

import { PageBuilder } from "@/components/PageBuilder";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import {
  PAGE_QUERY,
  PAGE_SLUGS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";
import { getSectionVisibility, isPageHidden } from "@/lib/siteVisibility";

// Slugs that have their own route file and must not be generated here.
const RESERVED_SLUGS = new Set(["home", "resources", "gallery", "studio"]);

/**
 * Prerender every page-builder page at build time. Sanity Live keeps them
 * fresh (published edits revalidate the page), and unknown slugs still render
 * on demand, so new pages work without a redeploy.
 */
export async function generateStaticParams() {
  const pages = await client.fetch(PAGE_SLUGS_QUERY);
  return (pages ?? [])
    .map((page) => page.slug)
    .filter((slug): slug is string => Boolean(slug) && !RESERVED_SLUGS.has(slug!))
    .map((slug) => ({ slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [{ data: page }, { data: settings }] = await Promise.all([
    sanityFetch({ stega: false, query: PAGE_QUERY, params: { slug } }),
    sanityFetch({ stega: false, query: SITE_SETTINGS_QUERY }),
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
