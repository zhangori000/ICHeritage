import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

export const volunteersDirectoryType = defineType({
  name: "volunteersDirectory",
  title: "Volunteers Directory",
  type: "object",
  icon: UsersIcon,
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
      initialValue: "Current Volunteer Opportunities",
    }),
    defineField({
      name: "intro",
      title: "Intro text",
      type: "text",
      rows: 3,
      description: "Optional introduction paragraph above the volunteer grid.",
      initialValue:
        "Explore our open volunteer roles across organizational and workshop teams. Filter by interests, availability, and location to find the best fit.",
    }),
    defineField({
      name: "searchPlaceholder",
      title: "Search placeholder",
      type: "string",
      initialValue: "Search volunteer roles",
    }),
  ],
  preview: {
    select: {
      title: "heading",
    },
    prepare({ title }) {
      return {
        title: title ?? "Volunteers directory",
      };
    },
  },
});
