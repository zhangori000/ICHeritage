import { defineField, defineType } from "sanity";

export const workshopVolunteerType = defineType({
  name: "workshopVolunteer",
  title: "Workshop Volunteer",
  type: "document",
  groups: [
    { name: "volunteer", title: "Volunteer" },
    { name: "workshop", title: "Workshop" },
    { name: "notes", title: "Notes" },
  ],
  fields: [
    defineField({
      name: "workshop",
      title: "Workshop",
      type: "reference",
      to: [{ type: "workshop" }],
      validation: (Rule) => Rule.required(),
      group: "workshop",
    }),
    defineField({
      name: "workshopTitle",
      type: "string",
      readOnly: true,
      group: "workshop",
    }),
    defineField({
      name: "workshopSlug",
      type: "string",
      readOnly: true,
      group: "workshop",
    }),
    defineField({
      name: "workshopDate",
      type: "string",
      readOnly: true,
      group: "workshop",
    }),
    defineField({
      name: "workshopLocation",
      type: "string",
      readOnly: true,
      group: "workshop",
    }),
    defineField({
      name: "pageUrl",
      type: "url",
      readOnly: true,
      group: "workshop",
    }),
    defineField({
      name: "firstName",
      type: "string",
      validation: (Rule) => Rule.required(),
      group: "volunteer",
    }),
    defineField({
      name: "lastName",
      type: "string",
      validation: (Rule) => Rule.required(),
      group: "volunteer",
    }),
    defineField({
      name: "email",
      type: "email",
      validation: (Rule) => Rule.required(),
      group: "volunteer",
    }),
    defineField({
      name: "phone",
      type: "string",
      group: "volunteer",
    }),
    defineField({
      name: "pronouns",
      type: "string",
      group: "volunteer",
    }),
    defineField({
      name: "interests",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "volunteer",
    }),
    defineField({
      name: "availability",
      type: "text",
      rows: 2,
      group: "volunteer",
    }),
    defineField({
      name: "experience",
      title: "How they’d like to help",
      type: "text",
      rows: 4,
      group: "volunteer",
    }),
    defineField({
      name: "notes",
      type: "text",
      rows: 4,
      group: "notes",
    }),
    defineField({
      name: "submittedAt",
      type: "datetime",
      readOnly: true,
      group: "notes",
    }),
    defineField({
      name: "source",
      type: "string",
      readOnly: true,
      group: "notes",
    }),
  ],
  preview: {
    select: {
      title: "firstName",
      lastName: "lastName",
      subtitle: "workshopTitle",
    },
    prepare({ title, lastName, subtitle }) {
      const fullName = [title, lastName].filter(Boolean).join(" ");
      return {
        title: fullName || "Volunteer",
        subtitle: subtitle || "Workshop volunteer",
      };
    },
  },
});

