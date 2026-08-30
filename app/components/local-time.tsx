"use client";

import { useEffect, useState } from "react";
import { brand } from "../brand";

/**
 * MetaLab puts its local time in the header ("YYZ 11:56 PM"). It is a small
 * thing that does a lot of work — it says a specific person in a specific place
 * made this, which is exactly the signal an offshore studio needs to send.
 *
 * Renders empty on the server so the markup never mismatches on hydration.
 */
export function LocalTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: brand.timezone,
      }).format(new Date());

    setTime(format());
    const id = setInterval(() => setTime(format()), 20_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="hidden text-[0.8125rem] tracking-wide text-muted tabular-nums sm:inline">
      {brand.timezoneLabel} {time || "—"}
    </span>
  );
}
