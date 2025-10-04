import { defineArrayMember, defineField, defineType } from "sanity";
import { CommentIcon } from "@sanity/icons";

export const storiesImpactType = defineType({
  name: "storiesImpact",
  title: "Stories of Impact",
  type: "object",
  icon: CommentIcon,
  fields: [
    defineField({
      name: "sectionId",
      title: "Section anchor id",
      type: "string",
      description: "Optional anchor id without the # (e.g. impact-stories).",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro text",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "stories",
      title: "Stories",
      type: "array",
      validation: (rule) => rule.min(1),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "quote",
              title: "Quote",
              type: "text",
              rows: 4,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "role",
              title: "Role",
              type: "string",
            }),
            defineField({
              name: "location",
              title: "Location",
              type: "string",
            }),
            defineField({
              name: "program",
              title: "Program",
              type: "string",
              description: "Program or initiative associated with the story.",
            }),
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "program",
            },
            prepare({ title, subtitle }) {
              return {
                title: title ?? "Impact story",
                subtitle,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "statsCard",
      title: "Stats card",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          initialValue: "Community Impact by the Numbers",
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "stats",
          title: "Stats",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "value",
                  title: "Value",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "label",
                  title: "Label",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "color",
                  title: "Accent color",
                  type: "string",
                  options: {
                    list: [
                      { title: "Primary", value: "primary" },
                      { title: "Secondary", value: "secondary" },
                      { title: "Accent", value: "accent" },
                    ],
                  },
                  initialValue: "primary",
                }),
              ],
              preview: {
                select: { title: "value", subtitle: "label" },
                prepare({ title, subtitle }) {
                  return {
                    title: title ?? "Stat",
                    subtitle,
                  };
                },
              },
            }),
          ],
          validation: (rule) => rule.min(1).max(6),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "heading",
      stories: "stories",
    },
    prepare({ title, stories }) {
      const count = Array.isArray(stories) ? stories.length : 0;
      return {
        title: title ?? "Stories of impact",
        subtitle: count ? `${count} story${count === 1 ? "" : "ies"}` : undefined,
      };
    },
  },
});
