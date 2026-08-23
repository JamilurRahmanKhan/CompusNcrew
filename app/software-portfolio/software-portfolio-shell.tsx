"use client";

import { ArrowLeft, House } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function SoftwarePortfolioShell() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    document.body.classList.add("journey-mode");
    return () => document.body.classList.remove("journey-mode");
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const markLoaded = () => setLoaded(true);
    frame.addEventListener("load", markLoaded);

    // A prefetched static iframe can finish before React hydrates and attaches
    // its synthetic onLoad handler. Check the same-origin document once here
    // so the loading veil can never strand users over a ready WebGL scene.
    if (frame.contentDocument?.readyState === "complete") markLoaded();

    return () => frame.removeEventListener("load", markLoaded);
  }, []);

  function returnToPreviousPage() {
    if (window.history.length > 1) router.back();
    else router.push("/");
  }

  return (
    <section
      className="fixed inset-0 z-[70] grid min-h-[100dvh] grid-rows-[3.75rem_minmax(0,1fr)] bg-[#111315] text-[#f4ead6]"
      aria-label="CompassNCrew software portfolio journey"
    >
      <header className="safe-area-inline relative z-10 flex items-center justify-between border-b border-white/10 bg-[#111315]/95 shadow-[0_10px_32px_rgba(0,0,0,0.24)] backdrop-blur-xl">
        <button
          type="button"
          onClick={returnToPreviousPage}
          className="group inline-flex min-h-11 items-center gap-2 rounded-[0.625rem] border border-white/12 bg-white/[0.045] px-3 text-sm font-medium text-[#f4ead6] transition-[background-color,border-color,transform] duration-150 hover:-translate-y-px hover:border-white/25 hover:bg-white/[0.09] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed8a49]"
          aria-label="Go back to the previous page"
        >
          <ArrowLeft aria-hidden="true" className="size-4 transition-transform duration-150 group-hover:-translate-x-0.5" />
          <span>Back</span>
        </button>

        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-center">
          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-[#dc7431] sm:text-[0.6875rem]">
            Software portfolio
          </p>
          <p className="hidden text-xs text-[#b7afa2] sm:block">The CompassNCrew journey</p>
        </div>

        <Link
          href="/"
          className="group inline-flex min-h-11 items-center gap-2 rounded-[0.625rem] border border-white/12 bg-white/[0.045] px-3 text-sm font-medium text-[#f4ead6] transition-[background-color,border-color,transform] duration-150 hover:-translate-y-px hover:border-white/25 hover:bg-white/[0.09] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed8a49]"
          aria-label="Go to the CompassNCrew home page"
        >
          <House aria-hidden="true" className="size-4" />
          <span>Home</span>
        </Link>
      </header>

      <div className="relative min-h-0 overflow-hidden">
        <div
          className={`pointer-events-none absolute inset-0 z-10 grid place-items-center bg-[#111315] transition-opacity duration-300 ${
            loaded ? "opacity-0" : "opacity-100"
          }`}
          role="status"
          aria-live="polite"
          aria-hidden={loaded}
        >
          <div className="grid justify-items-center gap-3">
            <span className="grid size-12 place-items-center rounded-[0.875rem] border border-white/12 font-display text-2xl text-[#dc7431]">
              C
            </span>
            <span className="text-sm text-[#b7afa2]">Preparing the project road</span>
          </div>
        </div>

        <iframe
          ref={frameRef}
          title="Interactive CompassNCrew software portfolio"
          src="/software-portfolio-app/index.html"
          className="block h-full w-full border-0 bg-[#111315]"
          onLoad={() => setLoaded(true)}
          allow="fullscreen"
        />
      </div>
    </section>
  );
}
