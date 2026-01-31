import {NavLink} from 'react-router-dom';
import './Navbar.css';  

export default function Navbar() {
   return ( 
      <nav className="navbar">
      <div className="navbar-logo">Mustard seed Bible AI</div>

      <ul className="navbar-links">
         <li>
            <NavLink to="/">Chat</NavLink>
         </li>
         <li>
            <NavLink to="/read-bible">Read Bible</NavLink>
         </li>
         <li>
            <NavLink to="/saved">Saved</NavLink>
         </li>
         <li>
            <NavLink to="/profile">Profile</NavLink>
         </li>
      </ul>
      </nav>
   );
}