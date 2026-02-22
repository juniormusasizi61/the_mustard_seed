import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
   const [menuOpen, setMenuOpen] = useState(false);

   const closeMenu = () => setMenuOpen(false);

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
            <>
               {/* Overlay to close menu when tapping outside */}
               <div 
                  className="navbar-overlay" 
                  onClick={closeMenu}
                  aria-hidden="true"
               />
               <ul className="navbar-mobile-menu">
                  <li><NavLink to="/" onClick={closeMenu}>Chat</NavLink></li>
                  <li><NavLink to="/read-bible" onClick={closeMenu}>Read Bible</NavLink></li>
                  <li><NavLink to="/saved" onClick={closeMenu}>Saved</NavLink></li>
                  <li><NavLink to="/profile" onClick={closeMenu}>Profile</NavLink></li>
               </ul>
            </>
         )}
      </nav>
   );
}