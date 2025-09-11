import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { motion } from "framer-motion";

export default function FileEncoder({ selectedLang = "en" }) {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("encode");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const text = await file.text();
    try {
      const endpoint = mode === "encode" ? "/encode" : "/decode";
      const { data } = await axios.post(`http://localhost:5000${endpoint}`, { text, lang: selectedLang });
      setResult(data.result);
    } catch (err) {
      setResult("Error processing file.");
    }
    setLoading(false);
  };

  const handleDownload = (type) => {
    if (!result) return;
    if (type === "txt") {
      const blob = new Blob([result], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = mode === "encode" ? "encoded.txt" : "decoded.txt";
      link.click();
    } else if (type === "pdf") {
      const doc = new jsPDF();
      doc.text(result, 10, 10);
      doc.save(mode === "encode" ? "encoded.pdf" : "decoded.pdf");
    }
  };

  return (
    <div className="encoder-container">
      <div className="card">
        <div className="card-content">
          <h2 className="card-title">Encode/Decode Text File to Morse</h2>
          
          <div className="tab-group">
            <button 
              className={`tab ${mode === "encode" ? "active" : ""}`}
              onClick={() => setMode("encode")}
            >
              Encode
            </button>
            <button 
              className={`tab ${mode === "decode" ? "active" : ""}`}
              onClick={() => setMode("decode")}
            >
              Decode
            </button>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label className="label">Select Text File</label>
              <input 
                type="file" 
                accept=".txt" 
                onChange={handleFileChange} 
                className="file-input" 
              />
            </div>

            <button 
              type="submit" 
              className={`btn btn-primary full-width ${loading ? "loading" : ""}`}
              disabled={loading || !file}
            >
              {loading ? "Processing..." : "Submit"}
            </button>
          </form>

          {result && (
            <motion.div
              className="result-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="form-group">
                <label className="label">Output</label>
                <div className="code-block">
                  <pre>{result}</pre>
                </div>
              </div>

              <div className="button-group">
                <button 
                  onClick={() => handleDownload("txt")} 
                  className="btn btn-outline"
                >
                  <i className="material-icons">download</i>
                  Download TXT
                </button>
                <button 
                  onClick={() => handleDownload("pdf")} 
                  className="btn btn-outline"
                >
                  <i className="material-icons">picture_as_pdf</i>
                  Download PDF
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
