import React, { useState } from 'react';

interface JsonImportProps {
  onImport: (jsonString: string) => void;
}

const JsonImport: React.FC<JsonImportProps> = ({ onImport }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Copiar Ejemplo');

  const handleImportClick = () => {
    if (jsonInput.trim() === '') {
      alert('Por favor, pega el texto JSON en el cuadro de texto.');
      return;
    }
    onImport(jsonInput);
    setJsonInput(''); // Limpiar el cuadro de texto después de importar
  };

  // Detailed placeholder text
  const placeholderText = `[
  {
    "name": "Proyectil Mágico",
    "level": "1",
    "school": "Evocación",
    "castingTime": "1 acción",
    "range": "120 pies",
    "components": "V, S",
    "duration": "Instantánea",
    "description": "Creas tres dardos de fuerza mágica..."
  },
  {
    "name": "Armadura de Mago",
    "level": "1",
    "school": "Abjuración",
    "castingTime": "1 acción",
    "range": "Toque",
    "components": "V, S, M (un trozo de cuero curado)",
    "duration": "8 horas",
    "description": "Tocas a una criatura voluntaria que no lleva armadura..."
  }
]`;

  const handleCopyClick = () => {
    navigator.clipboard.writeText(placeholderText)
      .then(() => {
        setCopyButtonText('¡Copiado!');
        setTimeout(() => setCopyButtonText('Copiar Ejemplo'), 2000);
      })
      .catch(err => {
        console.error('Error al copiar el texto: ', err);
        alert('No se pudo copiar el texto.');
      });
  };

  return (
    <div className="spell-form-card">
      <h3 className="spell-form-title">
        <i className="fas fa-file-import mr-3"></i>
        Importar desde Texto
      </h3>
      <p className="text-center text-yellow-800 dark:text-yellow-200 mb-4 -mt-4">
        Pega un array de hechizos en formato JSON para añadirlos al grimorio.
      </p>
      
      <div className="textarea-wrapper">
        <textarea
          id="json-import-area"
          className="form-input font-mono detailed-placeholder"
          rows={10}
          placeholder={placeholderText}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />
        <button onClick={handleCopyClick} className="copy-button">
          <i className={`fas ${copyButtonText === '¡Copiado!' ? 'fa-check' : 'fa-copy'} mr-2`}></i>
          {copyButtonText}
        </button>
      </div>

      <button
        onClick={handleImportClick}
        className="spell-form-button"
      >
        <i className="fas fa-book-medical mr-2"></i> Añadir al Grimorio
      </button>
    </div>
  );
};

export default JsonImport;
