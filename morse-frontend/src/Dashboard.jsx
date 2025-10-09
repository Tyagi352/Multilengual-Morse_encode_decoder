import React, { useState } from "react";
import Navbar from "./Navbar";
import ShareModal from "./components/ShareModal";

const API_BASE = "http://localhost:5000";

export default function Dashboard({ token, setToken }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [decoded, setDecoded] = useState("");
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("english");
  const [fileToEncode, setFileToEncode] = useState(null);

  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [fileToShare, setFileToShare] = useState(null);
  const [shareSubject, setShareSubject] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  const languages = ["english", "hindi", "marathi", "french"];

  const languageSets = {
    english: /^[A-Za-z0-9\s.,!?]*$/,
    hindi: /^[\u0900-\u097F\s0-9।,!?]*$/,
    marathi: /^[\u0900-\u097F\s0-9।,!?]*$/,
    french: /^[\u0000-\uFFFF]*$/,
  };

  const validateText = (inputText) => {
    const normalized = inputText.normalize("NFC");
    const regex = languageSets[language];
    return regex.test(normalized);
  };

  const handleEncode = async (content, andShare = false) => {
    if (!token) { setMessage("Please login"); return; }
    if (!content) { setMessage("Please enter text or select a file"); return; }
    if (!validateText(content)) { setMessage(`Invalid characters for ${language}`); return; }

    try {
      const res = await fetch(`${API_BASE}/encode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ text: content, language }),
      });

      if (res.ok) {
        const blob = await res.blob();
        if (andShare) {
          const file = new File([blob], "morse.enc", { type: "application/octet-stream" });
          openShareModal(file, "Encoded Morse File", "Please find the attached encoded file.");
        } else {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "morse.enc";
          a.click();
          window.URL.revokeObjectURL(url);
          setMessage("Text encoded & downloaded!");
        }
      } else {
        const data = await res.json();
        setMessage(data.error || "Encoding failed");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  const encodeText = (andShare = false) => handleEncode(text, andShare);

  const encodeTextFile = async (andShare = false) => {
    if (!fileToEncode) return;
    const fileContent = await fileToEncode.text();
    handleEncode(fileContent, andShare);
  };

  const decodeFile = async () => {
    if (!file) return;
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
        setMessage("File decoded successfully!");
      } else {
        setDecoded("");
        setMessage(data.error || "Decoding failed");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  const openShareModal = (file, subject, message) => {
    setFileToShare(file);
    setShareSubject(subject);
    setShareMessage(message);
    setShareModalOpen(true);
  }

  const shareDecodedText = () => {
    const blob = new Blob([decoded], { type: 'text/plain' });
    const file = new File([blob], "decoded.txt", { type: "text/plain" });
    openShareModal(file, "Decoded Text", "Please find the attached decoded text file.");
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar setToken={setToken} />
      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-gray-100 p-6 rounded-lg shadow-lg h-fit">
            <h2 className="text-2xl font-bold mb-4">Languages</h2>
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`w-full px-4 py-2 rounded-lg transition-colors ${
                    language === lang
                      ? "bg-black text-white font-bold"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Encode Text</h2>
              <textarea
                placeholder="Enter text to encode..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-4 rounded-lg bg-white border border-black focus:outline-none focus:ring-2 focus:ring-black h-32 resize-none"
              />
              <div className="flex space-x-4 mt-4">
                <button
                    onClick={() => encodeText(false)}
                    className="w-full px-4 py-2 font-bold text-white bg-black rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                    Encode & Download
                </button>
                <button
                    onClick={() => encodeText(true)}
                    className="w-full px-4 py-2 font-bold text-black bg-gray-300 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    Encode & Share
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Encode File</h2>
                <input
                  type="file"
                  accept=".txt"
                  onChange={(e) => setFileToEncode(e.target.files[0])}
                  className="w-full p-2 rounded-lg bg-white text-black border border-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                />
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => encodeTextFile(false)}
                    className="w-full px-4 py-2 font-bold text-white bg-black rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    Encode & Download
                  </button>
                  <button
                    onClick={() => encodeTextFile(true)}
                    className="w-full px-4 py-2 font-bold text-black bg-gray-300 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Encode & Share
                  </button>
                </div>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Decode File</h2>
                <input
                  type="file"
                  accept=".enc"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full p-2 rounded-lg bg-white text-black border border-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                />
                <button
                  onClick={decodeFile}
                  className="mt-4 w-full px-4 py-2 font-bold text-white bg-black rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Decode
                </button>
              </div>
            </div>

            {decoded && (
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Decoded Text</h2>
                    <button
                        onClick={shareDecodedText}
                        className="px-4 py-2 font-bold text-black bg-gray-300 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Share Decoded Text
                    </button>
                </div>
                <textarea
                  readOnly
                  value={decoded}
                  className="w-full p-4 rounded-lg bg-white border border-black h-32 resize-none"
                />
              </div>
            )}

            {message && (
              <div className="mt-4 p-4 bg-gray-200 rounded-lg text-black text-center">
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
          onClose={() => setShareModalOpen(false)}
          subject={shareSubject}
          message_body={shareMessage}
        />
      )}
    </div>
  );
}