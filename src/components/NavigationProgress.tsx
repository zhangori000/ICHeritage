"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Thin bar along the top of the window while an in-site link is loading.
 * It waits ~150ms before appearing (see .nav-progress in globals.css), so
 * instant navigations to prefetched pages never flash it.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // New page rendered: hide the bar (state adjusted during render, no effect).
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setActive(false);
  }

  useEffect(() => {
    // Listen in the capture phase: next/link calls preventDefault() on its
    // own clicks (it navigates client-side), so a bubbling listener would
    // see every in-site link click as already handled.
    function onClick(event: MouseEvent) {
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || !anchor.href) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page or #anchor
      setActive(true);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Safety net: never leave the bar up if a navigation is abandoned.
  useEffect(() => {
    if (!active) return undefined;
    const timer = window.setTimeout(() => setActive(false), 10000);
    return () => window.clearTimeout(timer);
  }, [active]);

  if (!active) return null;
  return <div aria-hidden className="nav-progress" />;
}
