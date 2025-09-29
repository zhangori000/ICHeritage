import { defineType, defineField } from "sanity";

export default defineType({
  name: "author",
  type: "document",
  title: "Author",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Name",
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: { source: "name", maxLength: 96 },
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Profile Image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio",
      type: "array",
      title: "Bio",
      of: [{ type: "block" }],
    }),
  ],
});
