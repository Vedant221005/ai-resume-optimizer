interface DocumentPreviewProps {
  resumeText: string;
  jobDescriptionText: string;
}

function PreviewCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="preview-card">
      <div className="preview-heading">
        <h3>{title}</h3>
        <span>Extracted text</span>
      </div>
      <div className="preview-content">
        <p>{text || "Upload a document to see its extracted text here."}</p>
      </div>
    </article>
  );
}

export default function DocumentPreview({ resumeText, jobDescriptionText }: DocumentPreviewProps) {
  return (
    <section className="preview-section" aria-label="Extracted documents">
      <div className="section-label">Document preview</div>
      <div className="preview-grid">
        <PreviewCard title="Resume" text={resumeText} />
        <PreviewCard title="Job Description" text={jobDescriptionText} />
      </div>
    </section>
  );
}

