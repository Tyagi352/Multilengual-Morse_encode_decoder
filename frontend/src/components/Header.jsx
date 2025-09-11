import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="nav">
      <div className="container">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button className="btn btn-icon menu-button">
              <i className="material-icons">menu</i>
            </button>
            <nav className="breadcrumb">
              <ul>
                <li><Link to="/" className="nav-link">Home</Link></li>
                <li className="nav-link">Dashboard</li>
              </ul>
            </nav>
          </div>
          
          <div className="mobile-title">
            <h1>Morse Code</h1>
          </div>
          
          <div className="flex items-center">
            <button className="btn btn-icon notification-btn">
              <i className="material-icons">notifications</i>
              <span className="badge badge-primary notification-badge">1</span>
            </button>
            
            <div className="user-dropdown">
              <button className="btn btn-icon avatar-btn">
                <div className="avatar">
                  <span>MU</span>
                </div>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/profile" className="dropdown-item">
                    Profile
                    <span className="badge badge-primary">New</span>
                  </Link>
                </li>
                <li><Link to="/settings" className="dropdown-item">Settings</Link></li>
                <li><button className="dropdown-item">Logout</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
