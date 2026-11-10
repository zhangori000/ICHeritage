"use client";

import Link from "next/link";
import { createDataAttribute } from "next-sanity";
import type { BLOG_POST_QUERY_RESULT } from "@/sanity/types";
import { client } from "@/sanity/lib/client";
import { useOptimistic } from "next-sanity/hooks";

const { projectId, dataset, stega } = client.config();
export const createDataAttributeConfig = {
  projectId,
  dataset,
  baseUrl: typeof stega.studioUrl === "string" ? stega.studioUrl : "",
};

export function RelatedBlogPosts({
  relatedBlogPosts,
  documentId,
  documentType,
}: {
  relatedBlogPosts: NonNullable<BLOG_POST_QUERY_RESULT>["relatedBlogPosts"];
  documentId: string;
  documentType: string;
}) {
  const posts = useOptimistic<
    NonNullable<BLOG_POST_QUERY_RESULT>["relatedBlogPosts"] | undefined,
    NonNullable<BLOG_POST_QUERY_RESULT>
  >(relatedBlogPosts, (state, action) => {
    if (action.id === documentId && action?.document?.relatedBlogPosts) {
      // Optimistic document only has _ref values, not resolved references
      return action.document.relatedBlogPosts.map(
        (post) => state?.find((p) => p._key === post._key) ?? post
      );
    }
    return state;
  });
  if (!posts) {
    return null;
  }
  return (
    <aside className="not-prose mt-16 border-t border-[color:var(--ink)] pt-6">
      <h2 className="eyebrow eyebrow-rule">Related Posts</h2>
      <ul
        className="mt-4 flex flex-col"
        data-sanity={createDataAttribute({
          ...createDataAttributeConfig,
          id: documentId,
          type: documentType,
          path: "relatedBlogPosts",
        }).toString()}
      >
        {posts.map((post) => (
          <li
            key={post._key}
            className="border-b border-[color:var(--hairline)]"
            data-sanity={createDataAttribute({
              ...createDataAttributeConfig,
              id: documentId,
              type: documentType,
              path: `relatedBlogPosts[_key=="${post._key}"]`,
            }).toString()}
          >
            <Link
              href={`/blogPosts/${post?.slug?.current}`}
              className="row-hover block py-4 font-serif text-xl leading-tight text-[color:var(--ink)] md:text-2xl"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
