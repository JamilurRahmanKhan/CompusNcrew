const marks = [
  { name: "Nova Systems", path: "M12 2 21 20H3z" },
  { name: "Orbit Labs", path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12z" },
  { name: "Vertex Co", path: "M12 3 3 21h18z M12 9 7 19h10z" },
  { name: "Lumen Group", path: "M4 12h4l2-8 4 16 2-8h4" },
  { name: "Atlas & Co", path: "M3 20 12 4l9 16z" },
  { name: "Forge Studio", path: "M3 4h18v6H3z M8 10v10h8V10" },
  { name: "Halcyon", path: "M2 12a10 10 0 0 1 20 0" },
  { name: "Drift Digital", path: "M3 6h18M3 12h18M3 18h12" },
  { name: "Anchor Bay", path: "M12 2v14 M6 10a6 6 0 0 0 12 0 M4 22h16" },
  { name: "Pulse Media", path: "M2 12h5l2 7 4-14 2 7h7" },
  { name: "Crest & Sons", path: "M2 20 12 2l10 18z M8 20l4-8 4 8" },
  { name: "Beacon Works", path: "M12 2 4 22h16z M8 14h8" },
];

/** Placeholder client-logo wall — swap for real client marks when available. */
export function TrustedBy() {
  return (
    <section className="bg-white px-6 py-24 md:px-16">
      <h2 className="mb-24 text-center text-2xl font-medium tracking-tight text-black md:text-3xl">
        Trusted by remarkable global brands
      </h2>
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-28 gap-y-32 sm:grid-cols-4">
        {marks.map((mark) => (
          <div key={mark.name} className="flex items-center justify-center gap-2.5 text-black">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={mark.path} />
            </svg>
            <span className="text-base font-semibold tracking-tight whitespace-nowrap">
              {mark.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
