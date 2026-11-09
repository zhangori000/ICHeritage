// src/components/Header.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/sanity/types";
import { urlFor } from "@/sanity/lib/image";
import {
  getSectionVisibility,
  type HideableSection,
} from "@/lib/siteVisibility";

/* ------------------------------------------------------------------ */
/* Nav model (matches your latest: Program menu + dedicated Volunteer) */
/* ------------------------------------------------------------------ */
type NavLink = {
  id: string;
  label: string;
  href: string;
  /** When set, the link only shows if this section is switched on in Site Settings. */
  section?: HideableSection;
};
type NavGroup = {
  id: string;
  label: string;
  children: Array<{ id: string; label: string; href: string }>;
  section?: HideableSection;
};

const NAV_ITEMS: Array<NavLink | NavGroup> = [
  { id: "nav-resources", label: "Resources", href: "/resources" },
  { id: "nav-gallery", label: "Gallery", href: "/gallery" },
  {
    id: "nav-program",
    label: "Program",
    children: [
      {
        id: "nav-program-start",
        label: "Start a chapter",
        href: "/start-a-chapter",
      },
    ],
  },
  {
    id: "nav-volunteer",
    label: "Volunteer",
    children: [
      { id: "nav-volunteer-about", label: "About Volunteers", href: "/volunteer" },
    ],
  },
  {
    id: "nav-workshops",
    label: "Workshops",
    href: "/workshops",
    section: "workshops",
  },
  { id: "nav-brands", label: "Brands", href: "/brands", section: "brands" },
  { id: "nav-about", label: "About", href: "/about" },
];

/* ------------------------------------------------------------------ */
/* Props: use the generated type, just like Footer.                    */
/* ------------------------------------------------------------------ */
type HeaderProps = { settings: SITE_SETTINGS_QUERY_RESULT };

