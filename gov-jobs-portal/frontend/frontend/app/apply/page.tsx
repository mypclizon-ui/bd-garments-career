"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/** Information page explaining the government job application process. */
export default function HowToApplyPage() {
  return (
    <section className="page">
      <div className="container" style={{ maxWidth: 860 }}>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <span className="gov-kicker">Guidelines</span>
          <h2 className="section-title" style={{ marginTop: "0.2em" }}>How to Apply for a Government Job</h2>

          <div className="card" style={{ marginTop: "1.6rem" }}>
            <h3>Step 1 — Check the official notice</h3>
            <p>
              Every circular links to the ministry&apos;s official notice. Always read the
              original notice carefully — it is the only authoritative source for posts,
              quotas and deadlines.
            </p>
            <h3>Step 2 — Prepare qualifying documents</h3>
            <p>
              Have your educational certificates, national ID (NID), passport photo and
              any required quota/non-quota documentation ready before you begin.
            </p>
            <h3>Step 3 — Apply through the official channel</h3>
            <p>
              Most government applications are submitted through the department&apos;s own
              portal (e.g. <a href="https://www.teletalk.com.bd" target="_blank" rel="noopener noreferrer">Teletalk online application</a>).
              Never pay anyone other than the official application fee.
            </p>
            <h3>Stay safe</h3>
            <p style={{ color: "#a2171f" }}>
              Beware of fraud. We never request your password, OTP or any payment. Only
              apply via the official links shown on each circular.
            </p>
            <Link className="btn btn--primary" href="/jobs" style={{ marginTop: "0.8rem" }}>← Back to All Jobs</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}