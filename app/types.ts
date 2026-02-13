export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  postedDate: string;
  source: string;
  logo?: string;
  applyUrl: string;
  tags?: string[];
  remote?: boolean;
};

export type JobSearchParams = {
  query: string;
  location: string;
  limit?: number;
};
