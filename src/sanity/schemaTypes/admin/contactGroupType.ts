import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

export const contactGroupType = defineType({
  name: "contactGroup",
  title: "Contact Group",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 64,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 64),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Optional context shown inside the studio for this list of contacts.",
    }),
    defineField({
      name: "notifyChapterApplications",
      title: "Use for chapter applications",
      type: "boolean",
      initialValue: false,
      description:
        "Enable this to have chapter application submissions emailed to this group. Only one contact group should enable this flag.",
    }),
    defineField({
      name: "recipients",
      title: "Recipients",
      type: "array",
      validation: (rule) => rule.min(1),
      of: [
        defineField({
          name: "recipient",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "email",
              title: "Email",
              type: "string",
              validation: (rule) => rule.required().email(),
            }),
            defineField({
              name: "role",
              title: "Role or context",
              type: "string",
              description: "Optional note that appears in the preview list.",
            }),
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "email",
            },
            prepare({ title, subtitle }) {
              return {
                title: title ?? "Recipient",
                subtitle,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      recipients: "recipients",
    },
    prepare({ title, recipients }) {
      const count = Array.isArray(recipients) ? recipients.length : 0;
      return {
        title: title ?? "Contact group",
        subtitle: count ? `${count} recipient${count === 1 ? "" : "s"}` : "No recipients yet",
      };
    },
  },
});

