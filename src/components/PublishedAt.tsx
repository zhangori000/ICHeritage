import type { BLOG_POST_QUERY_RESULT } from "@/sanity/types";
import dayjs from "dayjs";

type PublishedAtProps = {
  publishedAt: NonNullable<BLOG_POST_QUERY_RESULT>["publishedAt"];
};

export function PublishedAt({ publishedAt }: PublishedAtProps) {
  return publishedAt ? (
    <p className="text-base text-slate-700">
      {dayjs(publishedAt).format("D MMMM YYYY")}
    </p>
  ) : null;
}
