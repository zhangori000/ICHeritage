import Image from "next/image";
import dayjs from "dayjs";
import { PortableText } from "next-sanity";
import { notFound } from "next/navigation";

import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import {
  WORKSHOP_QUERY,
  WORKSHOP_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import { components as portableComponents } from "@/sanity/portableTextComponents";
import type { WORKSHOP_SLUGS_QUERYResult } from "@/sanity/types";
import { stegaClean } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { ContactHostModal } from "@/components/workshops/ContactHostModal";
import { RsvpForm } from "@/components/workshops/RsvpForm";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const placeholderImage = "/Gemini_Generated_Image_workshop_default.png";
const defaultHostAvatar = "/Gemini_Generated_Image_workshop_default.png";

type WorkshopParams = Promise<{ slug: string }>;

const clean = (value?: string | null) => (value ? stegaClean(value) : "");

type SanitySlugValue = string | { current?: string | null } | null;
type MaybeSanitySlug = SanitySlugValue | undefined;

type HostDisplay = {
  key: string;
  name: string;
  role?: string;
  avatarUrl?: string;
  avatarAlt?: string;
  socialLinks: Array<{ key: string; label: string; url: string }>;
};

type ExternalLink = {
  key: string;
  label: string;
  href: string;
};

type ContactSettings = {
  ctaLabel: string;
  instructions?: string;
  email?: string;
  phone?: string;
  responseNote?: string;
};

const getSlugValue = (value: MaybeSanitySlug) => {
  if (!value) return "";
  if (typeof value === "string") return stegaClean(value);
  if (typeof value === "object" && "current" in value) {
    return value.current ? stegaClean(value.current) : "";
  }
  return "";
};

const getNormalizedSlug = (value: MaybeSanitySlug) => getSlugValue(value).toLowerCase();

function formatDateRange(start?: string | null, end?: string | null) {
  if (!start) return null;
  const startDate = dayjs(start);
  const endDate = end ? dayjs(end) : null;
  if (!startDate.isValid()) return null;
  const startFormatted = startDate.format("dddd, MMMM D, YYYY \u2022 h:mm A");
  if (endDate && endDate.isValid()) {
    if (startDate.isSame(endDate, "day")) {
      return `${startFormatted} \u2013 ${endDate.format("h:mm A")}`;
    }
    return `${startFormatted} \u2013 ${endDate.format("dddd, MMMM D, YYYY \u2022 h:mm A")}`;
  }
  return startFormatted;
}

function formatTimeWindow(start?: string | null, end?: string | null) {
  if (!start) return null;
  const startDate = dayjs(start);
  if (!startDate.isValid()) return null;
  if (!end) {
    return startDate.format("h:mm A");
  }
  const endDate = dayjs(end);
  if (!endDate.isValid()) {
    return startDate.format("h:mm A");
  }
  if (startDate.isSame(endDate, "day")) {
    return `${startDate.format("h:mm A")} \u2013 ${endDate.format("h:mm A")}`;
  }
  return `${startDate.format("h:mm A")} \u2013 ${endDate.format("MMM D, h:mm A")}`;
}

function computeCapacity(
  capacity?: number | null,
  registered?: number | null
) {
  if (!capacity || capacity <= 0) return null;
  const current = registered ?? 0;
  const remaining = Math.max(capacity - current, 0);
  return {
    capacity,
    registered: current,
    remaining,
  };
}

export async function generateStaticParams() {
  const data = await client.fetch<WORKSHOP_SLUGS_QUERYResult>(WORKSHOP_SLUGS_QUERY);

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

export default async function WorkshopPage({
  params,
}: {
  params: WorkshopParams;
}) {
  const resolved = await params;
  const { data: workshop } = await sanityFetch({
    query: WORKSHOP_QUERY,
    params: resolved,
  });

  if (!workshop) {
    notFound();
  }

  const title = clean(workshop.title);
  const summary = clean(workshop.summary);
  const scheduleDetail = formatDateRange(workshop.start, workshop.end);
  const location = clean(workshop.location);
  const capacityInfo = computeCapacity(
    workshop.capacity,
    workshop.registeredCount
  );
  const registerUrl = workshop.registerUrl?.trim();
  const volunteerUrl = workshop.volunteerUrl?.trim();
  const categoryBadges = (workshop.categories ?? [])
    .map((category, index) => {
      if (!category) return null;

      if (typeof category === "string") {
        const label = clean(category);
        if (!label) return null;
        const normalized = label.toLowerCase();
        return {
          key: normalized || `category-${index}`,
          label,
        };
      }

      if (typeof category === "object") {
        const cat = category as {
          _id?: string;
          title?: string | null;
          slug?: SanitySlugValue;
        };
        const titleLabel = clean(cat.title);
        const slugValue = getSlugValue(cat.slug);
        const label = titleLabel || slugValue;
        if (!label) return null;
        const key =
          cat._id ||
          getNormalizedSlug(cat.slug) ||
          slugValue ||
          titleLabel ||
          `category-${index}`;
        return { key, label };
      }

      return null;
    })
    .filter(
      (badge): badge is { key: string; label: string } => Boolean(badge?.label)
    );
  const heroUrl = workshop.heroImage?.asset?._ref
    ? urlFor(workshop.heroImage).width(1600).height(900).fit("crop").url()
    : placeholderImage;
  const heroAlt = clean(workshop.heroImage?.alt) || title || "Workshop";

  const hosts: HostDisplay[] = Array.isArray(workshop.hosts)
    ? (workshop.hosts as Array<unknown>)
        .map((host, index) => {
          if (!host || typeof host !== "object") return null;
          const hostObject = host as {
            _key?: string;
            name?: string | null;
            role?: string | null;
            avatar?: {
              asset?: { _ref?: string | null } | null;
              alt?: string | null;
            } | null;
            socialLinks?: Array<
              | {
                  _key?: string;
                  label?: string | null;
                  url?: string | null;
                }
              | null
            > | null;
          };
          const name = clean(hostObject.name);
          if (!name) return null;
          const role = clean(hostObject.role);
          const avatarAlt = clean(hostObject.avatar?.alt) || name;
          const avatarRef = hostObject.avatar?.asset?._ref;
          const avatarSource = hostObject.avatar as SanityImageSource | undefined;
          const avatarUrl = avatarRef && avatarSource
            ? urlFor(avatarSource).width(240).height(240).fit("crop").url()
            : undefined;
          const socialLinks = Array.isArray(hostObject.socialLinks)
            ? hostObject.socialLinks
                .map((link, linkIndex) => {
                  if (!link || typeof link !== "object") return null;
                  const linkObject = link as {
                    _key?: string;
                    label?: string | null;
                    url?: string | null;
                  };
                  const label = clean(linkObject.label);
                  const href = clean(linkObject.url);
                  if (!label || !href) return null;
                  return {
                    key:
                      linkObject._key ||
                      `${hostObject._key || `host-${index}`}-link-${linkIndex}`,
                    label,
                    url: href,
                  };
                })
                .filter(
                  (link): link is { key: string; label: string; url: string } =>
                    Boolean(link)
                )
            : [];
          return {
            key: hostObject._key || `host-${index}`,
            name,
            role,
            avatarAlt,
            avatarUrl,
            socialLinks,
          } as HostDisplay;
        })
        .filter((host): host is HostDisplay => Boolean(host))
    : [];

  const hostNames = hosts.map((host) => host.name).filter(Boolean);

  const rawContact = (workshop.contact ?? null) as
    | {
        ctaLabel?: string | null;
        instructions?: string | null;
        email?: string | null;
        phone?: string | null;
        responseNote?: string | null;
      }
    | null;

  const contactSettings: ContactSettings = {
    ctaLabel: clean(rawContact?.ctaLabel) || "Contact the Host",
  };

  const contactInstructions = clean(rawContact?.instructions);
  if (contactInstructions) {
    contactSettings.instructions = contactInstructions;
  }
  const contactEmail = clean(rawContact?.email);
  if (contactEmail) {
    contactSettings.email = contactEmail;
  }
  const contactPhone = clean(rawContact?.phone);
  if (contactPhone) {
    contactSettings.phone = contactPhone;
  }
  const contactResponseNote = clean(rawContact?.responseNote);
  if (contactResponseNote) {
    contactSettings.responseNote = contactResponseNote;
  }

  const externalLinks: ExternalLink[] = Array.isArray(workshop.externalLinks)
    ? (workshop.externalLinks as Array<unknown>)
        .map((link, index) => {
          if (!link || typeof link !== "object") return null;
          const linkObject = link as {
            _key?: string;
            label?: string | null;
            href?: string | null;
          };
          const label = clean(linkObject.label);
          const href = clean(linkObject.href);
          if (!label || !href) return null;
          return {
            key: linkObject._key || `${label}-${index}`,
            label,
            href,
          } as ExternalLink;
        })
        .filter((link): link is ExternalLink => Boolean(link))
    : [];

  const showContactModal =
    hosts.length > 0 ||
    Boolean(contactSettings.email) ||
    Boolean(contactSettings.phone) ||
    Boolean(contactSettings.instructions);

  const startDateObj = workshop.start ? dayjs(workshop.start) : null;
  const startMonth = startDateObj?.format("MMM") ?? "";
  const startDay = startDateObj?.format("D") ?? "";
  const schedulePrimary = startDateObj?.format("dddd, MMMM D") ?? null;
  const scheduleSecondary = formatTimeWindow(workshop.start, workshop.end);
  const scheduleSecondaryText = scheduleSecondary ?? scheduleDetail;

  const locationParts = location
    ? location.split(",").map((part) => part.trim()).filter(Boolean)
    : [];
  const locationPrimary = locationParts.length > 0 ? locationParts[0] : location || null;
  const locationSecondary = locationParts.length > 1 ? locationParts.slice(1).join(", ") : null;
  const locationHref = location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` : null;

  return (
    <article className="bg-[color:var(--background)]">
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <aside className="flex flex-col gap-4">
            <div className="relative">
              <div
                className="pointer-events-none absolute inset-0 translate-x-4 translate-y-6 rounded-3xl bg-[color:var(--primary)]/15 blur-3xl"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-xl">
                <div className="relative aspect-square w-full">
                  <Image
                    src={heroUrl}
                    alt={heroAlt}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/5" />
                </div>
              </div>
            </div>

            {hosts.length ? (
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
                  Hosted by
                </p>
                <div className="mt-4 space-y-4">
                  {hosts.map((host) => (
                    <div
                      key={host.key}
                      className="flex flex-col gap-4 rounded-2xl border border-[color:var(--border)]/60 bg-[color:var(--background)]/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[color:var(--border)] bg-[color:var(--accent)]/25">
                          <Image
                            src={host.avatarUrl ?? defaultHostAvatar}
                            alt={host.avatarAlt || host.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[color:var(--foreground)]">{host.name}</p>
                          {host.role ? (
                            <p className="text-xs text-[color:var(--muted-foreground)]">{host.role}</p>
                          ) : null}
                        </div>
                      </div>
                      {host.socialLinks.length ? (
                        <div className="flex flex-wrap gap-2">
                          {host.socialLinks.map((link) => (
                            <a
                              key={link.key}
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-full border border-[color:var(--border)] px-3 py-1 text-xs font-medium text-[color:var(--foreground)] transition hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]"
                            >
                              <span>{link.label}</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-3.5 w-3.5"
                                aria-hidden
                              >
                                <path d="M7 17 17 7M7 7h10v10" />
                              </svg>
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {showContactModal ? (
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
                  Questions?
                </p>
                <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
                  Reach out to the host directly and we&apos;ll get back to you shortly.
                </p>
                <div className="mt-4">
                  <ContactHostModal
                    buttonLabel={contactSettings.ctaLabel}
                    instructions={contactSettings.instructions}
                    email={contactSettings.email}
                    phone={contactSettings.phone}
                    responseNote={contactSettings.responseNote}
                    hostNames={hostNames}
                  />
                </div>
              </div>
            ) : null}

            {externalLinks.length ? (
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
                  Partner links
                </p>
                <div className="mt-4 space-y-3">
                  {externalLinks.map((link) => (
                    <a
                      key={link.key}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]"
                    >
                      <span>{link.label}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="h-4 w-4"
                        aria-hidden
                      >
                        <path d="M7 17 17 7M7 7h10v10" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>

          <main className="flex flex-col gap-6">
            <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-sm">
              {categoryBadges.length > 0 || workshop.needsVolunteers ? (
                <div className="flex flex-wrap gap-2">
                  {categoryBadges.map(({ key, label }) => (
                    <span
                      key={key}
                      className="inline-flex items-center rounded-full border border-[color:var(--border)]/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--muted-foreground)]"
                    >
                      {label}
                    </span>
                  ))}
                  {workshop.needsVolunteers ? (
                    <span className="inline-flex items-center rounded-full border border-[color:var(--primary)]/50 bg-[color:var(--primary)]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--primary)]">
                      Volunteers needed
                    </span>
                  ) : null}
                </div>
              ) : null}

              <h1 className="mt-4 font-serif text-3xl text-[color:var(--foreground)] md:text-5xl">
                {title}
              </h1>
              {summary ? (
                <p className="mt-4 max-w-2xl text-base text-[color:var(--muted-foreground)] md:text-lg">
                  {summary}
                </p>
              ) : null}

              <div className="mt-6 space-y-3">
                {startDateObj ? (
                  <div className="flex items-start gap-3" title={scheduleDetail ?? undefined}>
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-[color:var(--border)]/60">
                      <div className="flex h-full w-full flex-col bg-[color:var(--background)]">
                        <div className="flex h-5 items-center justify-center bg-[color:var(--accent)]/35">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[color:var(--muted-foreground)]">
                            {startMonth}
                          </span>
                        </div>
                        <div className="flex flex-1 items-center justify-center">
                          <span className="text-lg font-semibold leading-none text-[color:var(--foreground)] transform -translate-y-[1px]">
                            {startDay}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0 text-sm">
                      {schedulePrimary ? (
                        <p className="font-semibold text-[color:var(--foreground)]">{schedulePrimary}</p>
                      ) : null}
                      {scheduleSecondaryText ? (
                        <p className="text-[color:var(--muted-foreground)]">{scheduleSecondaryText}</p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                {locationPrimary ? (
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[color:var(--border)]/70 bg-[color:var(--background)] text-[color:var(--muted-foreground)]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                        aria-hidden
                      >
                        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div className="min-w-0 text-sm">
                      {locationHref ? (
                        <a
                          href={locationHref}
                          target="_blank"
                          rel="noreferrer"
                          className="group inline-flex items-center gap-1 font-semibold text-[color:var(--foreground)] transition hover:text-[color:var(--primary)]"
                        >
                          <span className="truncate">{locationPrimary}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3.5 w-3.5 text-[color:var(--muted-foreground)] transition group-hover:text-[color:var(--primary)]"
                            aria-hidden
                          >
                            <path d="M7 17 17 7M7 7h10v10" />
                          </svg>
                        </a>
                      ) : (
                        <p className="font-semibold text-[color:var(--foreground)]">{locationPrimary}</p>
                      )}
                      {locationSecondary ? (
                        <p className="text-[color:var(--muted-foreground)]">{locationSecondary}</p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                {capacityInfo ? (
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[color:var(--border)]/70 bg-[color:var(--background)] text-[color:var(--muted-foreground)]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                        aria-hidden
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div className="min-w-0 text-sm">
                      <p className="font-semibold text-[color:var(--foreground)]">Capacity</p>
                      <p className="text-[color:var(--muted-foreground)]">
                        {capacityInfo.registered}/{capacityInfo.capacity} registered &bull; {capacityInfo.remaining} spots remaining
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              {(registerUrl || volunteerUrl) && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {registerUrl ? (
                    <a
                      href={registerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:bg-[color:var(--primary)]/90"
                    >
                      Register
                    </a>
                  ) : null}
                  {volunteerUrl ? (
                    <a
                      href={volunteerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--border)] px-6 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]"
                    >
                      Volunteer
                    </a>
                  ) : null}
                </div>
              )}
            </section>

            {workshop.body ? (
              <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-sm">
                <div className="prose prose-neutral max-w-none text-[color:var(--foreground)]/85">
                  <PortableText value={workshop.body} components={portableComponents} />
                </div>
              </section>
            ) : null}

            <RsvpForm instructions={contactSettings.responseNote || contactSettings.instructions} />
          </main>
        </div>
      </div>
    </article>
  );
}



