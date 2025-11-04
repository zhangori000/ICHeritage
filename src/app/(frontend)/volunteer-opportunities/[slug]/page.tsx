import Image from "next/image";
import { PortableText } from "next-sanity";
import { notFound } from "next/navigation";

import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import { VOLUNTEER_QUERY, VOLUNTEER_SLUGS_QUERY } from "@/sanity/lib/queries";
import type { VOLUNTEER_SLUGS_QUERYResult } from "@/sanity/types";
import { components as portableComponents } from "@/sanity/portableTextComponents";
import { stegaClean } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { VolunteerApplicationForm } from "@/components/volunteers/ApplicationForm";
import { ContactHostModal } from "@/components/workshops/ContactHostModal";

type VolunteerParams = Promise<{ slug: string }>;

const placeholderImage = "/Gemini_Generated_Image_volunteer_default.png";

const clean = (value?: string | null) => (value ? stegaClean(value) : "");

export async function generateStaticParams() {
  const data = await client.fetch<VOLUNTEER_SLUGS_QUERYResult>(VOLUNTEER_SLUGS_QUERY);

  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map(({ slug }) => {
      if (typeof slug === "string" && slug) {
        return { slug };
      }

      const slugAsUnknown = slug as unknown;
      if (
        slugAsUnknown &&
        typeof slugAsUnknown === "object" &&
        "current" in slugAsUnknown &&
        typeof (slugAsUnknown as { current?: unknown }).current === "string"
      ) {
        return { slug: (slugAsUnknown as { current: string }).current };
      }

      return null;
    })
    .filter((item): item is { slug: string } => Boolean(item?.slug));
}

