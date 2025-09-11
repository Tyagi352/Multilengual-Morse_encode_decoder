// src/components/Dashboard.jsx

import React from "react";

export default function Dashboard({ children }) {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Morse Code Encoder Dashboard</h1>
        <nav className="auth-nav">
          <a href="/login" className="nav-link">Login</a>
          <a href="/signup" className="nav-link">Signup</a>
        </nav>
      </header>
      <main className="dashboard-main">
        {children}
      </main>
      <footer className="dashboard-footer">
        &copy; 2025 Morse Encoder. All rights reserved.
      </footer>
    </div>
  );
}
