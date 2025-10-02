import { defineField, defineType } from "sanity";
import { ThLargeIcon } from "@sanity/icons";

export const initiativesGridType = defineType({
  name: "initiativesGrid",
  title: "Initiatives Grid",
  type: "object",
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Section heading",
      type: "string",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "intro",
      title: "Intro text",
      type: "text",
      rows: 3,
      description: "Short paragraph beneath the heading.",
    }),
    defineField({
      name: "cards",
      title: "Cards",
      type: "array",
      of: [
        defineField({
          name: "card",
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
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "alt",
              title: "Image alt text",
              type: "string",
              description: "Describe the image for screen readers.",
            }),
            defineField({
              name: "cta",
              title: "Card CTA",
              type: "object",
              fields: [
                defineField({
                  name: "label",
                  title: "Label",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "href",
                  title: "Link",
                  type: "string",
                  description: "Relative path (e.g. /resources) or full URL.",
                  validation: (rule) =>
                    rule.required().custom((value) => {
                      if (!value) return true;
                      const trimmed = value.trim();
                      if (!trimmed) return "Enter a path or URL";
                      if (
                        trimmed.startsWith("/") ||
                        trimmed.startsWith("http://") ||
                        trimmed.startsWith("https://") ||
                        trimmed.startsWith("mailto:") ||
                        trimmed.startsWith("tel:")
                      ) {
                        return true;
                      }
                      return "Start with / for internal links or use a full URL";
                    }),
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "title",
            },
            prepare({ title }) {
              return {
                title: title ?? "Untitled card",
                subtitle: "Initiatives card",
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "sectionCta",
      title: "Bottom CTA",
      type: "object",
      fields: [
        defineField({ name: "label", type: "string" }),
        defineField({
          name: "href",
          type: "string",
          description: "Relative path (e.g. /resources) or full URL.",
          validation: (rule) =>
            rule.custom((value) => {
              if (!value) return true;
              const trimmed = value.trim();
              if (!trimmed) return "Enter a path or URL";
              if (
                trimmed.startsWith("/") ||
                trimmed.startsWith("http://") ||
                trimmed.startsWith("https://") ||
                trimmed.startsWith("mailto:") ||
                trimmed.startsWith("tel:")
              ) {
                return true;
              }
              return "Start with / for internal links or use a full URL";
            }),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      heading: "heading",
      cards: "cards",
    },
    prepare({ heading, cards }) {
      const count = Array.isArray(cards) ? cards.length : 0;
      return {
        title: heading ?? "Initiatives grid",
        subtitle: count === 1 ? "1 card" : `${count} cards`,
      };
    },
  },
});
