import { sanityFetch } from "@/sanity/lib/live";
import { BLOG_POST_QUERY } from "@/sanity/lib/queries";
import { BlogPost } from "@/components/BlogPost";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { data: post } = await sanityFetch({
    stega: false,
    query: BLOG_POST_QUERY,
    params: await params,
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="wrap py-20 md:py-28">
      <BlogPost {...post} />
    </main>
  );
}
