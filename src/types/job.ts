// JobData interface defines the structure of job-related data.
export interface JobData {
    id: string; // Unique identifier for the job
    title: string; // Title of the job
    description: string; // Description of the job
    company: string; // Name of the company
    location: string; // Location of the job
    salary?: number; // Optional salary
    datePosted: string; // Date the job was posted
    isRemote: boolean; // Indicates if the job is remote
}

// JobApplication interface defines the structure of a job application.
export interface JobApplication {
    jobId: string; // Identifier of the job
    applicantId: string; // Identifier of the applicant
    resume: string; // URL or path to the resume
    coverLetter?: string; // Optional cover letter
    dateApplied: string; // Date the application was submitted
}