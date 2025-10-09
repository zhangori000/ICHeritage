"use client";

import { Hero } from "@/components/blocks/Hero";
import { Features } from "@/components/blocks/Features";
import { SplitImage } from "@/components/blocks/SplitImage";
import { FAQs } from "@/components/blocks/FAQs";
import { HeroBanner } from "./blocks/HeroBanner";
import { ResourcesHero } from "./blocks/ResourcesHero";
import { NewsletterArchive } from "./blocks/NewsletterArchive";
import { InitiativesGrid } from "./blocks/InitiativesGrid";
import { ChapterApplication } from "./blocks/ChapterApplication";
import { ChapterRequirements } from "./blocks/ChapterRequirements";
import { AboutOverview } from "./blocks/AboutOverview";
import { MissionStatement } from "./blocks/MissionStatement";
import { StoriesImpact } from "./blocks/StoriesImpact";
import { LeadershipSection } from "./blocks/LeadershipSection";
import { PodcastHighlights } from "./blocks/PodcastHighlights";
import { WorkshopsDirectory } from "./blocks/WorkshopsDirectory";
import { VolunteerTracks } from "./blocks/VolunteerTracks";
import { VolunteerBenefits } from "./blocks/VolunteerBenefits";
import { VolunteerApplication } from "./blocks/VolunteerApplication";
import { PAGE_QUERYResult } from "@/sanity/types";
import { client } from "@/sanity/lib/client";
import { createDataAttribute } from "next-sanity";
import { useOptimistic } from "next-sanity/hooks";

type PageBuilderProps = {
  content: NonNullable<PAGE_QUERYResult>["content"];
  documentId: string;
  documentType: string;
};

const { projectId, dataset, stega } = client.config();
export const createDataAttributeConfig = {
  projectId,
  dataset,
  baseUrl: typeof stega.studioUrl === "string" ? stega.studioUrl : "",
};

// classic exhaustive-check helper
function assertNever(
  x: never,
  msg = "Unhandled block type. Please add a switch statement to handle it"
): never {
  throw new Error(`${msg}: ${JSON.stringify(x)}`);
}

export function PageBuilder({
  content,
  documentId,
  documentType,
}: PageBuilderProps) {
  const blocks = useOptimistic<
    NonNullable<PAGE_QUERYResult>["content"] | undefined,
    NonNullable<PAGE_QUERYResult>
  >(content, (state, action) => {
    if (action.id === documentId) {
      return action?.document?.content?.map(
        (block) => state?.find((s) => s._key === block?._key) || block
      );
    }
    return state;
  });

  if (!Array.isArray(blocks)) {
    return null;
  }

  return (
    <main
      data-sanity={createDataAttribute({
        ...createDataAttributeConfig,
        id: documentId,
        type: documentType,
        path: "content",
      }).toString()}
    >
      {blocks.map((block) => {
        const DragHandle = ({ children }: { children: React.ReactNode }) => (
          <div
            data-sanity={createDataAttribute({
              ...createDataAttributeConfig,
              id: documentId,
              type: documentType,
              path: `content[_key=="${block._key}"]`,
            }).toString()}
          >
            {children}
          </div>
        );

        switch (block._type) {
          case "hero":
            return (
              <DragHandle key={block._key}>
                <Hero {...block} />
              </DragHandle>
            );
          case "features":
            return (
              <DragHandle key={block._key}>
                <Features {...block} />
              </DragHandle>
            );
          case "splitImage":
            return (
              <DragHandle key={block._key}>
                <SplitImage {...block} />
              </DragHandle>
            );
          case "faqs":
            return (
              <DragHandle key={block._key}>
                <FAQs {...block} />
              </DragHandle>
            );
          case "heroBanner":
            return (
              <DragHandle key={block._key}>
                <HeroBanner {...block} />
              </DragHandle>
            );
          case "resourcesHero":
            return (
              <DragHandle key={block._key}>
                <ResourcesHero {...block} />
              </DragHandle>
            );
          case "newsletterArchive":
            return (
              <DragHandle key={block._key}>
                <NewsletterArchive {...block} />
              </DragHandle>
            );
          case "initiativesGrid":
            return (
              <DragHandle key={block._key}>
                <InitiativesGrid {...block} />
              </DragHandle>
            );
          case "chapterApplication":
            return (
              <DragHandle key={block._key}>
                <ChapterApplication {...block} />
              </DragHandle>
            );
          case "chapterRequirements":
            return (
              <DragHandle key={block._key}>
                <ChapterRequirements {...block} />
              </DragHandle>
            );
          case "aboutOverview":
            return (
              <DragHandle key={block._key}>
                <AboutOverview {...block} />
              </DragHandle>
            );
          case "missionStatement":
            return (
              <DragHandle key={block._key}>
                <MissionStatement {...block} />
              </DragHandle>
            );
          case "storiesImpact":
            return (
              <DragHandle key={block._key}>
                <StoriesImpact {...block} />
              </DragHandle>
            );
          case "leadershipSection":
            return (
              <DragHandle key={block._key}>
                <LeadershipSection {...block} />
              </DragHandle>
            );
          case "workshopsDirectory": {
            const { categoryCards, workshops, ...rest } = block;
            const safeCategoryCards = Array.isArray(categoryCards) ? categoryCards : [];
            const safeWorkshops = Array.isArray(workshops) ? workshops : [];
            return (
              <DragHandle key={block._key}>
                <WorkshopsDirectory
                  {...rest}
                  categoryCards={safeCategoryCards}
                  workshops={safeWorkshops}
                />
              </DragHandle>
            );
          }
          case "podcastHighlights":
            return (
              <DragHandle key={block._key}>
                <PodcastHighlights {...block} />
              </DragHandle>
            );
          case "volunteerTracks":
            return (
              <DragHandle key={block._key}>
                <VolunteerTracks {...block} />
              </DragHandle>
            );
          case "volunteerBenefits":
            return (
              <DragHandle key={block._key}>
                <VolunteerBenefits {...block} />
              </DragHandle>
            );
          case "volunteerApplication":
            return (
              <DragHandle key={block._key}>
                <VolunteerApplication {...block} />
              </DragHandle>
            );
          default:
            // This is a fallback for when we don't have a block type
            // Because the union only contains the handled cases above,
            // `block` is `never` here. This enforces exhaustiveness.
            return assertNever(block);
        }
      })}
    </main>
  );
}
