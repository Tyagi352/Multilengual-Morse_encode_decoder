import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import logo from './assets/logo.png';

export default function Navbar({ setToken }) {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <nav className="bg-[#1C1917] border-b border-[#44403C] shadow-xl">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo + App Name */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-2xl font-bold tracking-wide text-[#FACC15] hover:text-[#EAB308] transition-colors"
        >
          <img className="h-[50px] w-auto animate-pulse" src={logo} alt="Morse Encoder Logo" />
          <span className="hidden sm:inline-block">Morse Encoder</span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Display logged in username */}
          {username && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg
            bg-[#292524] border border-[#44403C] text-[#FAFAF9] animate-fade-in">
              <User size={18} className="text-[#FACC15]" />
              <span className="text-sm text-[#FAFAF9] font-medium">{username}</span>
            </div>
          )}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg font-semibold
            bg-[#FACC15] text-black
            hover:bg-[#EAB308] hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:ring-offset-2 focus:ring-offset-[#1C1917]
            transition-all duration-300"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
}
