import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <NavLink to="/privacy-policy" className="footer-link">Privacy Policy</NavLink>
        <span className="footer-divider">•</span>
        <NavLink to="/terms-of-service" className="footer-link">Terms of Service</NavLink>
        <span className="footer-divider">•</span>
        <NavLink to="/terms-policies" className="footer-link">Legal</NavLink>
      </div>
      
      <style jsx>{`
        .app-footer {
          padding: 2rem 1rem;
          text-align: center;
          margin-top: 3rem;
          border-top: 1px solid;
        }

        body.organic .app-footer {
          border-top-color: var(--organic-border);
          background: var(--organic-bg-primary);
        }

        body.brutalist .app-footer {
          border-top-color: var(--brutalist-text);
          border-top-width: 2px;
          background: var(--brutalist-bg);
        }

        .footer-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .footer-link {
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        body.organic .footer-link {
          color: var(--organic-text-muted);
        }

        body.organic .footer-link:hover {
          color: var(--organic-accent);
        }

        body.brutalist .footer-link {
          color: var(--brutalist-text);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.1rem;
        }

        body.brutalist .footer-link:hover {
          color: var(--brutalist-accent);
        }

        .footer-divider {
          opacity: 0.5;
        }

        body.organic .footer-divider {
          color: var(--organic-text-muted);
        }

        body.brutalist .footer-divider {
          color: var(--brutalist-text);
        }

        @media (max-width: 768px) {
          .app-footer {
            padding: 1.5rem 1rem;
          }

          .footer-content {
            gap: 0.5rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </footer>
  );
}
