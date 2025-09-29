import { defineType, defineField } from "sanity";

export default defineType({
  name: "blogPost",
  type: "document",
  title: "Blog Post",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      title: "Published At",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mainImage",
      type: "image",
      title: "Main Image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
          validation: (rule) =>
            rule.custom((value, context) => {
              const parent = context?.parent as { asset?: { _ref?: string } };
              return !value && parent?.asset?._ref
                ? "Alt text is required when an image is present"
                : true;
            }),
        }),
      ],
    }),
    defineField({
      name: "body",
      type: "array",
      title: "Content",
      of: [
        { type: "block" }, // Portable Text blocks
        { type: "image" }, // inline images
      ],
    }),
    defineField({
      name: "categories",
      type: "array",
      title: "Categories",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
    defineField({
      name: "author",
      type: "reference",
      title: "Author",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "relatedBlogPosts",
      type: "array",
      of: [{ type: "reference", to: { type: "blogPost" } }],
    }),
  ],
});
