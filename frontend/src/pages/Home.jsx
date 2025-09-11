import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleGlobalClick = (e) => {
    // Don't redirect if clicking on a link or button
    if (e.target.closest('a') || e.target.closest('button')) {
      return;
    }
    navigate('/signup');
  };

  return (
    <div className="home-container" onClick={handleGlobalClick} style={{ cursor: 'pointer' }}>
      <div className="content-grid">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title animate-slideUp">Morse Code Encoder</h1>
            <p className="hero-text animate-slideUp animate-delay-1">Transform your text into Morse code instantly. Support for multiple Indian languages and easy file conversions.</p>
            <Link to="/signup" className="btn btn-primary animate-slideUp animate-delay-2">Get Started</Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stat-card primary hover-lift animate-fadeIn">
            <div className="stat-icon">
              <i className="material-icons">code</i>
            </div>
            <h3 className="stat-title">Total Encodings</h3>
            <div className="stat-value">89,400</div>
            <p className="stat-desc">21% more than last month</p>
          </div>
          
          <div className="stat-card secondary hover-lift animate-fadeIn animate-delay-1">
            <div className="stat-icon">
              <i className="material-icons">translate</i>
            </div>
            <h3 className="stat-title">Languages Used</h3>
            <div className="stat-value">10</div>
            <p className="stat-desc">Indian languages supported</p>
          </div>
          
          <div className="stat-card accent hover-lift animate-fadeIn animate-delay-2">
            <div className="stat-icon">
              <i className="material-icons">history</i>
            </div>
            <h3 className="stat-title">Recent Conversions</h3>
            <div className="stat-value">156</div>
            <p className="stat-desc">↗︎ Today's activities</p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions-grid">
          <Link to="/signup" className="action-card primary">
            <div className="action-content">
              <div className="action-header">
                <i className="material-icons">code</i>
                <h3>Quick Encode</h3>
              </div>
              <p>Convert text to Morse code instantly. Supports multiple languages and formats.</p>
              <div className="action-footer">
                <span>Start <i className="material-icons">arrow_forward</i></span>
              </div>
            </div>
          </Link>
          
          <Link to="/signup" className="action-card secondary">
            <div className="action-content">
              <div className="action-header">
                <i className="material-icons">translate</i>
                <h3>Quick Decode</h3>
              </div>
              <p>Convert Morse code back to text in your preferred language instantly.</p>
              <div className="action-footer">
                <span>Start <i className="material-icons">arrow_forward</i></span>
              </div>
            </div>
          </Link>
          
          <Link to="/history" className="action-card accent">
            <div className="action-content">
              <div className="action-header">
                <i className="material-icons">history</i>
                <h3>View History</h3>
              </div>
              <p>Access your previous conversions and export them in various formats.</p>
              <div className="action-footer">
                <span>View <i className="material-icons">arrow_forward</i></span>
              </div>
            </div>
          </Link>
        </section>

        {/* Recent Activities */}
        <section className="activities-section">
          <div className="card">
            <div className="card-header">
              <h2>Recent Activities</h2>
              <Link to="/history" className="btn btn-text">
                View All <i className="material-icons">chevron_right</i>
              </Link>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Language</th>
                    <th>Text</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="badge primary">
                        <i className="material-icons">code</i>
                        <span>Encode</span>
                      </div>
                    </td>
                    <td>
                      <div className="language-tag">
                        <div className="language-icon">HI</div>
                        <span>Hindi</span>
                      </div>
                    </td>
                    <td>नमस्ते</td>
                    <td>
                      <div className="time-tag">
                        <i className="material-icons">schedule</i>
                        <span>2 mins ago</span>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-icon hover-glow" title="Copy">
                          <i className="material-icons">content_copy</i>
                        </button>
                        <button className="btn btn-icon hover-glow" title="Convert Again">
                          <i className="material-icons">refresh</i>
                        </button>
                        <button className="btn btn-icon hover-glow" title="Download">
                          <i className="material-icons">download</i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="badge secondary">
                        <i className="material-icons">translate</i>
                        <span>Decode</span>
                      </div>
                    </td>
                    <td>
                      <div className="language-tag">
                        <div className="language-icon">EN</div>
                        <span>English</span>
                      </div>
                    </td>
                    <td>HELLO</td>
                    <td>
                      <div className="time-tag">
                        <i className="material-icons">schedule</i>
                        <span>5 mins ago</span>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-icon hover-glow" title="Copy">
                          <i className="material-icons">content_copy</i>
                        </button>
                        <button className="btn btn-icon hover-glow" title="Convert Again">
                          <i className="material-icons">refresh</i>
                        </button>
                        <button className="btn btn-icon hover-glow" title="Download">
                          <i className="material-icons">download</i>
                        </button>
          </div>
          </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

