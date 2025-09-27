// ./schemas/blogPost.ts
export default {
  name: "blogPost",
  type: "document",
  title: "Blog Post",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "author",
      type: "string", // could later be a reference to an "author" schema
      title: "Author",
    },
    {
      name: "publishedAt",
      type: "datetime",
      title: "Published At",
    },
    {
      name: "body",
      type: "array",
      title: "Content",
      of: [
        { type: "block" }, // rich text blocks (Sanity calls this Portable Text)
        { type: "image" }, // allow inline images
      ],
    },
    {
      name: "slug",
      type: "slug",
      title: "Slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    },
  ],
};
