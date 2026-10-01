"use client";

import { useRef, useState } from "react";
import { uploadResume } from "@/services/api";
import type { DocumentResponse } from "@/types/document";

interface ResumeUploadProps {
  onUploaded: (document: DocumentResponse) => void;
  onRemoved: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ResumeUpload({ onUploaded, onRemoved }: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  async function handleFile(file?: File) {
    if (!file) return;
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !["pdf", "docx"].includes(extension)) {
      setStatus("error");
      setError("Unsupported file. Please choose a PDF or DOCX.");
      return;
    }
    if (file.size === 0) {
      setStatus("error");
      setError("This file is empty.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setStatus("error");
      setError("File is too large. Maximum size is 5 MB.");
      return;
    }
    setSelectedFile(file);
    setStatus("loading");
    setError("");
    setProgress(10);
    try {
      const result = await uploadResume(file, setProgress);
      setStatus("success");
      onUploaded(result);
    } catch (uploadError) {
      setStatus("error");
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed. Please try again.");
    }
  }

  function removeFile() {
    setSelectedFile(null);
    setStatus("idle");
    setProgress(0);
    setError("");
    onRemoved();
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="upload-card">
      <div className="card-title-row">
        <div>
          <p className="eyebrow">Step 1</p>
          <h2>Upload your resume</h2>
        </div>
        <span className="file-icon">CV</span>
      </div>
      {!selectedFile || status === "error" ? (
        <button
          className="drop-zone"
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            void handleFile(event.dataTransfer.files[0]);
          }}
        >
          <span className="upload-symbol">↑</span>
          <strong>Drop your resume here</strong>
          <span>or browse files from your device</span>
          <span className="browse-button">Browse files</span>
          <small>Supported formats: PDF, DOCX · Max 5 MB</small>
        </button>
      ) : (
        <div className="file-state">
          <div className="file-row">
            <span className="file-icon">.{selectedFile.name.split(".").pop()}</span>
            <div className="file-details">
              <strong>{selectedFile.name}</strong>
              <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            {status === "success" && <span className="success-badge">Uploaded</span>}
          </div>
          {status === "loading" && (
            <div className="progress-wrap" aria-label={`Uploading ${progress}%`}>
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
          )}
          <div className="file-actions">
            <button type="button" className="text-button" onClick={() => inputRef.current?.click()}>
              Replace
            </button>
            <button type="button" className="text-button danger" onClick={removeFile}>
              Remove
            </button>
          </div>
        </div>
      )}
      {error && <p className="error-message" role="alert">{error}</p>}
      <input
        ref={inputRef}
        className="visually-hidden"
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />
    </div>
  );
}

