"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

/**
 * Admin page — publish a new government job circular.
 *
 * Calls POST /api/jobs on the deployed backend, guarded by the X-Admin-Key
 * header. Keep the key secret (set as ADminKey in your Render env, or as the
 * ADMIN_KEY constant at deploy time).
 */
export default function AdminPage() {
  const [form, setForm] = useState({
    title: "",
    ministry: "",
    department: "",
    location: "",
    vacancy_count: 1,
    grade: "",
    salary_scale: "",
    education: "",
    description: "",
    deadline: "",
    source_url: "",
  });
  const [adminKey, setAdminKey] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "vacancy_count" ? Number(value) : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!adminKey.trim()) {
      setStatus({ ok: false, text: "Admin key required." });
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Key": adminKey,
        },
        body: JSON.stringify({
          ...form,
          vacancy_count: Number(form.vacancy_count) || 1,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || res.statusText);
      }
      setStatus({ ok: true, text: `"${data.title}" published successfully!` });
      setForm({
        title: "", ministry: "", department: "", location: "",
        vacancy_count: 1, grade: "", salary_scale: "", education: "",
        description: "", deadline: "", source_url: "",
      });
    } catch (err) {
      setStatus({ ok: false, text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page">
      <div className="container" style={{ maxWidth: 720 }}>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <span className="gov-kicker">Admin</span>
          <h2 className="section-title" style={{ marginTop: "0.2em" }}>Publish a Government Job</h2>
          <p style={{ color: "var(--ink-soft)" }}>
            Fill in the circular details and click publish. Only the site admin can post.
          </p>

          <form onSubmit={handleSubmit} className="card" style={{ marginTop: "1.6rem" }}>
            <div className="field">
              <label htmlFor="adminKey">Admin Key</label>
              <input id="adminKey" name="adminKey" type="password"
                value={adminKey} onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Your admin key (set in Render env)" required />
            </div>

            <div className="field">
              <label htmlFor="title">Job Title *</label>
              <input id="title" name="title" value={form.title} onChange={handleChange} required />
            </div>

            <div className="field">
              <label htmlFor="ministry">Ministry</label>
              <input id="ministry" name="ministry" value={form.ministry} onChange={handleChange}
                placeholder="e.g. Ministry of Home Affairs" />
            </div>

            <div className="field">
              <label htmlFor="department">Department / Office</label>
              <input id="department" name="department" value={form.department} onChange={handleChange} />
            </div>

            <div className="field">
              <label htmlFor="location">Location</label>
              <input id="location" name="location" value={form.location} onChange={handleChange} />
            </div>

            <div className="field">
              <label htmlFor="vacancy_count">Number of Posts</label>
              <input id="vacancy_count" name="vacancy_count" type="number" min="1"
                value={form.vacancy_count} onChange={handleChange} />
            </div>

            <div className="field">
              <label htmlFor="grade">Grade / Scale</label>
              <input id="grade" name="grade" value={form.grade} onChange={handleChange}
                placeholder="e.g. Grade 8" />
            </div>

            <div className="field">
              <label htmlFor="salary_scale">Salary Scale</label>
              <input id="salary_scale" name="salary_scale" value={form.salary_scale} onChange={handleChange}
                placeholder="e.g. ৳25,000–40,000/mo" />
            </div>

            <div className="field">
              <label htmlFor="education">Educational Requirements</label>
              <input id="education" name="education" value={form.education} onChange={handleChange} />
            </div>

            <div className="field">
              <label htmlFor="deadline">Application Deadline</label>
              <input id="deadline" name="deadline" type="date" value={form.deadline} onChange={handleChange} />
            </div>

            <div className="field">
              <label htmlFor="source_url">Official Notice URL</label>
              <input id="source_url" name="source_url" value={form.source_url} onChange={handleChange}
                placeholder="https://..." />
            </div>

            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" rows={4} value={form.description} onChange={handleChange} />
            </div>

            <button className="btn btn--gold btn--block" type="submit" disabled={busy}>
              {busy ? "Publishing…" : "Publish Job"}
            </button>
            {status && (
              <p style={{ color: status.ok ? "#14653a" : "#a2171f", fontWeight: 600, marginTop: "0.8rem" }}>
                {status.text}
              </p>
            )}
          </form>

          <p style={{ marginTop: "1.2rem" }}>
            <Link href="/jobs">← View all government jobs</Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}