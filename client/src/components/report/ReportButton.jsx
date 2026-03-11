import React, { useState } from "react";
import ReportModal from "./ReportModal";

export default function ReportButton({ target, className = "" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm font-medium transition bg-slate-800 border border-slate-700 hover:bg-red-600/80 hover:text-white ${className}`}
        onClick={() => setOpen(true)}
        aria-label="Report"
        title="Report"
      >
        <span className="text-red-400">⚑</span>
        <span className="hidden sm:inline">Report</span>
      </button>

      <ReportModal open={open} onClose={() => setOpen(false)} target={target} />
    </>
  );
}
