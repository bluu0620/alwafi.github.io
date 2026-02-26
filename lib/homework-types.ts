export type SubmissionType = "file" | "image" | "audio";

export interface Submission {
  id: string;
  type: SubmissionType;
  url: string;
  filename: string;
  size: number;
  submittedAt: string;
}

// Per student: subjectName -> list of submissions
export type HomeworkData = Record<string, Submission[]>;
