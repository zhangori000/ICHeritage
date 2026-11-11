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
/* Nav model (Program menu + dedicated Volunteer)                      */
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
      className={className}
      aria-disabled="true"
      title="Online donations are coming soon"
    >
      Donate
      <span className="eyebrow text-[10px] text-[color:var(--primary-foreground)]/80">
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
        "pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-[color:var(--seal)]",
        "transition-transform duration-300 motion-reduce:transition-none",
        pending
          ? "scale-x-100 animate-pulse"
          : active
            ? "scale-x-100"
            : "scale-x-0 group-hover/link:scale-x-100",
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
  const orgName = settings?.orgName ?? "ICHeritage";
  const logo = settings?.logo ?? null;

  // The seal is taller than wide; keep its aspect ratio instead of cropping.
  const logoSrc =
    (logo?.asset?._ref && urlFor(logo).height(96).fit("max").url()) ||
    "/images/logo.png";

  const donateUrl = settings?.donateUrl ?? null;

  const visibility = getSectionVisibility(settings);
  const navItems = NAV_ITEMS.filter(
    (item) => !item.section || visibility[item.section]
  );
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const desktopLink =
    "group/link relative py-2 text-[15px] font-medium text-[color:var(--ink)] transition-colors hover:text-[color:var(--ink)]";

  return (
    <>
      <header
        className="sticky top-0 z-[100] w-full border-b border-[color:var(--hairline)] backdrop-blur-md"
        style={{
          backgroundColor:
            "color-mix(in oklab, var(--paper) 86%, transparent)",
        }}
      >
        <div className="wrap">
          <div className="flex min-h-[4.5rem] items-center justify-between gap-6 py-2 lg:min-h-20">
            {/* ------------------ Logo + wordmark ------------------ */}
            <Link
              href="/"
              className="flex shrink-0 items-center gap-3"
              aria-label="Home"
            >
              <Image
                alt={`${orgName} seal`}
                src={logoSrc}
                width={40}
                height={45}
                className="h-9 w-auto object-contain lg:h-10"
                priority
              />
              <span className="flex flex-col gap-0.5">
                <span className="font-serif text-[22px] font-medium leading-none tracking-[-0.01em] text-[color:var(--ink)] lg:text-2xl">
                  {orgName}
                </span>
                <span className="eyebrow hidden text-[10px] tracking-[0.18em] sm:block">
                  Chinese cultural heritage · nonprofit
                </span>
              </span>
            </Link>

            {/* ------------------ Desktop navigation ------------------ */}
            <nav
              aria-label="Main"
              className="hidden flex-1 items-center justify-center gap-8 lg:flex"
            >
              {navItems.map((item) => {
                if ("href" in item) {
                  const active = isActivePath(pathname, item.href);
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={desktopLink}
                    >
                      {item.label}
                      <NavUnderline active={active} />
                    </Link>
                  );
                }

                // Dropdown (Program / Volunteer): group hover keeps panel open
                const menuId = `${item.id}-menu`;
                const groupActive = item.children.some((child) =>
                  isActivePath(pathname, child.href)
                );
                return (
                  <div key={item.id} className="group relative">
                    <button
                      type="button"
                      className={[
                        "group/link relative flex items-center gap-1.5 py-2 text-[15px] font-medium text-[color:var(--ink)]",
                      ].join(" ")}
                      aria-haspopup="menu"
                      aria-expanded="false"
                      aria-controls={menuId}
                    >
                      {item.label}
                      <svg
                        aria-hidden="true"
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        className="transition-transform duration-200 group-hover:rotate-180"
                      >
                        <path d="M1.5 3.5 5 7l3.5-3.5" />
                      </svg>
                      <span
                        aria-hidden
                        className={[
                          "pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-[color:var(--seal)] transition-transform duration-300 motion-reduce:transition-none",
                          groupActive
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100",
                        ].join(" ")}
                      />
                    </button>

                    <div
                      id={menuId}
                      role="menu"
                      className={[
                        "absolute left-0 top-full w-60 origin-top pt-3",
                        "invisible translate-y-1 opacity-0",
                        "group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
                        "transition-all duration-150",
                      ].join(" ")}
                    >
                      <div className="border border-[color:var(--ink)] bg-[color:var(--paper)] p-2">
                        {item.children.map((child) => {
                          const active = isActivePath(pathname, child.href);
                          return (
                            <Link
                              key={child.id}
                              href={child.href}
                              role="menuitem"
                              aria-current={active ? "page" : undefined}
                              className={[
                                "block px-3 py-2.5 text-[15px] transition-colors",
                                active
                                  ? "text-[color:var(--seal)]"
                                  : "text-[color:var(--ink)] hover:text-[color:var(--seal)]",
                              ].join(" ")}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* ------------------ Desktop actions ------------------ */}
            <div className="hidden items-center lg:flex">
              <DonateButton
                href={donateUrl}
                className="btn btn-primary btn-sm"
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
              className="inline-flex h-11 w-11 items-center justify-center border border-[color:var(--hairline)] text-[color:var(--ink)] transition-colors hover:border-[color:var(--ink)] lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================
          Mobile drawer + backdrop
      ============================================================ */}
      <div
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
        className={[
          "fixed inset-0 z-[9998] bg-[color:var(--ink)]/50",
          "transition-opacity duration-300",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        className={[
          "fixed inset-y-0 right-0 z-[9999] flex w-[min(100vw,22rem)] flex-col gap-8 overflow-y-auto border-l border-[color:var(--ink)] bg-[color:var(--paper)] p-6 text-[color:var(--ink)]",
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
              alt={`${orgName} seal`}
              src={logoSrc}
              width={32}
              height={36}
              className="h-8 w-auto object-contain"
            />
            <span className="font-serif text-xl font-medium">{orgName}</span>
          </Link>

          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="inline-flex h-11 w-11 items-center justify-center border border-[color:var(--hairline)] transition-colors hover:border-[color:var(--ink)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer nav */}
        <nav className="flex flex-col" aria-label="Main">
          {navItems.map((item) => {
            if ("href" in item) {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "border-t border-[color:var(--hairline)] py-4 font-serif text-2xl transition-colors",
                    active ? "text-[color:var(--seal)]" : "hover:text-[color:var(--seal)]",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <div
                key={item.id}
                className="flex flex-col border-t border-[color:var(--hairline)] py-4"
              >
                <span className="eyebrow mb-3">{item.label}</span>
                {item.children.map((child) => {
                  const active = isActivePath(pathname, child.href);
                  return (
                    <Link
                      key={child.id}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "py-2 font-serif text-2xl transition-colors",
                        active
                          ? "text-[color:var(--seal)]"
                          : "hover:text-[color:var(--seal)]",
                      ].join(" ")}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Drawer footer action */}
        <div className="mt-auto border-t border-[color:var(--hairline)] pt-6">
          <DonateButton
            href={donateUrl}
            onClick={() => setMobileOpen(false)}
            className="btn btn-primary w-full"
          />
        </div>
      </div>
    </>
  );
}
