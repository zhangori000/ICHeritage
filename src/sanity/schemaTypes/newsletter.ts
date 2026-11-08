import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export default defineType({
  name: "newsletter",
  title: "Article / Newsletter",
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
      description:
        "The article text. You can add headings, links, and inline images here.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "attachment",
      title: "Downloadable file (optional)",
      type: "file",
      description:
        "Upload a PDF version of the article or newsletter. A download button will appear on the article page.",
      options: { accept: "application/pdf,.pdf" },
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
