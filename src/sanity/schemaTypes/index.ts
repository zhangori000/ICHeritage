import { type SchemaTypeDefinition } from "sanity";

import blogPost from "./blogPost";
import author from "./author";
import category from "./category";
import event from "./event";
import blockContent from "./blockContent";
import { pageType } from "./pageType";
import { pageBuilderType } from "./pageBuilderType";
import { faqType } from "./faqType";
import { faqsType } from "./blocks/faqsType";
import { featuresType } from "./blocks/featuresType";
import { heroType } from "./blocks/heroType";
import { initiativesGridType } from "./blocks/initiativesGridType";
import { resourcesHeroType } from "./blocks/resourcesHeroType";
import { newsletterArchiveType } from "./blocks/newsletterArchiveType";
import { splitImageType } from "./blocks/splitImageType";
import { chapterApplicationType } from "./blocks/chapterApplicationType";
import { chapterRequirementsType } from "./blocks/chapterRequirementsType";
import { aboutOverviewType } from "./blocks/aboutOverviewType";
import { missionStatementType } from "./blocks/missionStatementType";
import { storiesImpactType } from "./blocks/storiesImpactType";
import { leadershipSectionType } from "./blocks/leadershipSectionType";
import { podcastHighlightsType } from "./blocks/podcastHighlightsType";
import { workshopsDirectoryType } from "./blocks/workshopsDirectoryType";
import { volunteerTracksType } from "./blocks/volunteerTracksType";
import { volunteerBenefitsType } from "./blocks/volunteerBenefitsType";
import { volunteerApplicationType } from "./blocks/volunteerApplicationType";
import newsletter from "./newsletter";
import { siteSettingsType } from "./siteSettingsType";
import { heroBannerType } from "./heroBannerType";
import { colorChoiceType } from "./parts/colorChoice";
import { workshopType } from "./workshop";
import { workshopCategoryType } from "./workshopCategory";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blogPost,
    blockContent,
    category,
    author,
    event,
    pageType,
    pageBuilderType,
    faqType,
    faqsType,
    featuresType,
    heroType,
    initiativesGridType,
    resourcesHeroType,
    newsletterArchiveType,
    splitImageType,
    chapterApplicationType,
    chapterRequirementsType,
    aboutOverviewType,
    missionStatementType,
    storiesImpactType,
    leadershipSectionType,
    podcastHighlightsType,
    workshopsDirectoryType,
    volunteerTracksType,
    volunteerBenefitsType,
    volunteerApplicationType,
    newsletter,
    siteSettingsType,
    heroBannerType,
    colorChoiceType,
    workshopType,
    workshopCategoryType,
  ],
};
