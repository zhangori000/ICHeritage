import type { BLOG_POST_QUERY_RESULT } from "@/sanity/types";

type CategoriesProps = {
  categories: NonNullable<BLOG_POST_QUERY_RESULT>["categories"];
};

/** Category tags as small-caps eyebrow labels. The parent lays them out. */
export function Categories({ categories }: CategoriesProps) {
  return categories.map((category) => {
    // guard against null entries AND null/empty titles
    if (!category?.title) return null;

    return (
      <span key={category._id} className="eyebrow whitespace-nowrap">
        {category.title}
      </span>
    );
  });
}
