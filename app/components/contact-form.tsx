"use client";

import { useState } from "react";
import { brand } from "../brand";
import { services } from "../content";

/**
 * The qualification form from playbook §8: company, role, size, current volume,
 * main problem, desired outcome, timeline, budget range, current systems, and
 * whether the decision-maker will attend.
 *
 * It deliberately does NOT ask for anything sensitive — no revenue figures to
 * the pound, no personal identifiers beyond a work email.
 *
 * There is no backend yet, so submit composes a mailto with the answers
 * formatted. That is a real, working path on day one and it is honest about
 * what it does. Swap `handleSubmit` for a POST to /api/enquiry when the
 * endpoint exists — nothing else changes.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const lines: string[] = [];
    data.forEach((value, key) => {
      if (key === "company_website") return; // honeypot
      if (typeof value === "string" && value.trim()) {
        lines.push(`${key.replace(/_/g, " ")}: ${value.trim()}`);
      }
    });

    // Honeypot — bots fill hidden fields, people don't.
    if ((data.get("company_website") as string)?.length) return;

    const subject = `Enquiry — ${data.get("company") || "New"}`;
    window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
    setSent(true);
  }

  const field =
    "w-full rounded-xl border border-hairline bg-raised/60 px-4 py-3 text-detail text-bright placeholder:text-muted/70 focus:border-accent/60 focus:outline-none";
  const label = "mb-2 block text-[0.8125rem] tracking-wide text-muted";

  return (
    <form onSubmit={handleSubmit} className="mt-14 grid gap-6 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className={label} htmlFor="name">
          Your name
        </label>
        <input id="name" name="name" required className={field} autoComplete="name" />
      </div>

      <div>
        <label className={label} htmlFor="email">
          Work email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={field}
          autoComplete="email"
          placeholder="name@company.com"
        />
      </div>

      <div>
        <label className={label} htmlFor="company">
          Company
        </label>
        <input id="company" name="company" required className={field} autoComplete="organization" />
      </div>

      <div>
        <label className={label} htmlFor="role">
          Your role
        </label>
        <input id="role" name="role" className={field} autoComplete="organization-title" />
      </div>

      <div>
        <label className={label} htmlFor="size">
          Team size
        </label>
        <select id="size" name="size" className={field} defaultValue="">
          <option value="" disabled>
            Select
          </option>
          <option>Just me</option>
          <option>2–10</option>
          <option>11–50</option>
          <option>51–200</option>
          <option>200+</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <label className={label} htmlFor="service">
          What are you most interested in?
        </label>
        <select id="service" name="service" className={field} defaultValue="">
          <option value="" disabled>
            Select
          </option>
          <option>Not sure yet — help me work it out</option>
          {services.map((s) => (
            <option key={s.slug}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <label className={label} htmlFor="problem">
          What is the problem costing you the most right now?
        </label>
        <textarea id="problem" name="problem" rows={4} required className={field} />
      </div>

      <div className="md:col-span-2">
        <label className={label} htmlFor="outcome">
          What would a good outcome look like in ninety days?
        </label>
        <textarea id="outcome" name="outcome" rows={3} className={field} />
      </div>

      <div>
        <label className={label} htmlFor="timeline">
          Timeline
        </label>
        <select id="timeline" name="timeline" className={field} defaultValue="">
          <option value="" disabled>
            Select
          </option>
          <option>Immediately</option>
          <option>Within a month</option>
          <option>This quarter</option>
          <option>Exploring for later</option>
        </select>
      </div>

      <div>
        <label className={label} htmlFor="budget">
          Budget range
        </label>
        <select id="budget" name="budget" className={field} defaultValue="">
          <option value="" disabled>
            Select
          </option>
          <option>Under $2,000</option>
          <option>$2,000 – $5,000</option>
          <option>$5,000 – $15,000</option>
          <option>$15,000+</option>
          <option>Not established yet</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <label className={label} htmlFor="systems">
          What tools and systems are already in place?
        </label>
        <input
          id="systems"
          name="systems"
          className={field}
          placeholder="Shopify, HubSpot, Google Ads…"
        />
      </div>

      <div className="md:col-span-2 flex items-start gap-3">
        <input
          id="decision_maker"
          name="decision_maker"
          type="checkbox"
          value="yes"
          className="mt-1 size-4 accent-[#ffa033]"
        />
        <label htmlFor="decision_maker" className="text-detail text-muted">
          The person who can approve budget will be on the call.
        </label>
      </div>

      {/* Honeypot. Hidden from people, irresistible to bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company_website">Leave this empty</label>
        <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="md:col-span-2 mt-2 flex flex-wrap items-center gap-5">
        <button type="submit" className="pill px-6 py-3">
          Send enquiry
        </button>
        <p className="text-[0.8125rem] text-muted">
          {sent
            ? "Your email client should have opened. If it didn't, write to us directly."
            : `Goes straight to ${brand.email}. We reply within one business day.`}
        </p>
      </div>
    </form>
  );
}
