import { defineType, defineArrayMember } from "sanity";

export const pageBuilderType = defineType({
  name: "pageBuilder",
  type: "array",
  of: [
    defineArrayMember({ type: "heroBanner" }),
    defineArrayMember({ type: "hero" }),
    defineArrayMember({ type: "splitImage" }),
    defineArrayMember({ type: "features" }),
    defineArrayMember({ type: "resourcesHero" }),
    defineArrayMember({ type: "newsletterArchive" }),
    defineArrayMember({ type: "initiativesGrid" }),
    defineArrayMember({ type: "faqs" }),
    defineArrayMember({ type: "chapterApplication" }),
    defineArrayMember({ type: "chapterRequirements" }),
    defineArrayMember({ type: "aboutOverview" }),
    defineArrayMember({ type: "missionStatement" }),
    defineArrayMember({ type: "storiesImpact" }),
    defineArrayMember({ type: "leadershipSection" }),
    defineArrayMember({ type: "podcastHighlights" }),
    defineArrayMember({ type: "workshopsDirectory" }),
  ],
  options: {
    insertMenu: {
      views: [
        {
          name: "grid",
          previewImageUrl: (schemaType) => `/block-previews/${schemaType}.png`,
        },
      ],
    },
  },
});
