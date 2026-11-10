import { defineField, defineType } from "sanity";
import { BlockElementIcon } from "@sanity/icons/BlockElement";

/**
 * Closing call to action: the one dark band at the end of a page, with a
 * short display heading, a sentence or two, and up to two buttons.
 * Example: "Bring heritage to your campus." / Start a chapter · Volunteer.
 */
export const closingCtaType = defineType({
  name: "closingCta",
  title: "Closing call to action",
  type: "object",
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: "Short and direct, e.g. “Bring heritage to your campus.”",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "body",
      title: "Supporting text",
      type: "text",
      rows: 3,
      description: "One or two sentences. Optional.",
    }),
    defineField({
      name: "primaryCta",
      title: "Primary button",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({
          name: "href",
          title: "Link",
          type: "string",
          description: "Relative path (e.g. /start-a-chapter) or full URL.",
        }),
      ],
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary button",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({
          name: "href",
          title: "Link",
          type: "string",
          description: "Relative path (e.g. /volunteer) or full URL.",
        }),
      ],
    }),
  ],
  preview: {
    select: { heading: "heading" },
    prepare({ heading }) {
      return {
        title: heading ?? "Closing call to action",
        subtitle: "Dark band with buttons",
      };
    },
  },
});
