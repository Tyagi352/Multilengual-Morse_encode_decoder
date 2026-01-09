import React, { useState, useEffect } from "react";
import ShareModal from "./components/ShareModal";

const API_BASE = "http://localhost:5000";

export default function Dashboard({ token }) {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("english");
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [fileToShare, setFileToShare] = useState(null);
  const [users, setUsers] = useState([]);

  // ✅ MUST match backend keys exactly
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
    if (!content.trim()) {
      setMessage("NO TRANSMISSION DATA DETECTED");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/encode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: content,      // UTF-8 safe
          language: language, // exact backend match
        }),
      });

      if (!res.ok) {
        setMessage("ENCODING FAILED — CHECK INPUT CHARACTERS");
        return;
      }

      const blob = await res.blob();

      if (andShare) {
        setFileToShare(new File([blob], "morse.enc"));
        setShareModalOpen(true);
      } else {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "morse.enc";
        a.click();
        window.URL.revokeObjectURL(url);
        setMessage("TRANSMISSION ENCODED & STORED");
      }
    } catch {
      setMessage("SERVER COMMUNICATION ERROR");
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9]">

      {/* HEADER */}
      <div className="border-b border-[#292524] px-8 py-6">
        <h1 className="text-3xl font-bold tracking-widest text-[#FACC15]">
          COMMAND DASHBOARD
        </h1>
        <p className="text-sm text-[#9CA3AF] tracking-wider mt-1">
          Secure Morse-based communication terminal
        </p>

        <div className="flex items-center gap-2 mt-3">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs tracking-widest text-green-400">
            SECURE CHANNEL ACTIVE
          </span>
        </div>
      </div>

      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* LANGUAGE PANEL */}
          <div className="bg-[#1C1917] border border-[#44403C] p-6 rounded-xl">
            <h2 className="text-lg font-bold mb-2 text-[#FACC15] tracking-widest">
              LANGUAGE PROTOCOL
            </h2>

            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`w-full px-4 py-2 rounded-lg
                    ${
                      language === lang
                        ? "bg-[#FACC15] text-black"
                        : "bg-[#292524] hover:bg-[#44403C]"
                    }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* ENCODE PANEL */}
          <div className="md:col-span-2 bg-[#1C1917] border border-[#44403C] p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-[#FACC15] tracking-widest">
              ENCODE TRANSMISSION
            </h2>

            <textarea
              placeholder={
                language === "hindi"
                  ? "मिशन संदेश दर्ज करें..."
                  : language === "marathi"
                  ? "मिशन संदेश प्रविष्ट करा..."
                  : "ENTER MISSION MESSAGE..."
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-32 p-4 mt-4 rounded-lg
              bg-[#0C0A09] border border-[#44403C]
              focus:outline-none focus:ring-2 focus:ring-[#FACC15]"
            />

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleEncode(text, false)}
                className="w-full py-2 bg-[#FACC15] text-black rounded-lg"
              >
                ENCODE & STORE
              </button>

              <button
                onClick={() => handleEncode(text, true)}
                className="w-full py-2 border border-[#FACC15]
                text-[#FACC15] rounded-lg"
              >
                ENCODE & TRANSMIT
              </button>
            </div>
          </div>
        </div>

        {message && (
          <div className="mt-6 p-4 text-center
          bg-[#292524] border border-[#FACC15]
          text-[#FACC15] rounded-lg">
            {message}
          </div>
        )}
      </div>

      {isShareModalOpen && (
        <ShareModal
          file={fileToShare}
          token={token}
          users={users}
          onClose={() => setShareModalOpen(false)}
        />
      )}
    </div>
  );
}
