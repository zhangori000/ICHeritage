import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export default defineType({
  name: "newsletter",
  title: "Newsletter",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "issueLabel",
      title: "Issue label",
      type: "string",
      description: "Shown as the badge in the archive (e.g. Issue #24)",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "readTime",
      title: "Read time",
      type: "string",
      description: "Optional e.g. 8 min read",
    }),
    defineField({
      name: "excerpt",
      title: "Summary",
      type: "text",
      rows: 4,
      validation: (rule) => rule.max(280),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "issueLabel",
      media: "coverImage",
    },
  },
});