export default async function VolunteerOpportunityPage({
  params,
}: {
  params: VolunteerParams;
}) {
  const resolved = await params;
  const { data: opportunity } = await sanityFetch({
    query: VOLUNTEER_QUERY,
    params: resolved,
  });

  if (!opportunity) {
    notFound();
  }

  const title = clean(opportunity.title);
  const summary = clean(opportunity.summary);
  const track = clean(opportunity.trackLabel);
  const estimatedTime = clean(opportunity.commitmentSummary);
  const location = clean(opportunity.location);
  const applicationNote = clean(opportunity.contact?.instructions);
  const isUrgent = Boolean(opportunity.isUrgent);
  const isRemoteFriendly = Boolean(opportunity.isRemoteFriendly);
  const applyHrefRaw = opportunity.applyUrl?.trim() || null;
  const applyLinkIsExternal =
    Boolean(applyHrefRaw) && /^https?:\/\//i.test(applyHrefRaw ?? "");

  const heroImage = opportunity.heroImage?.asset?._ref
    ? {
        src: urlFor(opportunity.heroImage).width(1600).height(900).fit("crop").quality(85).url(),
        alt: clean(opportunity.heroImage?.alt) || title || "Volunteer opportunity",
      }
    : {
        src: placeholderImage,
        alt: title || "Volunteer opportunity",
      };

  const contactEmail = clean(opportunity.contact?.email);
  const contactPhone = clean(opportunity.contact?.phone);
  const responseNote = clean(opportunity.contact?.responseNote);
  const contactInstructions =
    applicationNote ||
    responseNote ||
    "Share a brief note about your interest and our volunteer coordinator will follow up shortly.";
  const hostNames =
    contactEmail || contactPhone ? ["Volunteer coordinator"] : [];
  const hasContactDetails = Boolean(contactEmail || contactPhone);
  const opportunitySlug = (() => {
    const rawSlug = opportunity.slug;
    if (!rawSlug) return resolved.slug;
    if (typeof rawSlug === "string") return rawSlug;
    if (typeof rawSlug === "object" && typeof (rawSlug as { current?: unknown }).current === "string") {
      return (rawSlug as { current: string }).current;
    }
    return resolved.slug;
  })();
  const opportunityIdentifier = opportunity._id ?? opportunitySlug;


  const applicationSteps = (opportunity.applicationProcess ?? [])
    .map((step, index) => {
      if (!step) return null;
      const titleText = clean(step.title);
      const description = clean(step.description);
      if (!titleText && !description) return null;
      return {
        key: step._key ?? `step-${index}`,
        title: titleText,
        description,
      };
    })
    .filter((step): step is { key: string; title: string; description: string } => Boolean(step));

  return (
    <article className="bg-[color:var(--background)]">
      <div className="container mx-auto px-4 py-10 md:py-12 lg:py-14">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
          <aside className="flex flex-col gap-6">
            <div className="relative">
              <div
                className="pointer-events-none absolute inset-0 translate-x-4 translate-y-6 rounded-3xl bg-[color:var(--primary)]/15 blur-3xl"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-xl">
                <div className="relative aspect-square w-full">
                  <Image
                    src={heroImage.src}
                    alt={heroImage.alt || ""}
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/10" />
                </div>
              </div>
            </div>

            {hasContactDetails ? (
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
                  Questions?
                </p>
                <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
                  Reach out to our volunteer coordinator and we&apos;ll follow up quickly.
                </p>
                <div className="mt-4">
                  <ContactHostModal
                    buttonLabel="Contact the Host"
                    instructions={contactInstructions}
                    email={contactEmail || undefined}
                    phone={contactPhone || undefined}
                    responseNote={responseNote || undefined}
                    hostNames={hostNames}
                    showContactDetails={false}
                    workshopId={opportunityIdentifier}
                    workshopSlug={opportunitySlug}
                    workshopTitle={title}
                    workshopDate={estimatedTime || null}
                    workshopLocation={location}
                  />
                </div>
              </div>
            ) : null}
          </aside>

          <main className="flex flex-col gap-6">
            <header className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                {track ? (
                  <span className="inline-flex items-center rounded-full border border-[color:var(--border)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--foreground)]">
                    {track}
                  </span>
                ) : null}
                {isUrgent ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                      aria-hidden
                    >
                      <path d="m13 2-10 18h9l-1 6 10-18h-9z" />
                    </svg>
                    Urgent need
                  </span>
                ) : null}
                {isRemoteFriendly ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                      aria-hidden
                    >
                      <path d="M2 10c0-1.886 0-2.828.586-3.414C3.172 6 4.114 6 6 6h12c1.886 0 2.828 0 3.414.586C22 7.172 22 8.114 22 10v2c0 1.886 0 2.828-.586 3.414C20.828 16 19.886 16 18 16H6c-1.886 0-2.828 0-3.414-.586C2 14.828 2 13.886 2 12z" />
                      <path d="M6 6V4" />
                      <path d="M18 6V4" />
                      <path d="M6 16v2" />
                      <path d="M18 16v2" />
                    </svg>
                    Remote friendly
                  </span>
                ) : null}
              </div>

              {applyHrefRaw ? (
                <div className="mt-6">
                  <a
                    href={applyLinkIsExternal ? applyHrefRaw : "#apply-form"}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--primary)] px-5 py-2 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:bg-[color:var(--primary)]/90"
                    target={applyLinkIsExternal ? "_blank" : undefined}
                    rel={applyLinkIsExternal ? "noreferrer" : undefined}
                  >
                    Apply Now
                  </a>
                </div>
              ) : null}

              <h1 className="mt-4 font-serif text-3xl text-[color:var(--foreground)] md:text-4xl">{title}</h1>
              {summary ? (
                <p className="mt-4 max-w-2xl text-base text-[color:var(--muted-foreground)] md:text-lg">{summary}</p>
              ) : null}

              <div className="mt-6 space-y-3 text-sm text-[color:var(--muted-foreground)]">
                {estimatedTime ? (
                  <div className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-1 h-4 w-4 flex-shrink-0"
                      aria-hidden
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{estimatedTime}</span>
                  </div>
                ) : null}

                {location ? (
                  <div className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-1 h-4 w-4 flex-shrink-0"
                      aria-hidden
                    >
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{location}</span>
                  </div>
                ) : null}
              </div>
            </header>

            {opportunity.body ? (
              <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-sm">
                <h2 className="font-serif text-2xl text-[color:var(--foreground)]">About this role</h2>
                <div className="prose prose-neutral mt-4 max-w-none text-[color:var(--foreground)]/85">
                  <PortableText value={opportunity.body} components={portableComponents} />
                </div>
              </section>
            ) : null}

            {applicationSteps.length > 0 ? (
              <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-sm">
                <h2 className="font-serif text-2xl text-[color:var(--foreground)]">Application process</h2>
                <ol className="mt-6 space-y-5">
                  {applicationSteps.map((step, index) => (
                    <li key={step.key} className="flex gap-4">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[color:var(--primary)]/15 text-sm font-semibold text-[color:var(--primary)]">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-base font-semibold text-[color:var(--foreground)]">{step.title}</p>
                        {step.description ? (
                          <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">{step.description}</p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            <VolunteerApplicationForm
              instructions={applicationNote}
              applyHref={applyHrefRaw}
              isExternalApplyLink={applyLinkIsExternal}
            />
          </main>
        </div>
      </div>
    </article>
  );
}
