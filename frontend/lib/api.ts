import type { GovJob } from "./types";

const API_BASE = "/api"; // proxied to http://localhost:8100

async function json<T>(url: string): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`);
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  return (await res.json()) as T;
}

export function listGovJobs(params: Record<string, string> = {}): Promise<GovJob[]> {
  const qs = new URLSearchParams(params).toString();
  return json<GovJob[]>(`/jobs${qs ? `?${qs}` : ""}`);
}

export function getGovJob(id: number): Promise<GovJob> {
  return json<GovJob>(`/jobs/${id}`);
}

export function getFilters(): Promise<{ ministries: string[]; locations: string[] }> {
  return json("/filters/meta");
}