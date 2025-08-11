import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <nav className="app-navigation">
      <div className="nav-logo">
        <i className="fas fa-book-dead"></i>
        <span className="nav-app-title">Grimoire Crafter</span>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <i className="fas fa-wand-magic-sparkles"></i>
            <span>Spell Cards</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/card-generator" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <i className="fas fa-id-card"></i>
            <span>Item Cards</span>
          </NavLink>
        </li>
      </ul>
      <div className="nav-user" ref={dropdownRef}>
        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="nav-user-button">
          <i className="fas fa-user-circle"></i>
        </button>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <NavLink to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
              <i className="fas fa-user"></i> Mi Perfil
            </NavLink>
            <NavLink to="/saved-cards" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
              <i className="fas fa-layer-group"></i> Mis Cartas Guardadas
            </NavLink>
            <NavLink to="/subscription" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
              <i className="fas fa-gem"></i> Mi Suscripción
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
