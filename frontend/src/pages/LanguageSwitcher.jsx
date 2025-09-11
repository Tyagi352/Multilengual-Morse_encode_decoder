// src/pages/LanguageSwitcher.jsx
import React from "react";

export default function LanguageSwitcher({ selectedLang, setSelectedLang }) {
  return (
    <div className="max-w-md w-full bg-white/90 rounded-lg shadow-lg p-8 mt-8">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Select Language for Encoding/Decoding</h2>
      <div className="flex flex-wrap gap-4">
        {["English", "Hindi", "Gujarati", "Marathi", "Tamil", "Telugu", "Bengali", "Kannada",  "Punjabi"].map((lang, idx) => (
          <button
            key={lang}
            className={`px-4 py-2 rounded ${selectedLang === lang.toLowerCase().slice(0,2) ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setSelectedLang(lang.toLowerCase().slice(0,2))}
          >
            {lang}
          </button>
        ))}
      </div>
    </div>
  );
}
