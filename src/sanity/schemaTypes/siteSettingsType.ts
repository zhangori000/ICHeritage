// src/sanity/schemaTypes/siteSettingsType.ts
import { defineField, defineType } from "sanity";
import { ControlsIcon } from "@sanity/icons";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: ControlsIcon,
  fields: [
    // Existing fields you already had:
    defineField({
      name: "homePage",
      type: "reference",
      to: [{ type: "page" }],
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),

    // --- ORGANIZATION / BRANDING -------------------------------------------
    defineField({
      name: "orgName",
      title: "Organization name",
      type: "string",
      initialValue: "ICHeritage",
      validation: (rule) => rule.required(),
    }),

    // --- SECTION VISIBILITY -------------------------------------------------
    // Lets the site owner switch optional sections on/off without a deploy.
    // Hidden sections disappear from the header menu and their pages send
    // visitors back to the home page. Anything left unset counts as hidden.
    defineField({
      name: "navigation",
      title: "Section visibility",
      type: "object",
      description:
        "Switch optional sections of the website on or off. Sections that are off are removed from the menu and their pages redirect to the home page.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "showWorkshops",
          title: "Show Workshops",
          type: "boolean",
          description: "Shows the Workshops link in the menu and the /workshops pages.",
          initialValue: false,
        }),
        defineField({
          name: "showBrands",
          title: "Show Brands",
          type: "boolean",
          description: "Shows the Brands link in the menu and the /brands page.",
          initialValue: false,
        }),
      ],
    }),

    // --- FOOTER: LEFT COLUMN ------------------------------------------------
    defineField({
      name: "footerBlurb",
      title: "Footer blurb",
      type: "text",
      rows: 3,
      description: "One or two sentences that describe your org.",
    }),

    // Social links as individual optional URLs
    defineField({
      name: "social",
      title: "Social links",
      type: "object",
      fields: [
        { name: "facebook", type: "url", title: "Facebook" },
        { name: "twitter", type: "url", title: "Twitter / X" },
        { name: "instagram", type: "url", title: "Instagram" },
        { name: "youtube", type: "url", title: "YouTube" },
      ],
    }),

    // --- FOOTER: QUICK LINKS (center-left column) ---------------------------
    defineField({
      name: "quickLinks",
      title: "Quick links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              type: "string",
              title: "Label",
              validation: (r) => r.required(),
            },
            {
              name: "href",
              type: "string",
              title: "Href",
              validation: (r) => r.required(),
            },
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
      options: { sortable: true },
    }),

    // --- FOOTER: CONTACT (center-right column) ------------------------------
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
    }),
    defineField({
      name: "contactPhone",
      title: "Phone number",
      type: "string",
    }),

    // --- FOOTER: NEWSLETTER (right column) ---------------------------------
    defineField({
      name: "newsletter",
      title: "Newsletter",
      type: "object",
      fields: [
        {
          name: "enabled",
          type: "boolean",
          title: "Enabled",
          initialValue: true,
        },
        {
          name: "blurb",
          type: "text",
          title: "Short description",
          rows: 2,
          initialValue:
            "Stay updated with our latest initiatives and cultural events.",
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
