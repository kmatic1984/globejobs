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
  url?: string;
};

export type JobSearchParams = {
  query: string;
  location: string;
  page?: number;
  limit?: number;
};
