import type { DocumentResponse } from "@/types/document";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function uploadDocument(
  endpoint: string,
  file: File,
  onProgress?: (progress: number) => void,
): Promise<DocumentResponse> {
  const formData = new FormData();
  formData.append("file", file);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error("Could not reach the backend. Please make sure the API is running and try again.");
  }
  onProgress?.(100);

  let payload: { detail?: string } & Partial<DocumentResponse>;
  try {
    payload = await response.json();
  } catch {
    throw new Error("The backend returned an invalid response.");
  }
  if (!response.ok) {
    throw new Error(payload.detail ?? "The document could not be processed.");
  }
  return payload as DocumentResponse;
}

export function uploadResume(file: File, onProgress?: (progress: number) => void) {
  return uploadDocument("/api/documents/resume", file, onProgress);
}

export function uploadJobDescription(file: File, onProgress?: (progress: number) => void) {
  return uploadDocument("/api/documents/job-description", file, onProgress);
}
