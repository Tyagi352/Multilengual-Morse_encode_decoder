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
    if (!content) return setMessage("NO TRANSMISSION DATA DETECTED");

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
      } else setMessage("ENCODING FAILED");
    } catch {
      setMessage("SERVER COMMUNICATION ERROR");
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9]">

      {/* MISSION HEADER */}
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
          <div className="bg-[#1C1917] border border-[#44403C] p-6 rounded-xl
                          shadow-lg hover:shadow-[#FACC15]/20 transition">
            <h2 className="text-lg font-bold mb-2 text-[#FACC15] tracking-widest">
              LANGUAGE PROTOCOL
            </h2>
            <p className="text-xs text-[#9CA3AF] mb-4">
              Select transmission language for encoding
            </p>

            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`w-full px-4 py-2 rounded-lg transition-all
                    ${
                      language === lang
                        ? "bg-[#FACC15] text-black scale-[1.02]"
                        : "bg-[#292524] hover:bg-[#44403C] text-[#FAFAF9]"
                    }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* ENCODE PANEL */}
          <div className="md:col-span-2 bg-[#1C1917] border border-[#44403C]
                          p-6 rounded-xl shadow-lg relative overflow-hidden">

            {/* subtle animated scan line */}
            <div className="absolute inset-0 bg-gradient-to-r
                            from-transparent via-[#FACC15]/5 to-transparent
                            animate-pulse pointer-events-none" />

            <h2 className="text-2xl font-bold mb-1 text-[#FACC15] tracking-widest">
              ENCODE TRANSMISSION
            </h2>
            <p className="text-sm text-[#9CA3AF] mb-4">
              Convert plaintext into encrypted Morse signal (.enc)
            </p>

            <textarea
              placeholder="ENTER MISSION MESSAGE..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-32 p-4 rounded-lg bg-[#0C0A09]
              border border-[#44403C] text-[#FAFAF9]
              focus:outline-none focus:ring-2 focus:ring-[#FACC15]"
            />

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleEncode(text, false)}
                className="w-full py-2 rounded-lg font-semibold
                bg-[#FACC15] text-black hover:bg-[#EAB308]
                transition transform hover:scale-[1.02]"
              >
                ENCODE & STORE
              </button>

              <button
                onClick={() => handleEncode(text, true)}
                className="w-full py-2 rounded-lg font-semibold
                bg-[#292524] border border-[#FACC15] text-[#FACC15]
                hover:bg-[#44403C] transition transform hover:scale-[1.02]"
              >
                ENCODE & TRANSMIT
              </button>
            </div>
            
          </div>
        </div>

        <br />
<br />
<br />
<br />
<br />

         <footer className="bg-[#0C0A09] gap-[30px] border-t border-[#292524] text-[#A8A29E]">
      <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* LEFT — BRAND */}
        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold tracking-widest text-[#FACC15]">
            MORSE ENCODER
          </h3>
          <p className="text-xs tracking-wider">
            Secure Communication Command System
          </p>
        </div>

        {/* CENTER — STATUS */}
        <div className="flex items-center gap-2 text-xs tracking-widest">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-green-400">
            SYSTEM OPERATIONAL
          </span>
        </div>

        {/* RIGHT — META */}
        <div className="text-xs tracking-wider text-center md:text-right">
          <p>© {new Date().getFullYear()} Arnav Tyagi</p>
          <p className="text-[#78716C]">
            Authorized Access Only
          </p>
        </div>

      </div>
<br />
      {/* BOTTOM STRIP */}
      <div className="text-center text-[10px] tracking-widest text-[#57534E]
                      border-t border-[#1C1917] py-2">
        ENCRYPT • TRANSMIT • DECODE
      </div>
    </footer>

        {message && (
          <div className="mt-6 p-4 rounded-lg text-center
          bg-[#292524] border border-[#FACC15] text-[#FACC15]
          animate-fade-in">
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
