import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import ShareModal from "./ShareModal";

const API_BASE = "http://localhost:5000";

export default function EncodeFile({ token, setToken }) {
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("english");
  const [fileToEncode, setFileToEncode] = useState(null);

  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [fileToShare, setFileToShare] = useState(null);

  const [users, setUsers] = useState([]);

  const languages = ["english", "hindi", "marathi", "french"];

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setUsers(await res.json());
    } catch {}
  };

  const handleEncode = async (content, andShare = false) => {
    if (!token) return setMessage("Please login first.");
    if (!content) return setMessage("Please choose a file first.");

    try {
      const res = await fetch(`${API_BASE}/encode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: content, language }),
      });

      if (res.ok) {
        const blob = await res.blob();
        if (andShare) {
          openShareModal(
            new File([blob], "morse.enc", {
              type: "application/octet-stream",
            })
          );
        } else {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "morse.enc";
          a.click();
          window.URL.revokeObjectURL(url);
          setMessage("File encoded & downloaded!");
        }
      } else {
        setMessage("Encoding failed");
      }
    } catch {
      setMessage("Server error during encoding");
    }
  };

  const encodeTextFile = async (andShare = false) => {
    if (!fileToEncode) return setMessage("Please choose a text file first!");
    const content = await fileToEncode.text();
    handleEncode(content, andShare);
  };

  const openShareModal = (file) => {
    setFileToShare(file);
    setShareModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9]">

      <div className="container mx-auto p-8">

        {/* HEADER / BRIEFING */}
        <div className="mb-10 text-center animate-fade-in">
          <h1 className="text-3xl font-extrabold tracking-widest text-[#FACC15]">
            FILE ENCODING TERMINAL
          </h1>
          <p className="mt-2 text-sm tracking-wider text-[#A8A29E] max-w-xl mx-auto">
            Upload a text file to convert it into encrypted Morse format.
            Files can be stored locally or transmitted to authorized recipients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* LANGUAGE PANEL */}
          <div className="bg-[#1C1917] border border-[#44403C] p-6 rounded-xl shadow-lg h-fit animate-slide-in-left">
            <h2 className="text-xl font-bold mb-1 text-[#FACC15] tracking-widest">
              LANGUAGE PROTOCOL
            </h2>
            <p className="text-xs text-[#A8A29E] mb-4 tracking-wide">
              Select source language before encryption
            </p>

            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-300
                    ${
                      language === lang
                        ? "bg-[#FACC15] text-black scale-[1.02] shadow-[0_0_12px_rgba(250,204,21,0.4)]"
                        : "bg-[#292524] text-[#FAFAF9] hover:bg-[#44403C] hover:scale-[1.01]"
                    }`}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* ENCODE FILE */}
          <div className="md:col-span-2 space-y-8 animate-slide-in-right">

            <div className="bg-[#1C1917] border border-[#44403C] p-6 rounded-xl shadow-lg animate-fade-in">
              <h2 className="text-2xl font-bold mb-1 text-[#FACC15] tracking-widest">
                ENCODE FILE
              </h2>
              <p className="text-sm text-[#A8A29E] tracking-wide mb-4">
                Upload a <span className="text-[#FACC15]">.txt</span> file for secure encryption
              </p>

              <input
                type="file"
                accept=".txt"
                onChange={(e) => setFileToEncode(e.target.files[0])}
                className="w-full p-2 rounded-lg bg-[#0C0A09] text-[#FAFAF9]
                border border-[#44403C]
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:bg-[#FACC15] file:text-black
                hover:file:bg-[#EAB308] transition-all"
              />

              {fileToEncode && (
                <div className="mt-2 text-xs tracking-wider text-green-400 flex items-center gap-2 animate-fade-in animate-pulse">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  FILE LOCKED: {fileToEncode.name}
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => encodeTextFile(false)}
                  className="w-full py-2 rounded-lg font-semibold
                  bg-[#FACC15] text-black
                  hover:bg-[#EAB308] hover:scale-[1.02]
                  transition-all"
                >
                  Encode & Download
                </button>

                <button
                  onClick={() => encodeTextFile(true)}
                  className="w-full py-2 rounded-lg font-semibold
                  bg-[#292524] border border-[#FACC15]
                  text-[#FACC15] hover:bg-[#44403C]
                  hover:scale-[1.02] transition-all"
                >
                  Encode & Share
                </button>
              </div>

              <p className="mt-3 text-xs text-[#78716C] tracking-widest text-center">
                ENCODE → DOWNLOAD LOCALLY OR SHARE WITH AUTHORIZED USER
              </p>
            </div>

            {message && (
              <div className="p-4 rounded-lg text-center
              bg-[#292524] border border-[#FACC15]
              text-[#FACC15] animate-fade-in animate-pulse">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>

      {isShareModalOpen && (
        <ShareModal
          file={fileToShare}
          token={token}
          users={users}
          onClose={() => setShareModalOpen(false)}
        />
      )}

      <footer className="mt-12 py-6 text-center text-sm text-[#A8A29E] border-t border-[#44403C] animate-fade-in">
        © 2026 SecureMorse. All rights reserved. Encrypt your messages safely and share with confidence.
      </footer>

      {/* Animations */}
      <style jsx>{`
        .animate-fade-in { animation: fadeIn 1s ease-in-out; }
        .animate-slide-in-left { animation: slideInLeft 0.8s ease-out; }
        .animate-slide-in-right { animation: slideInRight 0.8s ease-out; }
        .animate-pulse { animation: pulse 1.5s infinite; }

        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes slideInLeft {
          0% { opacity: 0; transform: translateX(-50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          0% { opacity: 0; transform: translateX(50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
