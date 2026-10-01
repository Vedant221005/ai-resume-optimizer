"use client";

import { useState } from "react";
import DocumentPreview from "@/components/DocumentPreview";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import ResumeUpload from "@/components/ResumeUpload";
import type { DocumentResponse } from "@/types/document";

export default function Home() {
  const [resume, setResume] = useState<DocumentResponse | null>(null);
  const [jobDescription, setJobDescription] = useState<DocumentResponse | null>(null);
  const [pastedJobDescription, setPastedJobDescription] = useState("");

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div className="brand-mark">A</div>
        <span>AI Resume Optimizer</span>
        <span className="milestone-pill">Milestone 1</span>
      </header>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Resume workspace</p>
          <h1>Make every application count.</h1>
          <p>Upload your resume and a job description to get started. We&apos;ll extract your documents securely and keep them ready for the next step.</p>
        </div>
        <div className="hero-note"><span>01</span><strong>Upload documents</strong><small>PDF or DOCX files, up to 5 MB</small></div>
      </section>
      <section className="upload-grid" aria-label="Document upload">
        <ResumeUpload onUploaded={setResume} onRemoved={() => setResume(null)} />
        <JobDescriptionInput
          onUploaded={(document) => { setJobDescription(document); setPastedJobDescription(""); }}
          onPasted={(text) => { setPastedJobDescription(text); setJobDescription(null); }}
          onRemoved={() => setJobDescription(null)}
        />
      </section>
      <DocumentPreview resumeText={resume?.text ?? ""} jobDescriptionText={jobDescription?.text ?? pastedJobDescription} />
      <footer>Milestone 1 · Document upload and text extraction</footer>
    </main>
  );
}

