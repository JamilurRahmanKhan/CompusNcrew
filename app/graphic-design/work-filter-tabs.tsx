"use client";

import { useState } from "react";

const tabs = [
  "Brand Identity",
  "Art Direction",
  "Campaign Design",
  "Packaging",
  "Motion",
];

/** Category row above the work grid — click to highlight a focus area. */
export function WorkFilterTabs() {
  const [active, setActive] = useState(tabs[0]);

  return (
    <div className="mb-16 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-b border-white/10 pb-8">
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`text-lg font-medium transition sm:text-2xl ${
              isActive ? "text-white" : "text-white/35 italic hover:text-white/60"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
