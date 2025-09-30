import React, { useState } from "react";

const API_BASE = "http://localhost:5000";

export default function HomePage({ token, setToken }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [decoded, setDecoded] = useState("");
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("english");
  const [fileToEncode, setFileToEncode] = useState(null);

  const languages = ["english", "hindi", "marathi", "french"];

  // Unicode validation regex
  const languageSets = {
    english: /^[A-Za-z0-9\s.,!?]*$/,
    hindi: /^[\u0900-\u097F\s0-9।,!?]*$/,  // Devanagari
    marathi: /^[\u0900-\u097F\s0-9।,!?]*$/, // Devanagari
    french: /^[\u0000-\uFFFF]*$/           // all unicode
  };

  const validateText = (inputText) => {
    const normalized = inputText.normalize("NFC");
    const regex = languageSets[language];
    return regex.test(normalized);
  };

  const logout = () => { 
    localStorage.removeItem("token"); 
    setToken(""); 
    setMessage("Logged out"); 
  };

  const encodeText = async () => {
    if (!token) { setMessage("Please login"); return; }
    if (!text) { setMessage("Please enter text"); return; }
    if (!validateText(text)) { setMessage(`Invalid characters for ${language}`); return; }

    try {
      const res = await fetch(`${API_BASE}/encode`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ text, language })
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "morse.enc";
        a.click();
        setMessage("Text encoded & downloaded!");
      } else {
        const data = await res.json();
        setMessage(data.error || "Encoding failed");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  const encodeTextFile = async () => {
    if (!fileToEncode) return;
    const fileContent = await fileToEncode.text();
    if (!validateText(fileContent)) { setMessage("Invalid characters in file"); return; }

    try {
      const res = await fetch(`${API_BASE}/encode`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ text: fileContent, language })
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "morse.enc";
        a.click();
        setMessage("File encoded & downloaded!");
      } else {
        const data = await res.json();
        setMessage(data.error || "Encoding failed");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  const decodeFile = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

    try {
      const res = await fetch(`${API_BASE}/decode`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
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

  return (
    <div className="min-h-screen flex bg-gray-900 text-white p-6">
      <div className="w-64 bg-gray-800 p-4 rounded space-y-4">
        <h2 className="font-bold">Select Language</h2>
        {languages.map(lang => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`w-full px-3 py-1 rounded ${language===lang ? "bg-purple-600" : "bg-gray-700"}`}
          >
            {lang}
          </button>
        ))}
      </div>

      <div className="flex-1 ml-6 space-y-4">
        {/* Logout */}
        <div className="space-y-2 p-4 bg-gray-800 rounded flex items-center justify-between">
          <span>Logged in</span>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Encode Text */}
        <div className="space-y-2 p-4 bg-gray-800 rounded">
          <h2 className="text-lg font-bold">Encode Text</h2>
          <textarea
            placeholder="Enter text to encode"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white h-24 resize-none"
          />
          <button
            onClick={encodeText}
            className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
          >
            Encode & Download
          </button>
        </div>

        {/* Encode File */}
        <div className="space-y-2 p-4 bg-gray-800 rounded">
          <h2 className="text-lg font-bold">Encode File</h2>
          <input
            type="file"
            accept=".txt"
            onChange={(e) => setFileToEncode(e.target.files[0])}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          <button
            onClick={encodeTextFile}
            className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
          >
            Encode File & Download
          </button>
        </div>

        {/* Decode File */}
        <div className="space-y-2 p-4 bg-gray-800 rounded">
          <h2 className="text-lg font-bold">Decode File</h2>
          <input
            type="file"
            accept=".enc"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          <button
            onClick={decodeFile}
            className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
          >
            Decode
          </button>
          {decoded && (
            <textarea
              readOnly
              value={decoded}
              className="w-full p-2 rounded bg-gray-700 text-white h-24 resize-none mt-2"
            />
          )}
        </div>

        {message && (
          <div className="p-2 bg-gray-700 rounded text-yellow-400">{message}</div>
        )}
      </div>
    </div>
  );
}
