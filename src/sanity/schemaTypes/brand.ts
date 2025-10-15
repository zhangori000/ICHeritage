import { defineField, defineType } from "sanity";
import { ImagesIcon } from "@sanity/icons";

const brandColorPresets = [
  "#FFFFFF",
  "#0F172A",
  "#1D3B53",
  "#A73438",
  "#F0E6D2",
  "#5A6B4F",
  "#F97316",
  "#2563EB",
];

export const brandType = defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "title",
      title: "Brand name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kicker",
      title: "Kicker",
      type: "string",
      description:
        "Optional eyebrow text shown above the title (e.g. Apple Trade In).",
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subhead",
      title: "Subheadline",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "themeColor",
      title: "Primary color",
      type: "color",
      description: "Used for card background and CTAs. Defaults to card tone if not set.",
      options: {
        disableAlpha: true,
        colorList: brandColorPresets,
      },
    }),
    defineField({
      name: "textColor",
      title: "Text color override",
      type: "color",
      description: "Optional text color override to ensure accessible contrast.",
      options: {
        disableAlpha: true,
        colorList: brandColorPresets,
      },
    }),
    defineField({
      name: "imageOverlayStrength",
      title: "Image overlay strength",
      type: "number",
      description:
        "Controls how strong the dark overlay is on the hero image (0 = none, 1 = fully shaded).",
      validation: (rule) => rule.min(0).max(1),
      initialValue: 0.35,
    }),
    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "href",
          title: "URL",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary CTA",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          type: "string",
        }),
        defineField({
          name: "href",
          title: "URL",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      description: "Large image shown at the bottom of the promo card.",
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      description: "Optional logo displayed above the headline.",
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "footnote",
      title: "Footnote",
      type: "string",
      description: "Optional small footnote displayed beneath the CTAs.",
    }),
    defineField({
      name: "promoLink",
      title: "Promo link (clickable card)",
      type: "object",
      fields: [
        defineField({
          name: "href",
          title: "URL",
          type: "string",
        }),
        defineField({
          name: "label",
          title: "Aria label",
          type: "string",
          description: "Accessible label describing the destination.",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "headline",
      media: "heroImage",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title ?? "Brand",
        subtitle,
        media,
      };
    },
  },
});
