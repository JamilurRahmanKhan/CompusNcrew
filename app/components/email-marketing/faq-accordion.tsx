"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "../../services/email-sms/email-marketing-data";
import styles from "./faq-accordion.module.css";

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.list}>
      {faqs.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.q} className={`${styles.item} ${open ? styles.open : ""}`}>
            <button
              type="button"
              className={styles.question}
              aria-expanded={open}
              aria-controls={`faq-panel-${index}`}
              onClick={() => setOpenIndex(open ? null : index)}
            >
              {item.q}
              <ChevronDown size={17} aria-hidden="true" className={styles.chevron} />
            </button>
            <div
              id={`faq-panel-${index}`}
              className={styles.answer}
              style={{ maxHeight: open ? "12rem" : "0" }}
            >
              <p>{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
