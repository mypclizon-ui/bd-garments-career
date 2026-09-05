// Shared types for the gov jobs portal.
export interface GovJob {
  id: number;
  title: string;
  ministry?: string | null;
  department?: string | null;
  location?: string | null;
  vacancy_count: number;
  grade?: string | null;
  salary_scale?: string | null;
  education?: string | null;
  description?: string | null;
  deadline?: string | null;
  source_url?: string | null;
  created_at: string;
}