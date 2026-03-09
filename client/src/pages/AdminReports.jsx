import React, { useEffect, useState } from "react";
import { listReports, updateReport } from "../services/reportAPI";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listReports();
      setReports(Array.isArray(data) ? data : data.reports || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAction = async (id, nextStatus) => {
    try {
      await updateReport(id, { status: nextStatus });
      fetchReports();
    } catch (err) {
      // ignore - optionally show error
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Reports</h2>
      {loading && <p>Loading reports...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && reports.length === 0 && <p>No reports found.</p>}

      <div className="space-y-3">
        {reports.map((r) => (
          <div key={r._id} className="p-3 border rounded bg-slate-900 border-slate-700">
            <div className="flex justify-between items-start gap-3">
              <div>
                <div className="text-sm text-slate-300 font-medium">{r.reason} — {r.targetType}</div>
                <div className="text-xs text-slate-400">Target: {r.targetId}</div>
                <div className="text-xs text-slate-400">By: {r.reporter?.email || r.reporter?.username || 'anonymous'}</div>
                <div className="text-xs text-slate-400">Created: {new Date(r.createdAt).toLocaleString()}</div>
                {r.notes && <div className="mt-2 text-sm text-slate-200">{r.notes}</div>}
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-xs text-slate-400">Status: <strong className="text-slate-200">{r.status}</strong></div>
                <div className="flex gap-2">
                  <button onClick={() => handleAction(r._id, 'resolved')} className="px-2 py-1 bg-green-600 rounded text-xs">Resolve</button>
                  <button onClick={() => handleAction(r._id, 'dismissed')} className="px-2 py-1 bg-yellow-600 rounded text-xs">Dismiss</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
