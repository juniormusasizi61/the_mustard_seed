import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
   const [menuOpen, setMenuOpen] = useState(false);
   const location = useLocation();

   // Close menu on route change
   useEffect(() => { setMenuOpen(false); }, [location]);

   return (
      <nav className="navbar">
         <div className="navbar-logo">Verilia AI</div>

         {/* Desktop links */}
         <ul className="navbar-links">
            <li><NavLink to="/">Chat</NavLink></li>
            <li><NavLink to="/read-bible">Read Bible</NavLink></li>
            <li><NavLink to="/saved">Saved</NavLink></li>
            <li><NavLink to="/profile">Profile</NavLink></li>
         </ul>

         {/* Hamburger button – mobile only */}
         <button
            className="hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
         >
            <span /><span /><span />
         </button>

         {/* Mobile dropdown */}
         {menuOpen && (
            <ul className="navbar-mobile-menu">
               <li><NavLink to="/">Chat</NavLink></li>
               <li><NavLink to="/read-bible">Read Bible</NavLink></li>
               <li><NavLink to="/saved">Saved</NavLink></li>
               <li><NavLink to="/profile">Profile</NavLink></li>
            </ul>
         )}
      </nav>
   );
}