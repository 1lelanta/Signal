import React, { useState } from "react";
import { createReport } from "../../services/reportAPI";

export default function ReportModal({ open, onClose, target }) {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createReport({
        targetType: target.type,
        targetId: target.id,
        reason,
        notes,
      });
      setSuccess(true);
      setReason("");
      setNotes("");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-modal-backdrop">
      <div className="report-modal">
        <h3>Report {target?.type}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Reason
            <select value={reason} onChange={(e) => setReason(e.target.value)} required>
              <option value="">Select reason</option>
              <option value="spam">Spam</option>
              <option value="harassment">Harassment</option>
              <option value="hate">Hate speech</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Notes (optional)
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>

          <div className="report-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading || !reason}>
              {loading ? "Reporting..." : "Report"}
            </button>
          </div>
        </form>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">Report submitted. Thank you.</div>}
      </div>
    </div>
  );
}
