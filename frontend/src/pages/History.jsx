// src/pages/History.jsx

import React from "react";

export default function History() {
  // This should fetch and display encoded/decoded history from backend or localStorage
  return (
    <div className="max-w-2xl w-full bg-black text-white rounded-xl shadow-xl p-8 mt-8 border border-zinc-800">
      <h2 className="text-lg font-semibold mb-4 text-white">History of Encoded/Decoded Files</h2>
      <div className="text-zinc-400">No history yet. Encoded/decoded files will appear here.</div>
    </div>
  );
}
