import { PageBuilder } from "@/components/PageBuilder";
import { sanityFetch } from "@/sanity/lib/live";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";
import type { PAGE_QUERY_RESULT } from "@/sanity/types";

export default async function Page() {
  const { data: page } = await sanityFetch({
    stega: false,
    query: HOME_PAGE_QUERY,
  });

  return page?.homePage?.content ? (
    <PageBuilder
      documentId={page?.homePage?._id}
      documentType={page?.homePage?._type}
      content={page?.homePage?.content as NonNullable<PAGE_QUERY_RESULT>["content"]}
    />
  ) : null;
}
