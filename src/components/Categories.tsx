import type { BLOG_POST_QUERY_RESULT } from "@/sanity/types";

type CategoriesProps = {
  categories: NonNullable<BLOG_POST_QUERY_RESULT>["categories"];
};

export function Categories({ categories }: CategoriesProps) {
  return categories.map((category) => {
    // guard against null entries AND null/empty titles
    if (!category?.title) return null;

    return (
      <span
        key={category._id}
        className="bg-cyan-50 rounded-full px-2 py-1 leading-none whitespace-nowrap text-sm font-semibold text-cyan-700"
      >
        {category.title}
      </span>
    );
  });
}
