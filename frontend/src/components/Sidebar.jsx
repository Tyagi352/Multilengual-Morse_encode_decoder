import React from "react";
import { Link, useLocation } from "react-router-dom";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "gu", name: "Gujarati" },
  { code: "mr", name: "Marathi" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "bn", name: "Bengali" },
  { code: "kn", name: "Kannada" },
  { code: "ml", name: "Malayalam" },
  { code: "pa", name: "Punjabi" },
];

export default function Sidebar({ selectedLang, setSelectedLang }) {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "dashboard" },
    { path: "/encoder", label: "Morse Encoder", icon: "code" },
    { path: "/history", label: "History", icon: "history" },
    { path: "/about", label: "About", icon: "info" }
  ];

  return (
    <div className="drawer-side z-40">
      <label htmlFor="my-drawer" className="drawer-overlay"></label>
      <aside className="menu bg-base-200 w-80 min-h-screen p-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="avatar placeholder">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
              <span className="text-xl">M</span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">Morse Code</h2>
            <p className="text-sm opacity-70">Encoder & Decoder</p>
          </div>
        </div>

        <ul className="menu rounded-box">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? "active" : ""}
              >
                <i className="material-icons">{item.icon}</i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="divider">Languages</div>

        <div className="collapse collapse-arrow bg-base-200">
          <input type="checkbox" /> 
          <div className="collapse-title text-xl font-medium">
            Selected: {languages.find(l => l.code === selectedLang)?.name || 'English'}
          </div>
          <div className="collapse-content"> 
            <ul className="menu bg-base-100 rounded-box">
              {languages.map(lang => (
                <li key={lang.code}>
                  <a
                    className={selectedLang === lang.code ? "active" : ""}
                    onClick={() => setSelectedLang(lang.code)}
                  >
                    {lang.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider">Settings</div>

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Dark Mode</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              onChange={(e) => {
                document.documentElement.setAttribute(
                  "data-theme",
                  e.target.checked ? "dark" : "light"
                );
              }}
            />
          </label>
        </div>

        <div className="mt-auto pt-4">
          <div className="dropdown dropdown-top w-full">
            <label tabIndex={0} className="btn btn-ghost btn-block justify-between">
              <div className="flex items-center gap-2">
                <div className="avatar placeholder">
                  <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                    <span>U</span>
                  </div>
                </div>
                <span>User</span>
              </div>
              <i className="material-icons">expand_more</i>
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52">
              <li><a>Profile</a></li>
              <li><a>Settings</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
