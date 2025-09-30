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
    query: BLOG_POST_QUERY,
    params: await params,
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="container mx-auto grid grid-cols-1 gap-6 p-12">
      <BlogPost {...post} />
    </main>
  );
}
