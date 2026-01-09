import React, { useState } from "react";

const API_BASE = "http://localhost:5000";

export default function DecodeFile({ token }) {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("english");
  const [decoded, setDecoded] = useState("");
  const [message, setMessage] = useState("");

  const languages = ["english", "hindi", "marathi", "french"];

  const decodeFile = async () => {
    if (!file) {
      setMessage("⚠️ NO FILE SELECTED");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

    try {
      const res = await fetch(`${API_BASE}/decode`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setDecoded(data.decoded_text);
        setMessage("✅ DECODE SUCCESSFUL");
      } else {
        setDecoded("");
        setMessage("❌ DECODING FAILED");
      }
    } catch {
      setMessage("🚨 SERVER ERROR");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f0c] text-[#e5e7eb] flex flex-col justify-between">

      <div className="container mx-auto px-8 py-10">

        {/* HEADER / DESCRIPTION */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl font-extrabold tracking-widest text-[#EAB308]">
            FILE DECODING TERMINAL
          </h1>
          <p className="mt-2 text-sm tracking-wide text-[#A8A29E] max-w-xl mx-auto animate-fade-in-delay">
            Upload an encrypted <span className="text-[#EAB308]">.enc</span> file 
            and decode it back to readable text. Ensure you select the correct 
            language protocol used during encoding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Sidebar - Language Panel */}
          <div className="md:col-span-1 bg-[#121812] border border-[#2f3a2f] p-6 rounded-lg h-fit animate-slide-in-left">
            <h2 className="text-lg font-bold tracking-widest text-[#EAB308] mb-4">
              LANGUAGE PANEL
            </h2>

            <div className="space-y-3">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`w-full py-2 rounded-md text-sm font-bold tracking-wider transition-all transform
                    ${
                      language === lang
                        ? "bg-[#EAB308] text-black scale-[1.03] shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                        : "bg-[#1a221a] hover:bg-[#273127] hover:scale-[1.01]"
                    }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Main Command Area */}
          <div className="md:col-span-2 space-y-8 animate-slide-in-right">

            {/* Upload & Decode */}
            <div className="bg-[#121812] border border-[#2f3a2f] p-6 rounded-lg shadow-lg hover:shadow-[#EAB308]/30 transition-shadow duration-300">
              <h2 className="text-lg font-bold tracking-widest text-[#EAB308] mb-4">
                DECODE COMMAND
              </h2>

              <input
                type="file"
                accept=".enc"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full p-2 rounded-md bg-[#0b0f0c] border border-[#EAB308]
                           text-[#e5e7eb]
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0
                           file:font-bold file:bg-[#EAB308] file:text-black
                           hover:file:bg-[#FACC15] transition-all"
              />

              <button
                onClick={decodeFile}
                className="mt-4 w-full py-2 bg-[#EAB308] text-black 
                           font-bold tracking-widest rounded-md
                           hover:bg-[#FACC15] hover:scale-[1.02]
                           transition-transform duration-200"
              >
                EXECUTE DECODE
              </button>

              <button>
                
              </button>
            </div>

            {/* Output */}
            {decoded && (
              <div className="bg-[#121812] border border-[#2f3a2f] p-6 rounded-lg shadow-inner animate-fade-in">
                <h2 className="text-lg font-bold tracking-widest text-[#EAB308] mb-2">
                  DECODED OUTPUT
                </h2>
                <textarea
                  readOnly
                  value={decoded}
                  className="w-full h-36 p-4 rounded-md bg-[#0b0f0c]
                             border border-[#2f3a2f]
                             text-[#e5e7eb] resize-none"
                />
              </div>
            )}

            {/* Status Message */}
            {message && (
              <div className="text-center font-bold tracking-widest text-sm text-[#EAB308] animate-pulse">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-sm text-[#A8A29E] border-t border-[#2f3a2f] animate-fade-in">
        © 2026 SecureMorse. All rights reserved. Decode your encrypted files safely and recover 
        messages with confidence.
      </footer>

      {/* Animations */}
      <style jsx>{`
        .animate-fade-in { animation: fadeIn 1s ease-in-out; }
        .animate-fade-in-delay { animation: fadeIn 1.5s ease-in-out; }
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
