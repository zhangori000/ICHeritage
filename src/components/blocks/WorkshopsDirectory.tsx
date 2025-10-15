"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { stegaClean } from "next-sanity";

import { urlFor } from "@/sanity/lib/image";
type SanitySlugValue = string | { current?: string | null } | null | undefined;

type CategoryCard = {
  _id: string;
  title?: string | null;
  slug?: SanitySlugValue;
  icon?: string | null;
  description?: string | null;
};

type WorkshopCategory = {
  _id: string;
  title?: string | null;
  slug?: SanitySlugValue;
  icon?: string | null;
  description?: string | null;
};

type WorkshopCard = {
  _id: string;
  title?: string | null;
  slug?: SanitySlugValue;
  summary?: string | null;
  categories?: WorkshopCategory[] | null;
  start?: string | null;
  end?: string | null;
  location?: string | null;
  capacity?: number | null;
  registeredCount?: number | null;
  needsVolunteers?: boolean | null;
  registerUrl?: string | null;
  volunteerUrl?: string | null;
  heroImage?: {
    asset?: { _ref?: string } | null;
    alt?: string | null;
  } | null;
};

type WorkshopsDirectoryBlock = {
  sectionId?: string | null;
  heading?: string | null;
  intro?: string | null;
  searchPlaceholder?: string | null;
  categoryCards?: CategoryCard[] | null;
  showVolunteerBadge?: boolean | null;
  workshops?: WorkshopCard[] | null;
};

type MaybeSanitySlug = SanitySlugValue | undefined;

const placeholderImage = "/Gemini_Generated_Image_podcast_default.png";

const clean = (value?: string | null) => (value ? stegaClean(value) : "");

const getSlugValue = (value: MaybeSanitySlug) => {
  if (!value) return "";
  if (typeof value === "string") return stegaClean(value);
  if (typeof value === "object" && "current" in value) {
    return value.current ? stegaClean(value.current) : "";
  }
  return "";
};

const getNormalizedSlug = (value: MaybeSanitySlug) => getSlugValue(value).toLowerCase();
const iconMap: Record<string, React.ReactNode> = {
  heart: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8 text-[color:var(--primary)]"
      aria-hidden
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  book: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8 text-[color:var(--primary)]"
      aria-hidden
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M20 22H6.5a2.5 2.5 0 0 1-2.5-2.5V5A2.5 2.5 0 0 1 6.5 2H20v20Z" />
    </svg>
  ),
  globe: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8 text-[color:var(--primary)]"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 0 0 20" />
      <path d="M12 2a15.3 15.3 0 0 1 0 20" />
    </svg>
  ),
  people: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8 text-[color:var(--primary)]"
      aria-hidden
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

const renderCategoryIcon = (icon?: string | null): React.ReactNode => {
  const cleaned = clean(icon);
  const key = cleaned.toLowerCase();
  if (key && iconMap[key]) {
    return iconMap[key];
  }
  const initial = cleaned.replace(/[^a-z0-9]/gi, "").charAt(0);
  return (
    <span className="text-xl font-medium text-[color:var(--primary)]">
      {(initial || "?").toUpperCase()}
    </span>
  );
};

function formatDateRange(start?: string | null, end?: string | null) {
  if (!start) return null;
  const startDay = dayjs(start);
  const endDay = end ? dayjs(end) : null;

  if (!startDay.isValid()) return null;
  const base = startDay.format("MMMM D, YYYY • h:mm A");
  if (endDay && endDay.isValid()) {
    const sameDay = startDay.isSame(endDay, "day");
    if (sameDay) {
      return `${base} – ${endDay.format("h:mm A")}`;
    }
    return `${base} – ${endDay.format("MMMM D, YYYY • h:mm A")}`;
  }
  return base;
}

