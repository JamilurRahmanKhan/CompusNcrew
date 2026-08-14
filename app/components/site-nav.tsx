"use client";

import Link from "next/link";
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
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const onGraphicDesignGallery = pathname === "/services/graphic-design";
  const socialVideoPage = pathname === "/services/social-media-marketing";
  const [socialHeroVisible, setSocialHeroVisible] = useState(socialVideoPage);

  // The homepage hero is a dark, full-bleed video — the light-theme nav
  // text (dark ink) is invisible sitting directly on it. Once scrolled past
  // the hero (or the overlay is open), the header gets its own light pill
  // background from `scrolled` below and reads fine in the normal palette,
  // so the swap only needs to cover the unscrolled state on "/".
  const immersiveDark = pathname === "/services/email-sms";
  const onDarkHero = (pathname === "/" && !scrolled && !open) || (immersiveDark && !open);

  useEffect(() => {
    if (onGraphicDesignGallery) {
      setScrolled(false);
      return;
    }
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setSocialHeroVisible(socialVideoPage && window.scrollY < window.innerHeight - 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onGraphicDesignGallery, socialVideoPage]);

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
      menuRef.current?.querySelector<HTMLElement>("[data-site-menu-initial-focus]")
        ?.focus({ preventScroll: true });
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
        .filter((element) => element.tabIndex >= 0);
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
        aria-hidden={socialHeroVisible && !open}
        inert={socialHeroVisible && !open ? true : undefined}
        className={`fixed inset-x-0 top-0 z-50 transition-[color,background-color,border-color,opacity,transform] duration-500 ${
          scrolled && !open && !onGraphicDesignGallery
            ? immersiveDark
              ? "bg-black/65 backdrop-blur-xl"
              : "bg-ink/70 backdrop-blur-xl"
            : ""
        } ${onDarkHero ? "on-dark" : ""} ${
          socialHeroVisible && !open ? "pointer-events-none -translate-y-full opacity-0" : "translate-y-0 opacity-100"
        } ${onGraphicDesignGallery ? "pointer-events-none" : ""}`}
      >
        <nav
          className={`mx-auto flex h-16 max-w-[80rem] items-center justify-between px-6 ${
            onGraphicDesignGallery ? "pointer-events-auto" : ""
          }`}
          aria-label="Primary"
        >
          <button
            ref={menuButtonRef}
            type="button"
            className="pill"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 font-display text-[1.375rem] leading-none text-bright"
            aria-label={`${brand.name} — home`}
          >
            {brand.name}
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden sm:inline-flex"><LocalTime /></span>
            <Link href="/contact" className="pill">
              Start
            </Link>
          </div>
        </nav>
      </header>

      {/* Overlay menu. Rendered always so its links are in the DOM for crawlers;
          visibility is driven by opacity + pointer-events, not display:none. */}
      <div
        ref={menuRef}
        id="site-menu"
        className={`fixed inset-0 z-40 overflow-y-auto bg-ink/95 backdrop-blur-2xl transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
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
            {[
              { href: "/method", label: "Method" },
              { href: "/work", label: "Work" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Start a project" },
            ].map((link) => (
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
    </>
  );
}
