import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000";

export default function SharedByMe({ token }) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const revokeAccess = async (fileId) => {
  try {
    const res = await fetch(`${API_BASE}/api/files/revoke/${fileId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.ok) {
      // Optionally remove the file from the local list to update UI
      setFiles((prev) => prev.filter((file) => file.id !== fileId));
    } else {
      setError(data.error || "FAILED TO REVOKE ACCESS");
    }
  } catch (error) {
    setError("SERVER ERROR: FAILED TO REVOKE ACCESS");
    console.error(error);
  }
};


  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/files/sent`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setFiles(data);
        } else {
          setError(data.error || "FAILED TO LOAD LOGS");
        }
      } catch {
        setError("SERVER COMMUNICATION ERROR");
      }
    };

    if (token) fetchFiles();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] flex flex-col justify-between">
      <div className="container mx-auto px-8 py-10">

        {/* HEADER / DESCRIPTION */}
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-3xl font-extrabold tracking-widest text-[#FACC15]">
            SHARED FILE LOGS
          </h1>
          <p className="mt-2 text-sm tracking-wide text-[#A8A29E] max-w-xl mx-auto">
            Track all the files you have shared with other users. You can revoke access at any time
            to ensure your files remain secure.
          </p>
        </div>

        {/* FILE LOGS */}
        <div className="bg-[#1C1917] border border-[#44403C] rounded-xl p-6 animate-slide-in-up">
          <h2 className="text-xl font-bold tracking-widest text-[#FACC15] mb-4">
            OUTBOUND FILES
          </h2>

          {error && (
            <p className="mb-4 text-sm font-bold tracking-wider text-red-400 animate-fade-in">
              ⚠ {error}
            </p>
          )}

          <div className="space-y-3">
            {files.length > 0 ? (
              files.map((file, index) => (
                <div
                  key={file.id}
                  className={`flex items-center justify-between bg-[#0C0A09] 
                             border border-[#44403C] p-4 rounded-md 
                             animate-slide-in-left`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div>
                    <p className="font-bold tracking-wide text-[#FACC15]">
                      {file.file_name}
                    </p>
                    <p className="text-xs tracking-widest text-[#A8A29E]">
                      TARGET: {file.recipient.toUpperCase()}
                    </p>
                  </div>

                  <button onClick={revokeAccess.bind(null, file.id)}
                    className="px-4 py-2 text-xs font-bold tracking-widest
                               bg-[#4a1e1e] text-[#ffb3b3]
                               rounded-md border border-[#7a2f2f]
                               hover:bg-[#6a2626] transition-transform hover:scale-[1.02]"
                  >
                    REVOKE ACCESS
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm tracking-widest text-[#A8A29E] animate-fade-in">
                NO FILES DEPLOYED YET
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-sm text-[#A8A29E] border-t border-[#44403C] animate-fade-in">
        © 2026 SecureMorse. All rights reserved. Manage your shared files securely and revoke access anytime.
      </footer>

      {/* Animations */}
      <style jsx>{`
        .animate-fade-in { animation: fadeIn 1s ease-in-out; }
        .animate-slide-in-left { animation: slideInLeft 0.8s ease-out forwards; }
        .animate-slide-in-up { animation: slideInUp 0.8s ease-out forwards; }

        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes slideInLeft {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
