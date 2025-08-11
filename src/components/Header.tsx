import React from 'react';

interface HeaderProps {
  toggleDarkMode: () => void;
  darkMode: boolean;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExportPDF: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleDarkMode, darkMode, onImport, onExportPDF }) => {
  const importInputRef = React.useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  return (
    <header className="app-header">
      <h1 className="app-title">Grimorio de Hechizos</h1>
      <p className="app-subtitle">Forja tus propias cartas de conjuros para D&D 5e</p>
      
      <div className="actions-toolbar">
        <input
          type="file"
          ref={importInputRef}
          onChange={onImport}
          style={{ display: 'none' }}
          accept=".json"
        />
        <ActionButton onClick={handleImportClick} icon="fa-file-import" title="Importar desde JSON" />
        <ActionButton onClick={onExportPDF} icon="fa-file-pdf" title="Exportar a PDF" />
        <ActionButton 
          onClick={toggleDarkMode} 
          icon={darkMode ? 'fa-sun' : 'fa-moon'} 
          title={darkMode ? 'Modo Claro' : 'Modo Oscuro'} 
        />
      </div>
    </header>
  );
};

// Sub-component for a consistent button style
const ActionButton: React.FC<{onClick: () => void, icon: string, title: string}> = ({ onClick, icon, title }) => {
  return (
    <button className="action-button" onClick={onClick} title={title}>
      <i className={`fas ${icon}`}></i>
    </button>
  );
}

export default Header;
