export type DocumentKind = "resume" | "job-description";

export interface DocumentResponse {
  success: boolean;
  filename: string;
  file_type: string;
  text: string;
}

