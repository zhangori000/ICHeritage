// ./schemas/event.ts
export default {
  name: "event",
  type: "document",
  title: "Event",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Event Title",
    },
    {
      name: "description",
      type: "text",
      title: "Description",
    },
    {
      name: "date",
      type: "datetime",
      title: "Date & Time",
    },
    {
      name: "location",
      type: "string",
      title: "Location",
    },
    {
      name: "link",
      type: "url",
      title: "External Link (optional)",
      description:
        "Add a URL if this event has a registration page or partner site.",
    },
    {
      name: "needsVolunteer",
      type: "boolean",
      title: "Needs Volunteers?",
    },
    {
      name: "image",
      type: "image",
      title: "Event Image",
      options: {
        hotspot: true, // allows cropping & focal point
      },
    },
    {
      name: "slug",
      type: "slug",
      title: "Slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    },
  ],
};
