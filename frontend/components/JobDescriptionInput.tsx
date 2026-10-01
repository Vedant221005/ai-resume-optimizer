"use client";

import { useRef, useState } from "react";
import { uploadJobDescription } from "@/services/api";
import type { DocumentResponse } from "@/types/document";

interface JobDescriptionInputProps {
  onUploaded: (document: DocumentResponse) => void;
  onPasted: (text: string) => void;
  onRemoved: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function JobDescriptionInput({ onUploaded, onPasted, onRemoved }: JobDescriptionInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"upload" | "paste">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  async function handleFile(nextFile?: File) {
    if (!nextFile) return;
    const extension = nextFile.name.split(".").pop()?.toLowerCase();
    if (!extension || !["pdf", "docx"].includes(extension)) {
      setStatus("error"); setError("Unsupported file. Please choose a PDF or DOCX."); return;
    }
    if (nextFile.size === 0) {
      setStatus("error"); setError("This file is empty."); return;
    }
    if (nextFile.size > MAX_FILE_SIZE) {
      setStatus("error"); setError("File is too large. Maximum size is 5 MB."); return;
    }
    setFile(nextFile); setStatus("loading"); setError(""); setProgress(10);
    try {
      const result = await uploadJobDescription(nextFile, setProgress);
      setStatus("success"); onUploaded(result);
    } catch (uploadError) {
      setStatus("error");
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed. Please try again.");
    }
  }

  function clear() {
    setFile(null); setText(""); setStatus("idle"); setError(""); setProgress(0); onRemoved();
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="upload-card">
      <div className="card-title-row">
        <div><p className="eyebrow">Step 2</p><h2>Add a job description</h2></div>
        <span className="file-icon">JD</span>
      </div>
      <div className="mode-switch" role="tablist" aria-label="Job description input method">
        <button className={mode === "upload" ? "active" : ""} type="button" onClick={() => setMode("upload")}>Upload JD</button>
        <button className={mode === "paste" ? "active" : ""} type="button" onClick={() => setMode("paste")}>Paste JD</button>
      </div>
      {mode === "paste" ? (
        <div className="paste-area">
          <textarea
            value={text}
            onChange={(event) => {
              const nextText = event.target.value;
              setText(nextText);
              setError(nextText.trim() ? "" : "Please enter a job description.");
              onPasted(nextText);
            }}
            placeholder="Paste the job description here..."
            aria-label="Job description"
          />
          <div className="paste-footer">
            <span>{text.length} characters</span>
            {text.trim() && <button type="button" className="text-button danger" onClick={clear}>Clear</button>}
          </div>
        </div>
      ) : !file || status === "error" ? (
        <button
          className="drop-zone compact"
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => { event.preventDefault(); void handleFile(event.dataTransfer.files[0]); }}
        >
          <span className="upload-symbol">↑</span>
          <strong>Drop a JD file here</strong>
          <span>or browse files</span>
          <small>Supported formats: PDF, DOCX · Max 5 MB</small>
        </button>
      ) : (
        <div className="file-state">
          <div className="file-row">
            <span className="file-icon">.{file.name.split(".").pop()}</span>
            <div className="file-details"><strong>{file.name}</strong><span>{(file.size / 1024 / 1024).toFixed(2)} MB</span></div>
            {status === "success" && <span className="success-badge">Uploaded</span>}
          </div>
          {status === "loading" && <div className="progress-wrap"><div className="progress-bar" style={{ width: `${progress}%` }} /></div>}
          <div className="file-actions"><button type="button" className="text-button" onClick={() => inputRef.current?.click()}>Replace</button><button type="button" className="text-button danger" onClick={clear}>Remove</button></div>
        </div>
      )}
      {error && <p className="error-message" role="alert">{error}</p>}
      <input ref={inputRef} className="visually-hidden" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => void handleFile(event.target.files?.[0])} />
    </div>
  );
}
