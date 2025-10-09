// src/components/Header.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import type { SITE_SETTINGS_QUERYResult } from "@/sanity/types";
import { urlFor } from "@/sanity/lib/image";

/* ------------------------------------------------------------------ */
/* Nav model (matches your latest: Program menu + dedicated Volunteer) */
/* ------------------------------------------------------------------ */
const NAV_ITEMS: Array<
  | { id: string; label: string; href: string }
  | {
      id: string;
      label: "Program";
      children: Array<{ id: string; label: string; href: string }>;
    }
> = [
  { id: "nav-resources", label: "Resources", href: "/resources" },
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
  { id: "nav-volunteer", label: "Volunteer", href: "/volunteer" },
  { id: "nav-workshops", label: "Workshops", href: "/workshops" },
  { id: "nav-brands", label: "Brands", href: "/partners" },
  { id: "nav-about", label: "About", href: "/about" },
];

/* ------------------------------------------------------------------ */
/* Props: use the generated type, just like Footer.                    */
/* ------------------------------------------------------------------ */
type HeaderProps = { settings: SITE_SETTINGS_QUERYResult };

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
              {NAV_ITEMS.map((item) => {
                if ("href" in item) {
                  // Simple link — hover = text color only
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="text-sm font-medium transition-colors px-3 py-2 rounded-md text-[var(--muted-foreground)] hover:text-[var(--primary)]"
                    >
                      {item.label}
                    </Link>
                  );
                }

                // Dropdown (Program) — group hover keeps panel open
                return (
                  <div key={item.id} className="relative group">
                    <button
                      type="button"
                      className="text-sm font-medium transition-colors px-3 py-2 rounded-md text-[var(--muted-foreground)] hover:text-[var(--primary)]"
                      aria-haspopup="menu"
                      aria-expanded="false"
                      aria-controls="program-menu"
                    >
                      {item.label}
                    </button>

                    <div
                      id="program-menu"
                      role="menu"
                      className={[
                        "absolute left-0 mt-2 w-56 rounded-md border shadow-lg p-2 origin-top",
                        "bg-[var(--card)] border-[var(--border)]",
                        "invisible opacity-0 translate-y-1",
                        "group-hover:visible group-hover:opacity-100 group-hover:translate-y-0",
                        "transition-all duration-150",
                      ].join(" ")}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.href}
                          role="menuitem"
                          className="block rounded-md px-3 py-2 text-sm transition-colors text-[var(--muted-foreground)] hover:text-[var(--primary)]"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* ------------------ Desktop actions ------------------ */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4">
              {/* Login — outline; hover = green accent bg + white text */}
              <Link
                href="/auth/signin"
                className={[
                  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all",
                  "border px-4 py-2 h-10 bg-transparent",
                  "text-[var(--foreground)] border-[color:var(--border)]",
                  "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
                  "shadow-xs",
                ].join(" ")}
              >
                Login
              </Link>

              {/* Donate — solid primary; hover brighten */}
              <Link
                href="/donate"
                className={[
                  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all",
                  "px-4 py-2 h-10",
                  "bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-110",
                  "shadow-xs",
                ].join(" ")}
              >
                Donate
              </Link>
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

            {NAV_ITEMS.map((item) => {
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
            <button
              type="button"
              className={[
                "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all",
                "h-10 px-3",
                "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
              ].join(" ")}
            >
              {/* Globe icon */}
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
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10" />
              </svg>
              English
            </button>

            <Link
              href="/auth/signin"
              onClick={() => setMobileOpen(false)}
              className={[
                "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all",
                "w-full h-11 px-4 border bg-transparent shadow-xs",
                "text-[var(--foreground)] border-[color:var(--border)]",
                "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
              ].join(" ")}
            >
              Login
            </Link>

            <Link
              href="/donate"
              onClick={() => setMobileOpen(false)}
              className={[
                "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all",
                "w-full h-11 px-4 shadow-xs",
                "bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-110",
              ].join(" ")}
            >
              Donate
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