function getCategories(
  workshops?: WorkshopCard[] | null,
  categoryCards?: WorkshopsDirectoryBlock["categoryCards"]
) {
  const set = new Set<string>();
  categoryCards?.forEach((item) => {
    const slug = getNormalizedSlug(item?.slug);
    if (slug) set.add(slug);
  });
  workshops?.forEach((workshop) => {
    workshop.categories?.forEach((cat) => {
      const slug = getNormalizedSlug(cat?.slug);
      if (slug) set.add(slug);
    });
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

const filterByCategory = (
  workshop: WorkshopCard,
  category: string | null
) => {
  if (!category || category === "all") return true;
  return (
    workshop.categories?.some((cat) =>
      getNormalizedSlug(cat?.slug) === category
    ) ??
    false
  );
};

const matchesSearch = (workshop: WorkshopCard, query: string) => {
  if (!query) return true;
  const haystack = [
    workshop.title,
    workshop.summary,
    workshop.location,
    ...((workshop.categories ?? []).map((cat) =>
      `${cat?.title ?? ""} ${getSlugValue(cat?.slug)}`
    )),
  ]
    .map((part) => clean(part).toLowerCase())
    .join(" ");
  return haystack.includes(query);
};

const computeFill = (capacity?: number | null, registered?: number | null) => {
  if (!capacity || capacity <= 0 || registered == null) return null;
  const remaining = Math.max(capacity - registered, 0);
  return {
    remaining,
    capacity,
    registered,
  };
};

export function WorkshopsDirectory(block: WorkshopsDirectoryBlock) {
  const {
    sectionId,
    heading,
    intro,
    searchPlaceholder,
    categoryCards,
    showVolunteerBadge = true,
    workshops = [],
  } = block;

  const anchor = sectionId?.trim() ? sectionId.trim() : undefined;
  const today = React.useMemo(() => dayjs(), []);
  const safeWorkshops = React.useMemo(
    () => (Array.isArray(workshops) ? workshops : []),
    [workshops]
  );
  const allCategories = React.useMemo(
    () => getCategories(safeWorkshops, categoryCards),
    [safeWorkshops, categoryCards]
  );

  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    "all"
  );
  const [showPast, setShowPast] = React.useState(false);

  const normalizedSearch = search.trim().toLowerCase();

  const filtered = React.useMemo(() => {
    return safeWorkshops
      .map((workshop) => {
        const startDate = workshop.start ? dayjs(workshop.start) : null;
        const endDate = workshop.end ? dayjs(workshop.end) : null;
        const isPast = startDate ? startDate.isBefore(today, "minute") : false;
        return { workshop, isPast, startDate, endDate };
      })
      .filter(({ workshop, isPast }) => {
        if (!showPast && isPast) return false;
        if (!filterByCategory(workshop, selectedCategory)) return false;
        if (!matchesSearch(workshop, normalizedSearch)) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.startDate && b.startDate) {
          if (a.isPast === b.isPast) {
            return a.startDate.valueOf() - b.startDate.valueOf();
          }
          return a.isPast ? 1 : -1;
        }
        return 0;
      });
  }, [safeWorkshops, today, showPast, selectedCategory, normalizedSearch]);

  return (
    <section id={anchor} className="bg-[color:var(--background)] py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-12">
          <div className="text-center space-y-6">
            {heading ? (
              <h2 className="font-serif text-3xl font-normal text-[color:var(--foreground)] md:text-4xl lg:text-5xl">
                {clean(heading)}
              </h2>
            ) : null}
            {intro ? (
              <p className="mx-auto max-w-3xl text-lg text-[color:var(--muted-foreground)] md:text-xl">
                {clean(intro)}
              </p>
            ) : null}
          </div>

          {Array.isArray(categoryCards) && categoryCards.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {categoryCards.map((card) => (
                <article
                  key={card?._id}
                  className="flex flex-col gap-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] py-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="space-y-4 px-6">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--primary)]/10">
                      {renderCategoryIcon(card?.icon)}
                    </div>
                    {card?.title ? (
                      <h3 className="font-serif text-lg font-medium text-[color:var(--foreground)] md:text-xl">
                        {clean(card.title)}
                      </h3>
                    ) : null}
                  </div>
                  {card?.description ? (
                    <div className="px-6">
                      <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                        {clean(card.description)}
                      </p>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : null}

          <div className="flex flex-col gap-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-96">
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={clean(searchPlaceholder) || "Search workshops"}
                  className="w-full rounded-md border border-[color:var(--border)] bg-[color:var(--background)] px-11 py-2 text-sm focus:border-[color:var(--primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/40"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted-foreground)]"
                  aria-hidden
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3-3" />
                </svg>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPast((prev) => !prev)}
                  className={`inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm font-medium transition-colors ${
                    showPast
                      ? "border-[color:var(--primary)] bg-[color:var(--primary)]/10 text-[color:var(--primary)]"
                      : "border-[color:var(--border)] text-[color:var(--muted-foreground)] hover:bg-[color:var(--accent)]/10"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden
                  >
                    <path d="M3 5v6a9 9 0 0 0 18 0V5" />
                    <path d="M21 3 3 3" />
                  </svg>
                  {showPast ? "Hiding past events" : "Show past events"}
                </button>
              </div>
            </div>

            {allCategories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {["all", ...allCategories].map((category) => {
                  const value = category === "all" ? "all" : category.toLowerCase();
                  const isActive = selectedCategory === value;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(value)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        isActive
                          ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
                          : "border-[color:var(--border)] text-[color:var(--muted-foreground)] hover:bg-[color:var(--accent)]/10"
                      }`}
                    >
                      {category === "all" ? "All" : category}
                    </button>
                  );
                })}
              </div>
            ) : null}

            <p className="text-xs text-[color:var(--muted-foreground)]">
              Showing {filtered.length} workshop{filtered.length === 1 ? "" : "s"}
            </p>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map(({ workshop, isPast }) => {
                const {
                  _id,
                  title,
                  slug,
                  summary,
                  categories,
                  start,
                  end,
                  location,
                  capacity,
                  registeredCount,
                  needsVolunteers,
                  registerUrl,
                  volunteerUrl,
                  heroImage,
                } = workshop;

                const formattedTitle = clean(title);
                const imageUrl = heroImage?.asset?._ref
                  ? urlFor(heroImage).width(640).height(400).fit("crop").url()
                  : placeholderImage;
                const imageAlt = clean(heroImage?.alt) || formattedTitle || "Workshop";
                const dateRange = formatDateRange(start, end);
                const slotInfo = computeFill(capacity, registeredCount);
                const slugValue = getSlugValue(slug);
                const slugPath = slugValue ? `/workshops/${slugValue}` : undefined;

                return (
                  <article
                    key={_id}
                    className="group flex h-full flex-col gap-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] py-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="mx-6 aspect-video overflow-hidden rounded-lg">
                      <Image
                        src={imageUrl}
                        alt={imageAlt}
                        width={640}
                        height={360}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="space-y-4 px-6">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[color:var(--muted-foreground)]">
                          {categories?.map((category, index) => {
                            const objectCategory = category && typeof category === "object" ? category : null;
                            const stringCategory = typeof category === "string" ? category : "";
                            const titleLabel = clean(objectCategory?.title ?? stringCategory);
                            const slugLabel = objectCategory ? getSlugValue(objectCategory.slug) : clean(stringCategory);
                            const label = titleLabel || slugLabel;
                            const normalizedSlug = objectCategory
                              ? getNormalizedSlug(objectCategory.slug)
                              : slugLabel.toLowerCase();
                            const key =
                              objectCategory?._id ||
                              normalizedSlug ||
                              slugLabel ||
                              label ||
                              `category-${index}`;
                            if (!label) return null;
                            return (
                              <span
                                key={key}
                                className="inline-flex items-center rounded-full border border-[color:var(--border)] px-2.5 py-0.5 text-[color:var(--foreground)]"
                              >
                                {label}
                              </span>
                            );
                          })}
                          {needsVolunteers && showVolunteerBadge ? (
                            <span className="inline-flex items-center rounded-full border border-[color:var(--primary)]/50 bg-[color:var(--primary)]/10 px-2.5 py-0.5 text-xs font-medium text-[color:var(--primary)]">
                              Volunteers Needed
                            </span>
                          ) : null}
                          {isPast ? (
                            <span className="inline-flex items-center rounded-full border border-[color:var(--border)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--muted-foreground)]">
                              Past Event
                            </span>
                          ) : null}
                        </div>

                        {formattedTitle ? (
                          <h3 className="font-serif text-lg font-medium leading-tight text-[color:var(--foreground)] transition-colors group-hover:text-[color:var(--primary)]">
                            {formattedTitle}
                          </h3>
                        ) : null}

                        <div className="space-y-2 text-sm text-[color:var(--muted-foreground)]">
                          {dateRange ? (
                            <div className="flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                                aria-hidden
                              >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              <span>{dateRange}</span>
                            </div>
                          ) : null}
                          {location ? (
                            <div className="flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                                aria-hidden
                              >
                                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                              <span>{clean(location)}</span>
                            </div>
                          ) : null}
                          {slotInfo ? (
                            <div className="flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                                aria-hidden
                              >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                              </svg>
                              <span>
                                {slotInfo.registered}/{slotInfo.capacity} registered • {slotInfo.remaining} spots left
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {summary ? (
                        <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                          {summary}
                        </p>
                      ) : null}

                      <div className="flex flex-wrap gap-2">
                        {registerUrl ? (
                          <a
                            href={registerUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex flex-1 items-center justify-center rounded-md bg-[color:var(--primary)] px-3 py-2 text-sm font-medium text-[color:var(--primary-foreground)] transition-colors hover:bg-[color:var(--primary)]/90"
                          >
                            Register
                          </a>
                        ) : slugPath ? (
                          <Link
                            href={slugPath}
                            prefetch={false}
                            className="inline-flex flex-1 items-center justify-center rounded-md bg-[color:var(--primary)] px-3 py-2 text-sm font-medium text-[color:var(--primary-foreground)] transition-colors hover:bg-[color:var(--primary)]/90"
                          >
                            View Details
                          </Link>
                        ) : null}
                        {volunteerUrl ? (
                          <a
                            href={volunteerUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-md border border-[color:var(--border)] px-3 py-2 text-sm font-medium text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--accent)]/10"
                          >
                            Volunteer
                          </a>
                        ) : null}
                        {!volunteerUrl && slugPath && needsVolunteers ? (
                          <Link
                            href={slugPath}
                            prefetch={false}
                            className="inline-flex items-center justify-center rounded-md border border-[color:var(--border)] px-3 py-2 text-sm font-medium text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--accent)]/10"
                          >
                            Volunteer
                          </Link>
                        ) : null}
                      </div>
                      {slugPath ? (
                        <div className="text-right text-xs text-[color:var(--muted-foreground)]">
                          <Link href={slugPath} prefetch={false} className="underline-offset-4 hover:underline">
                            View full details
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] p-10 text-center text-sm text-[color:var(--muted-foreground)]">
              No workshops match your current filters. Try adjusting your search or toggle past events.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}





