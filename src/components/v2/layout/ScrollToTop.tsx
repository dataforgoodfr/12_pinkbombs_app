"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

// Next.js skips its own scroll reset when the new page's top is already in the viewport.
export default function ScrollToTop() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const isHistoryNavigation = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      isHistoryNavigation.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useLayoutEffect(() => {
    if (previousPathname.current === pathname) {
      isHistoryNavigation.current = false;
      return;
    }
    previousPathname.current = pathname;

    if (isHistoryNavigation.current) {
      isHistoryNavigation.current = false;
      return;
    }
    if (window.location.hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