/* ------------------------------------------------------------------ */
/* Donate button: live link when Site Settings has a donate URL,       */
/* otherwise a clearly disabled "coming soon" button (no dead 404).    */
/* ------------------------------------------------------------------ */
function DonateButton({
  href,
  className,
  onClick,
}: {
  href: string | null;
  className: string;
  onClick?: () => void;
}) {
  if (href) {
    const external = /^https?:/i.test(href);
    return (
      <Link
        href={href}
        className={className}
        onClick={onClick}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        Donate
      </Link>
    );
  }
  return (
    <span
      className={`${className} cursor-not-allowed opacity-75`}
      aria-disabled="true"
      title="Online donations are coming soon"
    >
      Donate
      <span className="rounded-full bg-white/25 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
        Soon
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Nav underline: solid on the current page, pulsing while a clicked   */
/* link's page is loading, so a click always gets instant feedback.    */
/* Must render inside a <Link> (useLinkStatus reads that link's state). */
/* ------------------------------------------------------------------ */
function NavUnderline({ active }: { active: boolean }) {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={[
        "pointer-events-none absolute inset-x-3 bottom-0.5 h-0.5 origin-left rounded-full bg-[var(--primary)]",
        "transition-transform duration-300 motion-reduce:transition-none",
        pending ? "scale-x-100 animate-pulse" : active ? "scale-x-100" : "scale-x-0",
      ].join(" ")}
    />
  );
}

function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export function Header({ settings }: HeaderProps) {
  // Brand name mirrors Footer fallback
  const orgName = settings?.orgName ?? "ICHeritage";

  // Sanity image object (nullable), same as Footer
  const logo = settings?.logo ?? null;

  // Build a safe URL for the Sanity logo or fallback (same logic as Footer)
  const logo40 =
    (logo?.asset?._ref &&
      urlFor(logo).width(80).height(80).fit("crop").url()) ||
    "/images/logo.png";
  const logo32 =
    (logo?.asset?._ref &&
      urlFor(logo).width(64).height(64).fit("crop").url()) ||
    "/images/logo.png";

  // Donate link from Site Settings; empty = show a "coming soon" button
  const donateUrl = settings?.donateUrl ?? null;

  // Drop nav items whose section is switched off in Site Settings
  const visibility = getSectionVisibility(settings);
  const navItems = NAV_ITEMS.filter(
    (item) => !item.section || visibility[item.section]
  );
  const pathname = usePathname();

  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Prevent background scroll when drawer is open
  React.useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  return (
    <>
      {/* ============================================================
          Sticky Header (matches Footer tokens)
      ============================================================ */}
      <header
        className="sticky top-0 z-[100] w-full backdrop-blur"
        style={{
          backgroundColor: "var(--background)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            {/* ------------------ Logo + Brand ------------------ */}
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 shrink-0"
              aria-label="Home"
            >
              <Image
                alt={`${orgName} Logo`}
                src={logo40}
                width={40}
                height={40}
                className="h-8 w-8 sm:h-10 sm:w-10"
              />
              <span className="font-noto-serif-sc text-lg sm:text-xl font-semibold text-[var(--foreground)]">
                {orgName}
              </span>
            </Link>

            {/* ------------------ Desktop navigation ------------------ */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-center">
              {navItems.map((item) => {
                if ("href" in item) {
                  // Simple link — hover = text color only
                  const active = isActivePath(pathname, item.href);
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "relative text-sm font-medium transition-colors px-3 py-2 rounded-md hover:text-[var(--primary)]",
                        active ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]",
                      ].join(" ")}
                    >
                      {item.label}
                      <NavUnderline active={active} />
                    </Link>
                  );
                }

                // Dropdown (Program) — group hover keeps panel open
                const menuId = `${item.id}-menu`;
                return (
                  <div key={item.id} className="relative group">
                    <button
                      type="button"
                      className={[
                        "text-sm font-medium transition-colors px-3 py-2 rounded-md hover:text-[var(--primary)]",
                        item.children.some((child) => isActivePath(pathname, child.href))
                          ? "text-[var(--primary)]"
                          : "text-[var(--muted-foreground)]",
                      ].join(" ")}
                      aria-haspopup="menu"
                      aria-expanded="false"
                      aria-controls={menuId}
                    >
                      {item.label}
                    </button>

                    <div
                      id={menuId}
                      role="menu"
                      className={[
                        "absolute left-0 mt-2 w-56 rounded-md border shadow-lg p-2 origin-top",
                        "bg-[var(--card)] border-[var(--border)]",
                        "invisible opacity-0 translate-y-1",
                        "group-hover:visible group-hover:opacity-100 group-hover:translate-y-0",
                        "transition-all duration-150",
                      ].join(" ")}
                    >
                      {item.children.map((child) => {
                        const active = isActivePath(pathname, child.href);
                        return (
                          <Link
                            key={child.id}
                            href={child.href}
                            role="menuitem"
                            aria-current={active ? "page" : undefined}
                            className={[
                              "relative block rounded-md px-3 py-2 text-sm transition-colors hover:text-[var(--primary)]",
                              active ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]",
                            ].join(" ")}
                          >
                            {child.label}
                            <NavUnderline active={false} />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* ------------------ Desktop actions ------------------ */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4">
              <DonateButton
                href={donateUrl}
                className={[
                  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all",
                  "px-4 py-2 h-10",
                  "bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-110",
                  "shadow-xs",
                ].join(" ")}
              />
            </div>

            {/* ------------------ Mobile hamburger ------------------ */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              className={[
                "lg:hidden inline-flex items-center justify-center h-9 w-9 p-0 rounded-md",
                "text-[var(--foreground)]",
                "transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
              ].join(" ")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================
          Mobile drawer + backdrop
      ============================================================ */}
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
        className={[
          "fixed inset-0 z-[9998] bg-black/50",
          "transition-opacity duration-300",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Drawer */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        className={[
          "fixed right-0 inset-y-0 z-[9999] w-80 sm:w-96 shadow-lg border-l p-6 flex flex-col gap-6",
          "bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]",
          "transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={() => setMobileOpen(false)}
          >
            <Image
              alt={`${orgName} Logo`}
              src={logo32}
              width={32}
              height={32}
            />
            <span className="font-noto-serif-sc text-lg font-semibold">
              {orgName}
            </span>
          </Link>

          {/* Close */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className={[
              "inline-flex items-center justify-center h-9 w-9 p-0 rounded-md",
              "transition-colors",
              "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
            ].join(" ")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer nav */}
        <nav className="flex flex-col gap-4">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-[color:var(--foreground)]/60 uppercase tracking-wider mb-3">
              Main Navigation
            </div>

            {navItems.map((item) => {
              if ("href" in item) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-base font-medium transition-colors text-[var(--muted-foreground)] hover:text-[var(--primary)]"
                  >
                    {item.label}
                  </Link>
                );
              }

              // Program children, visually grouped
              return (
                <div
                  key={item.id}
                  className="space-y-1 pt-3 border-t border-[var(--border)]"
                >
                  <div className="text-sm font-semibold text-[color:var(--foreground)]/60 uppercase tracking-wider mb-2">
                    {item.label}
                  </div>
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-3 pl-4 text-base font-medium transition-colors text-[var(--muted-foreground)] hover:text-[var(--primary)]"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Drawer footer actions */}
          <div className="flex flex-col gap-4 pt-4 border-t border-[var(--border)]">
            <DonateButton
              href={donateUrl}
              onClick={() => setMobileOpen(false)}
              className={[
                "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all",
                "w-full h-11 px-4 shadow-xs",
                "bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-110",
              ].join(" ")}
            />
          </div>
        </nav>
      </div>
    </>
  );
}
