"use client";

import Link from "next/link";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { brand } from "../brand";
import { pathways, servicesByPathway } from "../content";
import { LocalTime } from "./local-time";
import { SITE_MENU_STATE_EVENT } from "./design-gallery/design-gallery-state";
import { getFocusWrapIndex } from "./design-gallery/gallery-ui-utils";

/**
 * MetaLab's navigation is a "Menu" pill, a wordmark and a local clock — that's
 * it. Everything else lives behind the overlay. We keep that restraint but the
 * overlay carries the full service layer, because unlike MetaLab we need eight
 * service pages to be reachable and crawlable.
 */
export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const onGraphicDesignGallery = pathname === "/services/graphic-design";

  // The homepage hero is a dark, full-bleed video — the light-theme nav
  // text (dark ink) is invisible sitting directly on it. Once scrolled past
  // the hero (or the overlay is open), the header gets its own light pill
  // background from `scrolled` below and reads fine in the normal palette,
  // so the swap only needs to cover the unscrolled state on "/".
  // email-sms stays dark past the hero too, so it also drives the scrolled
  // pill background below (immersiveDark) — social-media-marketing's hero
  // is dark but the rest of that page is the normal light theme, so it only
  // needs the unscrolled dark-hero treatment, not the scrolled one.
  const immersiveDark = pathname === "/services/email-sms";
  const socialPage = pathname === "/services/social-media-marketing";
  const onSocialHero = socialPage && !scrolled && !open;
  // The mobile nav is a dark drawer (below md), the desktop one is a
  // full-bleed light mega-menu — the header pills need light-on-dark while
  // the drawer is open, but must NOT flip on desktop where the backdrop
  // stays light, hence the isMobile check only applying to the open case.
  const onDarkHero = (pathname === "/" && !scrolled && !open) || (immersiveDark && !open) || onSocialHero || (open && isMobile);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    setIsMobile(query.matches);
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (onGraphicDesignGallery) {
      setScrolled(false);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onGraphicDesignGallery]);

  useEffect(() => {
    document.body.dataset.siteMenuOpen = String(open);
    window.dispatchEvent(new CustomEvent(SITE_MENU_STATE_EVENT, { detail: { open } }));
  }, [open]);

  // Lock the page and wire Escape while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    const pageSurfaces = Array.from(document.querySelectorAll<HTMLElement>("main, body > footer"));
    const previouslyInert = pageSurfaces.map((surface) => surface.inert);
    const focusFrame = window.requestAnimationFrame(() => {
      const candidates = menuRef.current?.querySelectorAll<HTMLElement>("[data-site-menu-initial-focus]");
      const visible = candidates && Array.from(candidates).find((el) => el.offsetParent !== null);
      visible?.focus({ preventScroll: true });
    });
    document.body.style.overflow = "hidden";
    pageSurfaces.forEach((surface) => { surface.inert = true; });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const focusableElements = [headerRef.current, menuRef.current]
        .flatMap((surface) => surface
          ? Array.from(surface.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])",
          ))
          : [])
        // The mobile drawer and desktop mega-menu are both always in the DOM
        // (only one is display:none'd at a time via the md: breakpoint) —
        // offsetParent is null for display:none elements, so this keeps the
        // wrap math scoped to whichever variant is actually on screen.
        .filter((element) => element.tabIndex >= 0 && element.offsetParent !== null);
      const activeIndex = document.activeElement instanceof HTMLElement
        ? focusableElements.indexOf(document.activeElement)
        : -1;
      const wrapIndex = getFocusWrapIndex(activeIndex, focusableElements.length, e.shiftKey);
      if (wrapIndex === null) return;

      e.preventDefault();
      focusableElements[wrapIndex]?.focus({ preventScroll: true });
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = prev;
      pageSurfaces.forEach((surface, index) => { surface.inert = previouslyInert[index] ?? false; });
      window.removeEventListener("keydown", onKey, true);
      menuButtonRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-50 transition-[color,background-color,border-color,opacity,transform] duration-500 translate-y-0 opacity-100 ${
          scrolled && !open && !onGraphicDesignGallery
            ? immersiveDark
              ? "bg-black/65 backdrop-blur-xl"
              : "bg-ink/70 backdrop-blur-xl"
            : ""
        } ${onDarkHero ? "on-dark" : ""} ${onGraphicDesignGallery ? "pointer-events-none" : ""}`}
      >
        <nav
          className={`mx-auto flex h-16 max-w-[80rem] items-center justify-between px-6 ${
            onGraphicDesignGallery ? "pointer-events-auto" : ""
          }`}
          aria-label="Primary"
        >
          {/* Below md, the wordmark and Start pill only appear once the menu
              is open — closed state on small screens shows just the trigger,
              so it never competes with a page's own hero content. `invisible`
              (not `hidden`) keeps this in the flex flow so the trigger stays
              pinned to the right via justify-between either way. */}
          <div className={`flex items-center gap-2 sm:gap-4 ${!open ? "max-md:invisible" : ""}`}>
            <span className="hidden sm:inline-flex"><LocalTime /></span>
            <Link href="/contact" className="pill">
              Start
            </Link>
          </div>

          <Link
            href="/"
            className={`absolute left-1/2 -translate-x-1/2 font-display text-[1.375rem] leading-none text-bright ${
              !open ? "max-md:hidden" : ""
            }`}
            aria-label={`${brand.name} — home`}
          >
            {brand.name}
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            className="pill"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="md:hidden" aria-hidden="true">
              {open ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
            </span>
            <span className="hidden md:inline">{open ? "Close" : "Menu"}</span>
          </button>
        </nav>
      </header>

      {/* Overlay menu. Rendered always so its links are in the DOM for crawlers;
          open/closed visibility is driven by opacity/transform + pointer-events,
          never display:none. Below md it's shown as a right-side drawer over a
          dimmed backdrop instead of the full-bleed desktop mega-menu — same
          `pathways`/`servicesByPathway` data feeds both, so a future content or
          link change still applies to each automatically. */}
      <div ref={menuRef} id="site-menu" aria-hidden={!open}>
        {/* Mobile: dimmed backdrop behind the drawer. */}
        <div
          className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        {/* Mobile: slide-in drawer. */}
        <div
          className={`on-dark fixed inset-y-0 right-0 z-40 w-[85%] max-w-[22rem] overflow-y-auto bg-[#0b0b0e]/98 shadow-2xl backdrop-blur-2xl transition-transform duration-[400ms] md:hidden ${
            open ? "translate-x-0" : "pointer-events-none translate-x-full"
          }`}
        >
          <div className="flex flex-col gap-10 px-6 pb-10 pt-24">
            {pathways.map((pathway) => (
              <div key={pathway.id}>
                <div className="mb-3 flex items-baseline gap-3">
                  <span className="font-mono text-[0.75rem] text-accent">
                    {pathway.index}
                  </span>
                  <Link
                    data-site-menu-initial-focus={pathway === pathways[0] ? "true" : undefined}
                    href={`/solutions/${pathway.id}`}
                    className="font-display text-2xl text-bright"
                    tabIndex={open ? 0 : -1}
                    onClick={() => setOpen(false)}
                  >
                    {pathway.name}
                  </Link>
                </div>
                <ul className="space-y-2.5">
                  {servicesByPathway(pathway.id).map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="text-detail text-bright/80 transition-colors hover:text-accent"
                        tabIndex={open ? 0 : -1}
                        onClick={() => setOpen(false)}
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="flex flex-wrap gap-3 border-t border-hairline pt-8">
              {BOTTOM_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="pill"
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop: full-bleed mega-menu. */}
        <div
          className={`fixed inset-0 z-40 hidden overflow-y-auto bg-ink/95 backdrop-blur-2xl transition-opacity duration-500 md:block ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div className="mx-auto max-w-[80rem] px-6 pb-24 pt-28">
            <div className="grid gap-12 md:grid-cols-3">
              {pathways.map((pathway) => (
                <div key={pathway.id}>
                  <div className="mb-5 flex items-baseline gap-3">
                    <span className="font-mono text-[0.75rem] text-accent">
                      {pathway.index}
                    </span>
                    <Link
                      data-site-menu-initial-focus={pathway === pathways[0] ? "true" : undefined}
                      href={`/solutions/${pathway.id}`}
                      className="font-display text-4xl text-bright"
                      tabIndex={open ? 0 : -1}
                      onClick={() => setOpen(false)}
                    >
                      {pathway.name}
                    </Link>
                  </div>
                  <p className="mb-5 max-w-[26ch] text-[0.9375rem] text-muted">
                    {pathway.promise}
                  </p>
                  <ul className="space-y-2.5">
                    {servicesByPathway(pathway.id).map((service) => (
                      <li key={service.slug}>
                        <Link
                          href={`/services/${service.slug}`}
                          className="text-detail text-bright/80 transition-colors hover:text-accent"
                          tabIndex={open ? 0 : -1}
                          onClick={() => setOpen(false)}
                        >
                          {service.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-16 flex flex-wrap gap-3 border-t border-hairline pt-8">
              {BOTTOM_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="pill"
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const BOTTOM_LINKS = [
  { href: "/method", label: "Method" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Start a project" },
];
