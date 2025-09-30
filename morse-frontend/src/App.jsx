import React, { useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";

function ProtectedRoute({ token }) {
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <Routes>
      <Route path="/login" element={<LoginPage setToken={setToken} />} />
      <Route element={<ProtectedRoute token={token} />}>
        <Route path="/" element={<HomePage token={token} setToken={setToken} />} />
      </Route>
    </Routes>
  );
}