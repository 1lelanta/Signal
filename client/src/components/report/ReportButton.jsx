import React, { useState } from "react";
import ReportModal from "./ReportModal";

export default function ReportButton({ target, className = "" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm font-medium transition bg-slate-700 border border-slate-600 text-slate-100 hover:bg-red-600 hover:text-white ${className}`}
        onClick={() => setOpen(true)}
        aria-label="Report"
        title="Report"
      >
        <span className="text-red-300">⚑</span>
        <span className="hidden sm:inline">Report</span>
      </button>

      <ReportModal open={open} onClose={() => setOpen(false)} target={target} />
    </>
  );
}
