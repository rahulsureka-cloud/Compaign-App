import React from 'react';
import '../../../styles/wizard.css';

/** Read-only campaign summary with per-section edit (pencil) jumps to a step. */
export default function StepReview({ form, segments, onEdit }) {
  const segmentNames = segments
    .filter((s) => form.segmentIds.includes(s.id))
    .map((s) => s.name);

  const Section = ({ title, step, children }) => (
    <div className="summary-section">
      <div className="summary-head">
        <h3>{title}</h3>
        <button className="icon-btn" aria-label={`Edit ${title}`} onClick={() => onEdit(step)}>✏️</button>
      </div>
      <div className="summary-body">{children}</div>
    </div>
  );

  const Row = ({ label, value }) => (
    <div className="summary-row">
      <span className="summary-label">{label}</span>
      <span className="summary-value">{value || '—'}</span>
    </div>
  );

  return (
    <div className="wizard-body">
      <h2>Campaign summary</h2>

      <Section title="Campaign details" step={1}>
        <Row label="Campaign name" value={form.name} />
        <Row label="Product" value={form.productCategory} />
        <Row label="Priority" value={form.priority} />
        <Row label="Start date" value={form.startDate} />
        <Row label="End date" value={form.endDate} />
        <Row label="Channel" value={form.channels.join(', ')} />
      </Section>

      <Section title="Segment" step={2}>
        <Row label="User segment" value={segmentNames.join(', ')} />
        {form.manualUploadName && <Row label="Uploaded list" value={form.manualUploadName} />}
        <Row label="Estimated reach" value={form.estimatedReach.toLocaleString()} />
      </Section>

      <Section title="Location" step={3}>
        <Row label="Web location" value={form.webLocations.join(', ')} />
        <Row label="Mobile location" value={form.mobileLocations.join(', ')} />
      </Section>
    </div>
  );
}
