import { defineField, defineType } from "sanity";

/**
 * Reusable "color choice" object:
 * - token: pick from your CSS variable tokens (easy for consistency)
 * - customHex: optional free-form hex (if set, it overrides token)
 */
export const colorChoiceType = defineType({
  name: "colorChoice",
  title: "Color",
  type: "object",
  fields: [
    defineField({
      name: "token",
      title: "Preset",
      type: "string",
      options: {
        list: [
          { title: "Foreground", value: "foreground" },
          { title: "Primary", value: "primary" },
          { title: "Muted foreground", value: "muted-foreground" },
          { title: "White", value: "white" },
          { title: "Black", value: "black" },
        ],
        layout: "radio", // clearer than a dropdown for non-devs
      },
      initialValue: "foreground",
      description:
        "Choose a site color token. Great for consistency and theme updates.",
    }),
    defineField({
      name: "customHex",
      title: "Custom hex (optional)",
      type: "string",
      description: "Overrides preset if provided, e.g. #A73438",
      validation: (rule) =>
        rule
          .regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, {
            name: "hex color",
            invert: false,
          })
          .error("Use a valid hex like #fff or #A73438"),
    }),
  ],
  preview: {
    select: { token: "token", customHex: "customHex" },
    prepare({ token, customHex }) {
      return {
        title: customHex || token || "Color",
        subtitle: customHex ? "Custom hex" : "Preset token",
      };
    },
  },
});
