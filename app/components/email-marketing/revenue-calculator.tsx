"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./revenue-calculator.module.css";

function formatMoney(value: number) {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

export function RevenueCalculator() {
  const [leads, setLeads] = useState(100);
  const [value, setValue] = useState(500);
  const [rate, setRate] = useState(20);
  const [improve, setImprove] = useState(5);

  const { monthly, yearly } = useMemo(() => {
    const newRate = Math.min(rate * (1 + improve / 100), 100);
    const additionalRatePoints = newRate - rate;
    const additionalMonthly = leads * value * (additionalRatePoints / 100);
    return { monthly: additionalMonthly, yearly: additionalMonthly * 12 };
  }, [leads, value, rate, improve]);

  return (
    <div className={styles.body}>
      <div className={styles.fields}>
        <label className={styles.field}>
          <span>Monthly Leads</span>
          <input
            type="number"
            min={0}
            step={1}
            value={leads}
            onChange={(e) => setLeads(Number(e.target.value) || 0)}
          />
        </label>
        <label className={styles.field}>
          <span>Average Customer Value</span>
          <div className={styles.inputWrap}>
            <span className={styles.prefix}>$</span>
            <input
              type="number"
              min={0}
              step={1}
              value={value}
              className={styles.hasPrefix}
              onChange={(e) => setValue(Number(e.target.value) || 0)}
            />
          </div>
        </label>
        <label className={styles.field}>
          <span>Current Close Rate (%)</span>
          <div className={styles.inputWrap}>
            <input
              type="number"
              min={0}
              max={100}
              step={1}
              value={rate}
              className={styles.hasSuffix}
              onChange={(e) => setRate(Number(e.target.value) || 0)}
            />
            <span className={styles.suffix}>%</span>
          </div>
        </label>
        <label className={styles.field} style={{ marginBottom: 0 }}>
          <span>Improve By (%)</span>
          <div className={styles.inputWrap}>
            <input
              type="number"
              min={0}
              max={100}
              step={1}
              value={improve}
              className={styles.hasSuffix}
              onChange={(e) => setImprove(Number(e.target.value) || 0)}
            />
            <span className={styles.suffix}>%</span>
          </div>
        </label>
      </div>

      <div className={styles.result}>
        <div className={styles.resultLabel}>Your Potential Additional Revenue</div>
        <div className={styles.resultMonth}>
          +{formatMoney(monthly)} <span>/month</span>
        </div>
        <div className={styles.resultYear}>
          +{formatMoney(yearly)} <span>/year</span>
        </div>
        <p className={styles.note}>*Results vary. This is an estimate.</p>
        <Link href="/contact" className={styles.cta}>
          Get My Full Audit <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
