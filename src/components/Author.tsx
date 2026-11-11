import type { BLOG_POST_QUERY_RESULT } from "@/sanity/types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

type AuthorProps = {
  author: NonNullable<BLOG_POST_QUERY_RESULT>["author"];
};

export function Author({ author }: AuthorProps) {
  return author?.image || author?.name ? (
    <div className="flex items-center gap-3">
      {author?.image ? (
        <Image
          src={urlFor(author.image).width(80).height(80).url()}
          width={80}
          height={80}
          alt={author.name || ""}
          className="size-10 border border-[color:var(--ink)] bg-[color:var(--paper-slot)] object-cover"
        />
      ) : null}
      {author?.name ? (
        <p className="text-sm text-[color:var(--ink-soft)]">{author.name}</p>
      ) : null}
    </div>
  ) : null;
}
