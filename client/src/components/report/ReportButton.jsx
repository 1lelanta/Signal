import React, { useState } from "react";
import ReportModal from "./ReportModal";

export default function ReportButton({ target }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="btn-link report-button" onClick={() => setOpen(true)}>
        Report
      </button>
      <ReportModal open={open} onClose={() => setOpen(false)} target={target} />
    </>
  );
}
