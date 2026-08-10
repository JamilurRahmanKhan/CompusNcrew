"use client";

import { ArrowLeft, House } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function AiAutomationShell() {
  const router = useRouter();
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.body.classList.add("journey-mode");
    return () => document.body.classList.remove("journey-mode");
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const markLoaded = () => setLoaded(true);
    const fallback = window.setTimeout(markLoaded, 1800);
    frame.addEventListener("load", markLoaded);
    if (frame.contentDocument?.readyState === "complete") markLoaded();
    return () => {
      window.clearTimeout(fallback);
      frame.removeEventListener("load", markLoaded);
    };
  }, []);

  function goBack() { if (window.history.length > 1) router.back(); else router.push("/"); }

  return (
    <section className="fixed inset-0 z-[70] grid min-h-[100dvh] grid-rows-[3.75rem_minmax(0,1fr)] bg-[#090b0f] text-[#f4ead6]" aria-label="CompassNCrew AI automation workflow">
      <header className="relative z-20 flex items-center justify-between border-b border-white/10 bg-[#0b0d10]/95 px-[max(0.75rem,env(safe-area-inset-left))] shadow-[0_10px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:px-5">
        <button type="button" onClick={goBack} className="group inline-flex min-h-11 items-center gap-2 rounded-[0.625rem] border border-white/12 bg-white/[0.045] px-3 text-sm font-medium transition hover:-translate-y-px hover:border-[#ff7a35]/50 hover:bg-[#ff7a35]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff7a35]" aria-label="Go back to the previous page">
          <ArrowLeft className="size-4" aria-hidden="true"/><span>Back</span>
        </button>
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-center">
          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-[#f08043] sm:text-[0.6875rem]">AI automation</p>
          <p className="hidden text-xs text-[#9fa1a7] sm:block">Social Automation Engine</p>
        </div>
        <Link href="/" className="group inline-flex min-h-11 items-center gap-2 rounded-[0.625rem] border border-white/12 bg-white/[0.045] px-3 text-sm font-medium transition hover:-translate-y-px hover:border-[#ff7a35]/50 hover:bg-[#ff7a35]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff7a35]" aria-label="Go to the CompassNCrew home page">
          <House className="size-4" aria-hidden="true"/><span>Home</span>
        </Link>
      </header>
      <div className="relative min-h-0 overflow-hidden">
        <div className={`automation-loading-veil pointer-events-none absolute inset-0 z-10 grid place-items-center bg-[#090b0f] transition-opacity duration-500 ${loaded ? "opacity-0" : "opacity-100"}`} role="status" aria-live="polite" aria-hidden={loaded}>
          <div className="grid justify-items-center gap-3"><span className="grid size-12 place-items-center rounded-xl border border-[#ff7a35]/35 font-display text-2xl text-[#ff7a35] shadow-[0_0_30px_rgba(255,122,53,.12)]">C</span><span className="text-sm text-[#989a9f]">Powering the automation engine</span></div>
        </div>
        <iframe ref={frameRef} title="Interactive social media automation workflow" src="/ai-automation-app/index.html" className="block h-full w-full border-0 bg-[#090b0f]" onLoad={() => setLoaded(true)} allow="fullscreen" />
      </div>
    </section>
  );
}
