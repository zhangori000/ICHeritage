import { defineType, defineField } from "sanity";

export default defineType({
  name: "category",
  type: "document",
  title: "Category",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: { source: "title", maxLength: 96 },
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
    }),
  ],
});
