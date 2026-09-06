"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { listGovJobs } from "@/lib/api";
import type { GovJob } from "@/lib/types";
import GovJobCard from "./components/GovJobCard";

export default function GovHomePage() {
  const [jobs, setJobs] = useState<GovJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listGovJobs()
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <motion.div className="container hero__inner" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2>সরকারি চাকরির সর্বশেষ বিজ্ঞপ্তি</h2>
          <p>
            Get the latest Bangladesh government job circulars — ministries,
            departments, requirements, vacancies and deadlines — all in one
            trusted public-service portal.
          </p>
          <div>
            <Link className="btn btn--gold" href="/jobs">Browse Government Jobs</Link>
          </div>
        </motion.div>
      </section>

      <section className="page">
        <div className="container">
          <div className="section-head">
            <span className="gov-kicker">Latest Circulars</span>
            <h2 className="section-title">New Government Job Notices</h2>
          </div>

          {loading && <p>Loading notices…</p>}
          {!loading && jobs.length === 0 && <p>No circulars yet.</p>}

          <div className="gov-grid">
            {jobs.slice(0, 6).map((job, i) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.4 }}>
                <GovJobCard job={job} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}