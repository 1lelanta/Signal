import React, { useEffect, useState } from "react";
import { createReport } from "../../services/reportAPI";

export default function ReportModal({ open, onClose, target }) {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) {
      setReason("");
      setNotes("");
      setError(null);
      setSuccess(false);
      setLoading(false);
    }
  }, [open]);

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
      // auto-close after short delay
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1400);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to report");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md mx-4 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">Report {target?.type}</h3>
            <p className="text-xs text-slate-400">Tell us why you're reporting this {target?.type}.</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close report dialog"
            className="text-slate-400 hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs text-slate-300 mb-2">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full bg-slate-800 text-slate-100 border border-slate-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select reason</option>
              <option value="spam">Spam</option>
              <option value="harassment">Harassment</option>
              <option value="hate">Hate speech</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-2">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full bg-slate-800 text-slate-100 border border-slate-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3 py-1.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !reason}
              className="px-3 py-1.5 rounded-md bg-red-600 text-white disabled:opacity-60"
            >
              {loading ? "Reporting..." : "Report"}
            </button>
          </div>
        </form>

        {error && <div className="mt-3 text-sm text-red-400">{error}</div>}
        {success && <div className="mt-3 text-sm text-green-400">Report submitted. Thank you.</div>}
      </div>
    </div>
  );
}
