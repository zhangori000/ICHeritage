import { defineArrayMember, defineField, defineType } from "sanity";
import { LightbulbIcon } from "@sanity/icons";

export const missionStatementType = defineType({
  name: "missionStatement",
  title: "Mission Statement",
  type: "object",
  icon: LightbulbIcon,
  fields: [
    defineField({
      name: "sectionId",
      title: "Section anchor id",
      type: "string",
      description: "Optional anchor id without the # (e.g. mission).",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Our Mission",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mission",
      title: "Mission statement",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pillars",
      title: "Mission pillars",
      type: "array",
      of: [
        defineArrayMember({
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
            select: { title: "title" },
            prepare({ title }) {
              return {
                title: title ?? "Pillar",
                subtitle: "Mission pillar",
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1).max(3),
    }),
    defineField({
      name: "visionHeading",
      title: "Vision heading",
      type: "string",
      initialValue: "Our Vision",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "vision",
      title: "Vision statement",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "heading",
      pillars: "pillars",
    },
    prepare({ title, pillars }) {
      const count = Array.isArray(pillars) ? pillars.length : 0;
      return {
        title: title ?? "Mission statement",
        subtitle: count ? `${count} pillar${count === 1 ? "" : "s"}` : undefined,
      };
    },
  },
});
