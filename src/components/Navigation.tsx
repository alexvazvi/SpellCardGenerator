import React from 'react';
import './Navigation.css';

const Navigation: React.FC = () => {
  return (
    <nav className="app-navigation">
      <div className="nav-logo">
        <i className="fas fa-book-dead"></i>
      </div>
      <ul className="nav-links">
        <li>
          <a href="/" className="nav-link active">
            <i className="fas fa-wand-magic-sparkles"></i>
            <span>Spell Cards</span>
          </a>
        </li>
        <li>
          <a href="/card-generator" className="nav-link">
            <i className="fas fa-id-card"></i>
            <span>Item Cards</span>
          </a>
        </li>
      </ul>
      <div className="nav-user">
        <i className="fas fa-user-circle"></i>
      </div>
    </nav>
  );
};

export default Navigation;
