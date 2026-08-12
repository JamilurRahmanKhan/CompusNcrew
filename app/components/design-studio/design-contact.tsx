"use client";

import { useState } from "react";
import { brand } from "../../brand";
import styles from "./design-studio.module.css";

export function DesignContact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if ((data.get("website") as string)?.length) return;

    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "Design project").trim();
    const projectType = String(data.get("project_type") || "Not selected").trim();
    const message = String(data.get("message") || "").trim();
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Project type: ${projectType}`,
      "",
      message,
    ].join("\n");

    window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent(
      `Design enquiry — ${subject}`,
    )}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  }

  return (
    <form className={styles.contactForm} onSubmit={handleSubmit}>
      <h3>Let&apos;s talk</h3>
      <p className={styles.contactIntro}>
        Tell us what you need designed. We reply within one business day.
      </p>

      <div className={styles.formGrid}>
        <label>
          <span>Full name*</span>
          <input name="name" type="text" autoComplete="name" required placeholder="Your name" />
        </label>
        <label>
          <span>Email*</span>
          <input name="email" type="email" inputMode="email" autoComplete="email" required placeholder="name@company.com" />
        </label>
        <label className={styles.formWide}>
          <span>Subject*</span>
          <input name="subject" type="text" required placeholder="What would you like to create?" />
        </label>
        <label className={styles.formWide}>
          <span>Project type</span>
          <select name="project_type" defaultValue="">
            <option value="" disabled>Select a service</option>
            <option>Brand identity</option>
            <option>Digital design</option>
            <option>Campaign creative</option>
            <option>Packaging & editorial</option>
            <option>Not sure yet</option>
          </select>
        </label>
        <label className={styles.formWide}>
          <span>Message*</span>
          <textarea name="message" rows={4} required placeholder="A short description of your business, goals and timeline" />
        </label>
      </div>

      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="design-website">Leave this empty</label>
        <input id="design-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.formFooter}>
        <button type="submit">Send message</button>
        <p aria-live="polite">
          {submitted
            ? "Your email app should now be open."
            : `Or email ${brand.email}`}
        </p>
      </div>
    </form>
  );
}
