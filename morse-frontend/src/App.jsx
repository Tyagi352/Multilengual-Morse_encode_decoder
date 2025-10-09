import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import HomePage from "./HomePage";
import AuthPage from "./AuthPage";

function ProtectedRoute({ token, children }) {
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage setToken={setToken} />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute token={token}>
            <Dashboard token={token} setToken={setToken} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}



// // You are helping me integrate AI-based output correction into my Morse Code Encoder and Decoder web app.

// My current setup:
// - Frontend: React + Tailwind CSS
// - Backend: python 
// - Functionality: Encode and decode Morse code text

// Goal:
// - After decoding Morse → text, send the decoded text to an AI (like OpenAI GPT) for improving output accuracy.
// - The AI should fix spelling mistakes, wrong word predictions, or incomplete phrases in the decoded message.
// - Return both the original and AI-corrected text to the frontend.

// Tasks:
// 1. Create a new utility file (aiHelper.js) that connects to OpenAI API.
// 2. Write a function that accepts decoded text and returns an improved version using gemini 2.5 pro. 
// 3. Modify my existing /decode route to call this function after decoding.
// 4. Update the frontend to display “Original Output” and “AI-Refined Output.”

// Make sure:
// - You use dotenv for storing the OpenAI API key.
// - Responses are trimmed and handled asynchronously.
// - The structure is clean and production-ready.
