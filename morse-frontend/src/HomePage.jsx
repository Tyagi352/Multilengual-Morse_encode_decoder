import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] overflow-hidden">
      <div className="container mx-auto p-10">

        {/* HERO */}
        <div className="text-center mb-16 animate-fade-in-down">
          <h1 className="text-5xl font-extrabold tracking-widest text-[#FACC15] mb-4">
            MORSE CODE SYSTEM
          </h1>
          <p className="text-lg tracking-wide text-[#A8A29E] max-w-2xl mx-auto">
            A reliable platform to encode and decode information using
            standardized Morse code techniques.
          </p>
        </div>

        {/* INFO PANELS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">

          {/* FEATURES */}
          <div
            className="bg-[#1C1917] border border-[#44403C] p-8 rounded-xl shadow-lg
                       transition-transform duration-300 hover:scale-[1.02]
                       animate-fade-in-left"
          >
            <h2 className="text-2xl font-bold tracking-widest text-[#FACC15] mb-6">
              KEY FEATURES
            </h2>

            <ul className="space-y-4 text-sm tracking-wide text-[#D6D3D1]">
              <li>
                ▸ <span className="text-[#FACC15] font-semibold">Multi-Language Support:</span>{" "}
                English, Hindi, Marathi, French
              </li>
              <li>
                ▸ <span className="text-[#FACC15] font-semibold">Text & File Processing</span>
              </li>
              <li>
                ▸ <span className="text-[#FACC15] font-semibold">User Authentication</span>
              </li>
              <li>
                ▸ <span className="text-[#FACC15] font-semibold">Clean & Structured Interface</span>
              </li>
            </ul>
          </div>

          {/* HOW IT WORKS */}
          <div
            className="bg-[#1C1917] border border-[#44403C] p-8 rounded-xl shadow-lg
                       transition-transform duration-300 hover:scale-[1.02]
                       animate-fade-in-right"
          >
            <h2 className="text-2xl font-bold tracking-widest text-[#FACC15] mb-6">
              SYSTEM OVERVIEW
            </h2>

            <p className="text-sm tracking-wide text-[#D6D3D1] leading-relaxed">
              The system converts user-provided text or files into Morse code
              and also decodes Morse input back into readable form. Users can
              upload files or enter text, select a language, and process the
              data efficiently. Encoded outputs are stored in a
              <span className="text-[#FACC15]"> .enc </span>
              format for structured handling.
            </p>
          </div>
        </div>

        {/* ACTION BUTTON */}
        <div className="text-center mb-20 animate-fade-in-up">
          <Link
            to="/dashboard"
            className="inline-block px-10 py-4 text-lg font-bold tracking-widest
                       bg-[#FACC15] text-black rounded-lg
                       hover:bg-[#EAB308] hover:scale-[1.05]
                       transition-all duration-300
                       shadow-[0_0_20px_rgba(250,204,21,0.35)]"
          >
            OPEN DASHBOARD
          </Link>
        </div>

        {/* FOOTER */}
        <div
          className="text-center text-sm tracking-wider text-[#78716C]
                     border-t border-[#44403C] pt-8 animate-fade-in"
        >
          <h2 className="text-lg font-bold tracking-widest text-[#FACC15] mb-2">
            CONTACT
          </h2>
          <p>
            For queries or feedback, reach us at{" "}
            <a
              href="mailto:contact@morseencoder.com"
              className="text-[#FACC15] hover:underline"
            >
              contact@morseencoder.com
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
