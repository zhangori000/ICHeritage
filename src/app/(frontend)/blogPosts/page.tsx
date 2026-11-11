import { sanityFetch } from "@/sanity/lib/live";
import { BLOG_POSTS_QUERY } from "@/sanity/lib/queries";
import type { BLOG_POSTS_QUERY_RESULT } from "@/sanity/types";
import { BlogPostCard } from "@/components/BlogPostCard";
import { Title } from "@/components/Title";

export default async function Page() {
  const { data: posts } = await sanityFetch<typeof BLOG_POSTS_QUERY>({
    stega: false,
    query: BLOG_POSTS_QUERY,
  });

  // (optional) narrow in case types allow null/undefined
  const safePosts: BLOG_POSTS_QUERY_RESULT = posts ?? [];

  return (
    <main className="wrap py-20 md:py-28">
      <Title>Post Index</Title>
      <div className="mt-12 border-t border-[color:var(--ink)]">
        {safePosts.map((post) => (
          <BlogPostCard key={post._id} {...post} />
        ))}
      </div>
    </main>
  );
}
