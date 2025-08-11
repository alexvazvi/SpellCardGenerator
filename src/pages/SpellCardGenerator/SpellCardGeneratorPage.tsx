import React, { useState, useEffect } from 'react';
import 'animate.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './SpellCardGeneratorPage.css';
import Header from '../../components/Header';
import SpellCard from '../../components/SpellCard';
import SpellForm from '../../components/SpellForm';
import type { Spell } from '../../types';
import { generateSpellPdf } from '../../pdfGenerator';
import JsonImport from '../../components/JsonImport';
import Pagination from '../../components/Pagination';

const SpellCardGeneratorPage = () => {
  const [spells, setSpells] = useState<Spell[]>(() => {
    try {
      const savedSpells = localStorage.getItem('spells');
      if (savedSpells) {
        const parsedSpells = JSON.parse(savedSpells);
        if (Array.isArray(parsedSpells) && parsedSpells.length > 0) {
          return parsedSpells;
        }
      }
    } catch (error) {
      console.error("Error reading spells from localStorage:", error);
    }
    return [
      {
        name: 'Bola de Fuego',
        level: '3',
        school: 'Evocación',
        castingTime: '1 acción',
        range: '150 pies',
        components: 'V, S, M',
        duration: 'Instantánea',
        description: 'Una explosión de llamas rugientes estalla en un punto de tu elección dentro del alcance. Cada criatura en una esfera de 20 pies de radio centrada en ese punto debe hacer una tirada de salvación de Destreza. Recibe 8d6 de daño por fuego si falla, o la mitad si tiene éxito.'
      },
      {
        name: 'Rayo de Escarcha',
        level: '0 (Truco)',
        school: 'Evocación',
        castingTime: '1 acción',
        range: '60 pies',
        components: 'V, S',
        duration: 'Instantánea',
        description: 'Un rayo de energía gélida se proyecta hacia una criatura dentro del alcance. Haz un ataque de hechizo a distancia contra el objetivo. Si impactas, el objetivo recibe 1d8 de daño por frío y su velocidad se reduce en 10 pies hasta el comienzo de tu siguiente turno.'
      },
    ];
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const spellsPerPage = 12; // Reduced to 12 for a 3-column layout (3x4)

  useEffect(() => {
    try {
      localStorage.setItem('spells', JSON.stringify(spells));
    } catch (error) {
      console.error("Error saving spells to localStorage:", error);
    }
  }, [spells]);

  const addSpell = (spell: Spell) => {
    setSpells(prevSpells => [...prevSpells, spell]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1200);
  };

  const deleteSpell = (spellToDelete: Spell) => {
    setSpells(prevSpells => prevSpells.filter(spell => spell !== spellToDelete));
    // After deleting, check if the current page would become empty
    if (currentSpells.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleUpdateSpell = (updatedSpell: Spell, index: number) => {
    const indexInAllSpells = (currentPage - 1) * spellsPerPage + index;
    const newSpells = [...spells];
    newSpells[indexInAllSpells] = updatedSpell;
    setSpells(newSpells);
  };

  const exportToPDF = async () => {
    if (spells.length === 0) {
      alert("No hay hechizos para exportar.");
      return;
    }
    
    setLoading(true);
    try {
      // Pass the currently filtered spells to the PDF generator if a search is active
      const spellsToExport = searchTerm ? filteredSpells : spells;
      if (spellsToExport.length === 0) {
        alert("No hay hechizos en la selección actual para exportar.");
        return;
      }
      await generateSpellPdf(spellsToExport, (message: string) => {
        setLoadingMessage(message);
      });
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Ocurrió un error inesperado al generar el PDF. Revisa la consola para más detalles.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(dm => !dm);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = e => {
        if (e.target && e.target.result) {
          handleImportFromJsonString(e.target.result as string);
        }
      };
    }
  };

  const handleImportFromJsonString = (jsonString: string) => {
    try {
      const importedSpells = JSON.parse(jsonString);
      if (Array.isArray(importedSpells) && importedSpells.every(item => typeof item === 'object')) {
        const validSpells = importedSpells.filter(spell => spell.name && spell.description);
        setSpells(prevSpells => [...prevSpells, ...validSpells]);
        alert(`${validSpells.length} hechizos importados con éxito!`);
        // Go to the first page after importing
        setCurrentPage(1);
      } else {
        alert('El texto JSON no tiene el formato correcto. Debe ser un array de hechizos.');
      }
    } catch (error) {
      alert('Error al leer el texto JSON. Asegúrate de que el formato es correcto.');
      console.error("JSON parsing error:", error);
    }
  };

  // Search and Pagination Logic
  const filteredSpells = spells.filter(spell =>
    spell.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastSpell = currentPage * spellsPerPage;
  const indexOfFirstSpell = indexOfLastSpell - spellsPerPage;
  const currentSpells = filteredSpells.slice(indexOfFirstSpell, indexOfLastSpell);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  return (
    <div className={`main-container ${darkMode ? 'dark-mode' : ''}`}>
      <Header 
        toggleDarkMode={toggleDarkMode} 
        darkMode={darkMode} 
        onImport={handleImport} 
        onExportPDF={exportToPDF}
      />
      
      <main className="content-wrapper">
        <div className="forms-column">
          <SpellForm onAddSpell={addSpell} showSuccess={showSuccess} />
          <JsonImport onImport={handleImportFromJsonString} />
        </div>
        <div className="cards-column">
          <div className="card-list-header">
            <div className="search-bar">
              <i className="fas fa-search search-icon"></i>
              <input 
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
            <div className="spell-count-and-edit">
              <p>{filteredSpells.length} de {spells.length} hechizos</p>
              <button onClick={() => setIsEditMode(!isEditMode)} className="edit-mode-toggle" title={isEditMode ? 'Desactivar Edición' : 'Activar Edición'}>
                <i className={`fas ${isEditMode ? 'fa-lock-open' : 'fa-lock'}`}></i>
              </button>
            </div>
          </div>
          <div className="card-container">
            {currentSpells.map((spell, index) => (
              <SpellCard
                key={spell.name + index} // Use a more stable key
                spell={spell}
                onDelete={() => deleteSpell(spell)}
                isEditMode={isEditMode}
                onUpdate={(updatedSpell) => handleUpdateSpell(updatedSpell, index)}
              />
            ))}
          </div>
          <Pagination
            totalItems={filteredSpells.length}
            itemsPerPage={spellsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </main>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>{loadingMessage}</p>
        </div>
      )}
    </div>
  );
};

export default SpellCardGeneratorPage;
