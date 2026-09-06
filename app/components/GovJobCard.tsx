import Link from "next/link";
import type { GovJob } from "@/lib/types";

export default function GovJobCard({ job }: { job: GovJob }) {
  return (
    <article className="gov-card">
      <span className="gov-card__badge">{job.grade || "Circular"}</span>
      <h3>
        <Link href={`/jobs/${job.id}`}>{job.title}</Link>
      </h3>
      <div className="gov-card__meta">
        {job.ministry && <span>🏛 {job.ministry}</span>}
        {job.department && <span>🏢 {job.department}</span>}
        {job.location && <span>📍 {job.location}</span>}
        {job.vacancy_count > 0 && <span>👥 {job.vacancy_count} posts</span>}
      </div>
      {job.deadline && (
        <span style={{ color: "#a2171f", fontWeight: 700, fontSize: "0.88rem" }}>
          Deadline: {job.deadline}
        </span>
      )}
      <div className="gov-card__action">
        <Link className="btn btn--primary btn--block" href={`/jobs/${job.id}`}>
          View Circular
        </Link>
      </div>
    </article>
  );
}