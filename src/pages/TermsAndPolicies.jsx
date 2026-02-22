import React, { useState } from 'react';

export default function TermsAndPolicies() {
  const [activeSection, setActiveSection] = useState('legal');

  return (
    <div className="terms-policies-page">
      <div className="terms-container">
        <div className="terms-sidebar">
          <h3>Navigate</h3>
          <ul className="sidebar-nav">
            <li 
              className={activeSection === 'legal' ? 'active' : ''}
              onClick={() => setActiveSection('legal')}
            >
              Legal
            </li>
            <li 
              className={activeSection === 'policies' ? 'active' : ''}
              onClick={() => setActiveSection('policies')}
            >
              Policies
            </li>
          </ul>
        </div>

        <div className="terms-content">
          <div className="terms-header">
            <h1>Terms & Policies</h1>
            <p className="last-updated">Last updated: February 20, 2026</p>
          </div>

          {activeSection === 'legal' && (
            <div className="content-section">
              <h2>Legal</h2>
              <ul className="terms-list">
                <li>
                  <strong>Terms of use:</strong> Terms that govern use of Verilia AI and our services for individuals.
                </li>
                <li>
                  <strong>Privacy policy:</strong> Practices with respect to personal information we collect from or about you.
                </li>
                <li>
                  <strong>Service terms:</strong> Additional terms that govern your use of specific services.
                </li>
                <li>
                  <strong>Data processing addendum:</strong> Ensuring that personal data is handled appropriately and securely.
                </li>
                <li>
                  <strong>User conduct guidelines:</strong> Information on our expectations for user behavior on the platform.
                </li>
                <li>
                  <strong>Intellectual property rights:</strong> Terms governing the creation of your content and usage in connection with Verilia AI Services.
                </li>
                <li>
                  <strong>Liability limitations:</strong> These terms govern any liability or damages relating to our services.
                </li>
                <li>
                  <strong>Governing law:</strong> Terms that govern use of Verilia AI services under Ugandan law.
                </li>
                <li>
                  <strong>Account termination:</strong> Terms that govern use of Verilia AI for account suspension or termination.
                </li>
                <li>
                  <strong>Dispute resolution:</strong> All disputes are subject to the jurisdiction of Ugandan courts.
                </li>
              </ul>
            </div>
          )}

          {activeSection === 'policies' && (
            <div className="content-section">
              <h2>Policies</h2>
              <ul className="terms-list">
                <li>
                  <strong>Usage policies:</strong> Ensuring our technology is used for good.
                </li>
                <li>
                  <strong>Content guidelines:</strong> Respecting our content and community guidelines.
                </li>
                <li>
                  <strong>AI safety practices:</strong> Ensuring responsible use of AI technology.
                </li>
                <li>
                  <strong>Enterprise privacy:</strong> Usage and retention of data submitted for enterprise users.
                </li>
                <li>
                  <strong>Data sharing policy:</strong> Our permitted sharing, publication, and research access.
                </li>
                <li>
                  <strong>Security practices:</strong> Definition of security measures in the context of finding and reporting vulnerabilities.
                </li>
                <li>
                  <strong>Cookie policy:</strong> Describes the kinds of cookies and similar technologies Verilia AI uses in connection with our Services, and how you can manage them.
                </li>
                <li>
                  <strong>Children's safety:</strong> Supplemental notice that explains additional privacy practices when you use features in Verilia AI.
                </li>
                <li>
                  <strong>Uganda compliance:</strong> Information about how we comply with the Data Protection and Privacy Act, 2019 of Uganda.
                </li>
                <li>
                  <strong>Accessibility:</strong> Our commitment to making our services accessible to all users.
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .terms-policies-page {
          min-height: 100vh;
          padding: 2rem 1rem;
        }

        body.organic .terms-policies-page {
          background: var(--organic-bg-primary);
          color: var(--organic-text);
        }

        body.brutalist .terms-policies-page {
          background: var(--brutalist-bg);
          color: var(--brutalist-text);
        }

        .terms-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 3rem;
          min-height: 80vh;
        }

        .terms-sidebar {
          position: sticky;
          top: 2rem;
          height: fit-content;
        }

        body.organic .terms-sidebar {
          background: var(--organic-card-bg);
          border: 1px solid var(--organic-border);
        }

        body.brutalist .terms-sidebar {
          background: var(--brutalist-bg);
          border: 3px solid var(--brutalist-text);
        }

        .terms-sidebar {
          padding: 2rem;
          border-radius: 12px;
        }

        .terms-sidebar h3 {
          margin: 0 0 1.5rem 0;
          font-size: 1.2rem;
          font-weight: 600;
        }

        body.organic .terms-sidebar h3 {
          color: var(--organic-accent);
        }

        body.brutalist .terms-sidebar h3 {
          color: var(--brutalist-text);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.4rem;
        }

        .sidebar-nav {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sidebar-nav li {
          padding: 0.8rem 0;
          cursor: pointer;
          border-radius: 6px;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        body.organic .sidebar-nav li {
          color: var(--organic-text-muted);
        }

        body.organic .sidebar-nav li:hover {
          background: rgba(74, 222, 128, 0.1);
          color: var(--organic-accent);
        }

        body.organic .sidebar-nav li.active {
          background: rgba(74, 222, 128, 0.15);
          color: var(--organic-accent);
          border-left: 3px solid var(--organic-accent);
          padding-left: 1rem;
        }

        body.brutalist .sidebar-nav li {
          color: var(--brutalist-text);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.1rem;
        }

        body.brutalist .sidebar-nav li:hover {
          background: var(--brutalist-text);
          color: var(--brutalist-bg);
        }

        body.brutalist .sidebar-nav li.active {
          background: var(--brutalist-text);
          color: var(--brutalist-bg);
          font-weight: bold;
        }

        .terms-content {
          padding: 0 2rem;
        }

        .terms-header {
          margin-bottom: 3rem;
          text-align: center;
        }

        .terms-header h1 {
          font-size: 3rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          font-family: 'Crimson Pro', serif;
        }

        body.organic .terms-header h1 {
          color: var(--organic-accent);
        }

        body.brutalist .terms-header h1 {
          color: var(--brutalist-text);
          font-family: 'Archivo Black', sans-serif;
        }

        .last-updated {
          margin: 0;
          opacity: 0.7;
          font-size: 1rem;
        }

        .content-section h2 {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 2rem;
          font-family: 'Crimson Pro', serif;
        }

        body.organic .content-section h2 {
          color: var(--organic-text);
        }

        body.brutalist .content-section h2 {
          color: var(--brutalist-text);
          font-family: 'Archivo Black', sans-serif;
        }

        .terms-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 1.5rem;
        }

        .terms-list li {
          padding: 1.5rem;
          border-radius: 8px;
          line-height: 1.6;
          transition: all 0.3s ease;
        }

        body.organic .terms-list li {
          background: var(--organic-card-bg);
          border: 1px solid var(--organic-border);
        }

        body.organic .terms-list li:hover {
          background: rgba(74, 222, 128, 0.12);
          border-color: var(--organic-accent);
        }

        body.brutalist .terms-list li {
          background: var(--brutalist-bg);
          border: 2px solid var(--brutalist-text);
          border-radius: 0;
        }

        body.brutalist .terms-list li:hover {
          background: rgba(255, 107, 157, 0.1);
        }

        .terms-list li strong {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        body.organic .terms-list li strong {
          color: var(--organic-accent-soft);
        }

        body.brutalist .terms-list li strong {
          color: var(--brutalist-accent);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .terms-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .terms-sidebar {
            position: relative;
            top: 0;
          }

          .sidebar-nav {
            display: flex;
            gap: 1rem;
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }

          .sidebar-nav li {
            white-space: nowrap;
            min-width: fit-content;
            margin-bottom: 0;
            padding: 0.8rem 1.2rem;
          }

          .terms-header h1 {
            font-size: 2.5rem;
          }

          .terms-content {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}