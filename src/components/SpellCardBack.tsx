import React from 'react';
import dndLogo from '../assets/dnd-logo.png';

const SpellCardBack: React.FC = () => {
  return (
    <div className="card-back">
      <img 
        src={dndLogo} 
        alt="D&D Logo" 
        className="logo"
      />
    </div>
  );
};

export default SpellCardBack;
