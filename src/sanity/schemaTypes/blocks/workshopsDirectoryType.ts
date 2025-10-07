import { defineField, defineType } from "sanity";
import { CalendarIcon } from "@sanity/icons";

export const workshopsDirectoryType = defineType({
  name: "workshopsDirectory",
  title: "Workshops Directory",
  type: "object",
  icon: CalendarIcon,
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
      initialValue: "Explore Our Workshops",
    }),
    defineField({
      name: "intro",
      title: "Intro text",
      type: "text",
      rows: 3,
      description: "Optional introduction paragraph above the workshops grid.",
    }),
    defineField({
      name: "searchPlaceholder",
      title: "Search placeholder",
      type: "string",
      initialValue: "Search workshops",
    }),
    defineField({
      name: "categoryCards",
      title: "Category highlights",
      type: "array",
      of: [
        defineField({
          name: "category",
          type: "reference",
          to: [{ type: "workshopCategory" }],
        }),
      ],
      description: "Select up to four categories to highlight. These will also drive the filter list.",
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "showVolunteerBadge",
      title: "Show volunteer badge",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "heading",
    },
    prepare({ title }) {
      return {
        title: title ?? "Workshops directory",
      };
    },
  },
});
