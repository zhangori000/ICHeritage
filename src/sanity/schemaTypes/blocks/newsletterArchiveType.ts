import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const newsletterArchiveType = defineType({
  name: "newsletterArchive",
  title: "Newsletter archive",
  type: "object",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Section heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Section description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "searchPlaceholder",
      title: "Search placeholder",
      type: "string",
      initialValue: "Search newsletters by title or content...",
    }),
    defineField({
      name: "filterLabel",
      title: "Filter button label",
      type: "string",
      initialValue: "Filter by Topic",
    }),
    defineField({
      name: "newsletters",
      title: "Featured newsletters",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "summary",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "issue",
              title: "Issue label",
              type: "string",
            }),
            defineField({
              name: "date",
              title: "Publish date",
              type: "date",
              options: { dateFormat: "YYYY-MM-DD" },
            }),
            defineField({
              name: "readTime",
              title: "Read time",
              type: "string",
            }),
            defineField({
              name: "image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "href",
              title: "Link",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "title", issue: "issue" },
            prepare({ title, issue }) {
              return {
                title: title || "Newsletter",
                subtitle: issue,
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1).max(6),
    }),
    defineField({
      name: "cta",
      title: "Subscribe card",
      type: "object",
      fields: [
        defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "body", type: "text", rows: 3 }),
        defineField({ name: "disclaimer", type: "string" }),
        defineField({ name: "placeholder", type: "string", initialValue: "Enter your email address" }),
        defineField({ name: "buttonLabel", type: "string", initialValue: "Subscribe" }),
        defineField({ name: "buttonHref", type: "string" }),
      ],
    }),
    defineField({
      name: "loadMoreLabel",
      title: "Load more button label",
      type: "string",
      initialValue: "Load More Newsletters",
    }),
  ],
});
