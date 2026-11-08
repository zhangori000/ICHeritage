import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";

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
      description:
        "The article cards below this heading are filled in automatically from Content → Resources → Articles & Newsletters.",
    }),
    // Search, filter and "load more" are not implemented on the site yet, so
    // their labels are hidden from editors until those features exist.
    defineField({
      name: "searchPlaceholder",
      title: "Search placeholder (not used yet)",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "filterLabel",
      title: "Filter button label (not used yet)",
      type: "string",
      hidden: true,
    }),
    // Cards on the live site are generated automatically from the
    // "Article / Newsletter" documents, so this manual list is hidden in the
    // Studio. It is kept only so older page documents still validate.
    defineField({
      name: "newsletters",
      title: "Featured newsletters (legacy, not used)",
      type: "array",
      hidden: true,
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
    }),
    defineField({
      name: "cta",
      title: "Newsletter teaser card",
      description:
        "Shown under the articles with a “coming soon” badge. Email sign-up is not live yet, so no form is displayed.",
      type: "object",
      fields: [
        defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "body", type: "text", rows: 3 }),
        defineField({ name: "disclaimer", type: "string", hidden: true }),
        defineField({ name: "placeholder", type: "string", hidden: true }),
        defineField({ name: "buttonLabel", type: "string", hidden: true }),
        defineField({ name: "buttonHref", type: "string", hidden: true }),
      ],
    }),
    defineField({
      name: "loadMoreLabel",
      title: "Load more button label (not used yet)",
      type: "string",
      hidden: true,
    }),
  ],
});
