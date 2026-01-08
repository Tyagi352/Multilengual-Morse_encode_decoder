import React from "react";
import { NavLink } from "react-router-dom";
import { User } from "lucide-react";

export default function Sidebar() {
  const username = localStorage.getItem({User}); // get logged-in user's name

  const baseLink =
    "block px-4 py-2 rounded-lg text-base font-medium transition-all";

  const inactiveLink =
    "text-[#FAFAF9] hover:bg-[#292524] hover:pl-5";

  const activeLink =
    "bg-[#FACC15] text-black font-semibold shadow-md";

  return (
    <div className="w-64 h-screen bg-[#1C1917] border-r border-[#44403C] p-6 shadow-xl">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-10 text-[#FACC15] tracking-wide animate-fade-in">
        {username ? username : "Morse Encoder"}
      </h2>

      {/* Navigation */}
      <nav className="space-y-3">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/dashboard/encode"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          Encode
        </NavLink>

        <NavLink
          to="/dashboard/decode"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          Decode
        </NavLink>

        <NavLink
          to="/dashboard/sent"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          Sent Files
        </NavLink>

        <NavLink
          to="/dashboard/received"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          Received Files
        </NavLink>
      </nav>
    </div>
  );
}
