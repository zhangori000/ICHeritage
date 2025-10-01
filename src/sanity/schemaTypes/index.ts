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
import { splitImageType } from "./blocks/splitImageType";
import { siteSettingsType } from "./siteSettingsType";
import { heroBannerType } from "./heroBannerType";
import { colorChoiceType } from "./parts/colorChoice";

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
    splitImageType,
    siteSettingsType,
    heroBannerType,
    colorChoiceType,
  ],
};
