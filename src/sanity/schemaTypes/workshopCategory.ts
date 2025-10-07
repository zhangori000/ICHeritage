import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";

export const workshopCategoryType = defineType({
  name: "workshopCategory",
  title: "Workshop Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 64 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description:
        "Lucide icon name (e.g. palette, chef-hat, book-open, heart).",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});
