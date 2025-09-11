
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import History from "./pages/History";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FileEncoder from "./components/FileEncoder";

function App() {
  return (
    <Router>
      <div className="app-container">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="app-content">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/encoder" element={<FileEncoder />} />
              <Route path="/history" element={<History />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>
        </div>
        <Sidebar />
      </div>
    </Router>
  );
}

export default App;
