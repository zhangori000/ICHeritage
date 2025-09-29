// ./schemas/event.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "event",
  type: "document",
  title: "Event",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Event Title",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
    }),
    defineField({
      name: "date",
      type: "datetime",
      title: "Date & Time",
    }),
    defineField({
      name: "location",
      type: "string",
      title: "Location",
    }),
    defineField({
      name: "link",
      type: "url",
      title: "External Link (optional)",
      description:
        "Add a URL if this event has a registration page or partner site.",
    }),
    defineField({
      name: "needsVolunteer",
      type: "boolean",
      title: "Needs Volunteers?",
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Event Image",
      options: {
        hotspot: true, // allows cropping & focal point
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
          validation: (rule) =>
            rule.custom((value, context) => {
              const parent = context?.parent as { asset?: { _ref?: string } };

              // If an image asset exists but no alt text was entered → error
              return !value && parent?.asset?._ref
                ? "Alt text is required when an image is present"
                : true;
            }),
        }),
      ],
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
  ],
});
