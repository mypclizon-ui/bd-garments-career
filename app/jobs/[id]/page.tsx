"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { getGovJob } from "@/lib/api";
import type { GovJob } from "@/lib/types";

export default function GovJobDetailPage() {
  const params = useParams();
  const jobId = Number(params.id);
  const [job, setJob] = useState<GovJob | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getGovJob(jobId).then(setJob).catch((e) => setError(e.message));
  }, [jobId]);

  if (!job && !error) return <section className="page"><div className="container"><p>Loading circular…</p></div></section>;
  if (error) return <section className="page"><div className="container"><p style={{ color: "#a2171f" }}>{error}</p></div></section>;

  return (
    <section className="page">
      <div className="container" style={{ maxWidth: 880 }}>
        <motion.div className="card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <span className="gov-kicker">Government Circular</span>
          <h1 style={{ fontSize: "1.7rem" }}>{job!.title}</h1>
          <p style={{ color: "var(--ink-soft)" }}>
            {job!.ministry && <>🏛 {job!.ministry}</>}
            {job!.department && <> · 🏢 {job!.department}</>}
            {job!.location && <> · 📍 {job!.location}</>}
          </p>

          <hr style={{ border: "none", borderTop: "1px solid var(--line)", margin: "1.3rem 0" }} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            {job!.vacancy_count > 0 && <div><strong>Vacancies</strong><div>{job!.vacancy_count} posts</div></div>}
            {job!.grade && <div><strong>Scale / Grade</strong><div>{job!.grade}{job!.salary_scale ? ` · ${job!.salary_scale}` : ""}</div></div>}
            {job!.deadline && <div><strong>Application Deadline</strong><div style={{ color: "#a2171f" }}>{job!.deadline}</div></div>}
          </div>

          {job!.education && <><h3>Educational Requirements</h3><p>{job!.education}</p></>}
          {job!.description && <><h3>Job Description</h3><p>{job!.description}</p></>}

          {job!.source_url && (
            <a className="btn btn--primary" href={job!.source_url} target="_blank" rel="noopener noreferrer" style={{ marginTop: "1rem" }}>
              View Official Notice
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}