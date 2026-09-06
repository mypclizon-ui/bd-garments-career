"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getFilters, listGovJobs } from "@/lib/api";
import type { GovJob } from "@/lib/types";
import GovJobCard from "../components/GovJobCard";

export default function GovJobsPage() {
  const [jobs, setJobs] = useState<GovJob[]>([]);
  const [filters, setFilters] = useState<{ ministries: string[]; locations: string[] }>({ ministries: [], locations: [] });
  const [q, setQ] = useState("");
  const [ministry, setMinistry] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFilters().then(setFilters).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (q) params.q = q;
    if (ministry) params.ministry = ministry;
    if (location) params.location = location;
    listGovJobs(params)
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, [q, ministry, location]);

  return (
    <section className="page">
      <div className="container">
        <div className="section-head">
          <span className="gov-kicker">Government Job Circulars</span>
          <h2 className="section-title">Browse All Jobs</h2>
        </div>

        <div style={{ background: "var(--bg-soft)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "1.4rem", marginBottom: "2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: "0.8rem" }}>
            <div className="field"><label>Search</label><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Job title, grade, keyword…" /></div>
            <div className="field"><label>Ministry</label><select value={ministry} onChange={(e) => setMinistry(e.target.value)}><option value="">All Ministries</option>{filters.ministries.filter(Boolean).map((m) => <option key={m} value={m}>{m}</option>)}</select></div>
            <div className="field"><label>Location</label><select value={location} onChange={(e) => setLocation(e.target.value)}><option value="">All Locations</option>{filters.locations.filter(Boolean).map((m) => <option key={m} value={m}>{m}</option>)}</select></div>
          </div>
        </div>

        {loading ? <p>Loading…</p> : jobs.length === 0 ? <p>No government circulars match your search.</p> : (
          <div className="gov-grid">
            {jobs.map((job, i) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <GovJobCard job={job} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}