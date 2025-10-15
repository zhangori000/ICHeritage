import { defineField, defineType } from "sanity";
import { SparklesIcon } from "@sanity/icons";

export const brandPromosType = defineType({
  name: "brandPromos",
  title: "Brand Promos",
  type: "object",
  icon: SparklesIcon,
  fields: [
    defineField({
      name: "sectionId",
      title: "Section anchor id",
      type: "string",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "intro",
      title: "Intro text",
      type: "text",
      rows: 3,
      description: "Optional introductory copy above the promos grid.",
    }),
    defineField({
      name: "brands",
      title: "Brands to feature",
      type: "array",
      of: [
        defineField({
          name: "brand",
          type: "reference",
          to: [{ type: "brand" }],
        }),
      ],
      validation: (rule) => rule.min(1).max(6),
      description: "Select brand entries to display in the grid.",
    }),
  ],
  preview: {
    select: {
      title: "heading",
      count: "brands.length",
    },
    prepare({ title, count }) {
      return {
        title: title ?? "Brand promos",
        subtitle: count ? `${count} brand${count === 1 ? "" : "s"}` : "No brands selected",
      };
    },
  },
});
