import { defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons";

const CTA_DESCRIPTION =
  "Use a relative path (e.g. /about) for internal links or a full URL (https://example.com).";

const validateHrefValue = (href?: string | null) => {
  if (!href) return true;
  const trimmed = href.trim();
  if (!trimmed) {
    return "Enter a path or URL.";
  }
  if (trimmed.startsWith("/")) {
    return true;
  }
  try {
    new URL(trimmed);
    return true;
  } catch {
    return "Enter a path starting with / or a full URL.";
  }
};

export const chapterApplicationType = defineType({
  name: "chapterApplication",
  title: "Chapter Application",
  type: "object",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "sectionId",
      title: "Section ID",
      type: "string",
      description: "Optional anchor id without the # (e.g. application).",
    }),
    defineField({
      name: "kicker",
      title: "Eyebrow / Kicker",
      type: "string",
      description: "Short label shown above the main heading.",
    }),
    defineField({
      name: "title",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "description",
      title: "Intro description",
      type: "text",
      rows: 3,
      description: "Brief paragraph displayed under the heading.",
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      description: "Four quick facts displayed in the top grid.",
      type: "array",
      validation: (rule) => rule.min(1).max(6),
      of: [
        defineField({
          name: "highlight",
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              description: "Lucide icon name (e.g. book-open).",
              options: {
                list: [
                  { title: "Book", value: "book-open" },
                  { title: "Calendar", value: "calendar" },
                  { title: "Users", value: "users" },
                  { title: "Award", value: "award" },
                  { title: "Sparkles", value: "sparkles" },
                  { title: "Lightbulb", value: "lightbulb" },
                  { title: "Handshake", value: "handshake" },
                  { title: "Graduation", value: "graduation-cap" },
                ],
                layout: "radio",
              },
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required().max(80),
            }),
            defineField({
              name: "body",
              title: "Description",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required().max(160),
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "body",
            },
            prepare({ title, subtitle }) {
              return {
                title: title ?? "Highlight",
                subtitle,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "benefitsHeading",
      title: "Benefits heading",
      type: "string",
      initialValue: "What You'll Receive",
    }),
    defineField({
      name: "benefitsIntro",
      title: "Benefits intro",
      type: "text",
      rows: 3,
      description: "Optional paragraph introducing the benefits list.",
    }),
    defineField({
      name: "benefits",
      title: "Benefits",
      type: "array",
      validation: (rule) => rule.min(1),
      of: [
        defineField({
          name: "benefit",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "description",
            },
            prepare({ title, subtitle }) {
              return {
                title: title ?? "Benefit",
                subtitle,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "cardTitle",
      title: "Card title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cardSubtitle",
      title: "Card subtitle",
      type: "string",
    }),
    defineField({
      name: "cardFacts",
      title: "Card facts",
      description: "Quick stats displayed inside the right column card.",
      type: "array",
      validation: (rule) => rule.min(1),
      of: [
        defineField({
          name: "fact",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "value",
            },
            prepare({ title, subtitle }) {
              return {
                title: title ?? "Fact",
                subtitle,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "cta",
      title: "CTA",
      type: "object",
      initialValue: {
        label: "Begin application",
        href: "/start-a-chapter/apply",
      },
      fields: [
        defineField({
          name: "label",
          title: "Button label",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "href",
          title: "Button link",
          type: "string",
          description: CTA_DESCRIPTION,
          validation: (rule) => rule.custom((value) => validateHrefValue(value)),
        }),
      ],
    }),
    defineField({
      name: "cardFootnote",
      title: "Card footnote",
      type: "string",
      description: "Small text displayed under the CTA button.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      highlights: "highlights",
    },
    prepare({ title, highlights }) {
      const count = Array.isArray(highlights) ? highlights.length : 0;
      return {
        title: title ?? "Chapter application",
        subtitle: count ? `${count} highlight${count === 1 ? "" : "s"}` : undefined,
      };
    },
  },
});
