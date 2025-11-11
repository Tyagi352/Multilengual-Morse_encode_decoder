import React, { useState, useEffect } from "react";
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
  
  const [users, setUsers] = useState([]);
  const [sentFiles, setSentFiles] = useState([]);
  const [receivedFiles, setReceivedFiles] = useState([]);

  const languages = ["english", "hindi", "marathi", "french"];

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchSentFiles();
      fetchReceivedFiles();
    }
  }, [token]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const fetchSentFiles = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/files/sent`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSentFiles(data);
      }
    } catch (err) {
      console.error("Failed to fetch sent files", err);
    }
  };

  const fetchReceivedFiles = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/files/received`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setReceivedFiles(data);
      }
    } catch (err) {
      console.error("Failed to fetch received files", err);
    }
  };

  const handleEncode = async (content, andShare = false) => {
    if (!token) { setMessage("Please login"); return; }
    if (!content) { setMessage("Please enter text or select a file"); return; }

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
          openShareModal(file);
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
  
  const downloadFile = async (fileId, fileName) => {
    try {
        const res = await fetch(`${API_BASE}/api/files/download/${fileId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } else {
            const data = await res.json();
            setMessage(data.error || 'File download failed');
        }
    } catch (err) {
        setMessage('Server error during file download.');
    }
};


  const openShareModal = (file) => {
    setFileToShare(file);
    setShareModalOpen(true);
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
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={decodeFile}
                    className="w-full px-4 py-2 font-bold text-white bg-black rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    Decode
                  </button>
                  <button
                    onClick={() => openShareModal(file)}
                    disabled={!file}
                    className="w-full px-4 py-2 font-bold text-black bg-gray-300 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Share .enc File
                  </button>
                </div>
              </div>
            </div>

            {decoded && (
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold">Decoded Text</h2>
                <textarea
                  readOnly
                  value={decoded}
                  className="w-full p-4 rounded-lg bg-white border border-black h-32 resize-none"
                />
              </div>
            )}

            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Received Files</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">From</th>
                                <th className="py-2 px-4 border-b">File Name</th>
                                <th className="py-2 px-4 border-b">Date</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receivedFiles.map(f => (
                                <tr key={f.id}>
                                    <td className="py-2 px-4 border-b">{f.sender}</td>
                                    <td className="py-2 px-4 border-b">{f.file_name}</td>
                                    <td className="py-2 px-4 border-b">{new Date(f.shared_at).toLocaleString()}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button onClick={() => downloadFile(f.id, f.file_name)} className="px-3 py-1 font-bold text-white bg-black rounded-lg hover:bg-gray-800">Download</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Sent Files</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">To</th>
                                <th className="py-2 px-4 border-b">File Name</th>
                                <th className="py-2 px-4 border-b">Date</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sentFiles.map(f => (
                                <tr key={f.id}>
                                    <td className="py-2 px-4 border-b">{f.recipient}</td>
                                    <td className="py-2 px-4 border-b">{f.file_name}</td>
                                    <td className="py-2 px-4 border-b">{new Date(f.shared_at).toLocaleString()}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button onClick={() => downloadFile(f.id, f.file_name)} className="px-3 py-1 font-bold text-white bg-black rounded-lg hover:bg-gray-800">Download</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

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
          users={users}
          onClose={() => {
            setShareModalOpen(false);
            fetchSentFiles(); // Refresh sent files after sharing
          }}
        />
      )}
    </div>
  );
}