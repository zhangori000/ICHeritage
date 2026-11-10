import { Author } from "@/components/Author";
import { Categories } from "@/components/Categories";
import type { BLOG_POSTS_QUERY_RESULT } from "@/sanity/types";
import { PublishedAt } from "@/components/PublishedAt";
import Link from "next/link";

/** One row of the post index: categories, title and author, date. */
export function BlogPostCard(props: BLOG_POSTS_QUERY_RESULT[0]) {
  const { title, author, publishedAt, categories } = props;

  return (
    <Link
      href={`/blogPosts/${props.slug!.current}`}
      className="row-hover grid grid-cols-1 gap-2 border-b border-[color:var(--hairline)] py-6 md:grid-cols-[140px_minmax(0,1fr)_auto] md:items-baseline md:gap-6"
    >
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        <Categories categories={categories} />
      </div>
      <div className="min-w-0">
        {title ? (
          <h2 className="font-serif text-2xl leading-tight text-[color:var(--ink)] md:text-[28px]">
            {title}
          </h2>
        ) : null}
        <div className="mt-3">
          <Author author={author} />
        </div>
      </div>
      <PublishedAt publishedAt={publishedAt} />
    </Link>
  );
}
