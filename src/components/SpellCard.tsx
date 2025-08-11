import React from 'react';
import FiligreeDivider from './FiligreeDivider';
import type { Spell } from '../types';

interface SpellCardProps {
  spell: Spell;
  onDelete: () => void;
  isEditMode: boolean;
  onUpdate: (updatedSpell: Spell) => void;
}

const EditableField: React.FC<{
  value: string;
  onChange: (newValue: string) => void;
  isEditMode: boolean;
  isTextarea?: boolean;
  className?: string;
  placeholder?: string;
}> = ({ value, onChange, isEditMode, isTextarea = false, className = '', placeholder = '' }) => {
  if (!isEditMode) {
    // Render the text, splitting it at the first colon for styling
    const parts = value.split(/:(.*)/s);
    if (parts.length > 1) {
      return (
        <span className={className}>
          <strong>{parts[0]}:</strong>{parts[1]}
        </span>
      );
    }
    return <span className={className}>{value}</span>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  if (isTextarea) {
    return <textarea value={value} onChange={handleInputChange} className={`editable-textarea ${className}`} placeholder={placeholder} />;
  }

  return <input type="text" value={value} onChange={handleInputChange} className={`editable-input ${className}`} placeholder={placeholder} />;
};

const SpellCard: React.FC<SpellCardProps> = ({ spell, onDelete, isEditMode, onUpdate }) => {

  const handleFieldChange = (field: keyof Spell, value: string) => {
    onUpdate({ ...spell, [field]: value });
  };

  return (
    <div className={`card-wrapper ${isEditMode ? 'edit-mode' : ''}`}>
      <div className="card">
        <div className="card-header">
          <EditableField 
            value={spell.name} 
            onChange={value => handleFieldChange('name', value)} 
            isEditMode={isEditMode}
            className="card-title"
            placeholder="Nombre del Hechizo"
          />
          <div className="card-level">
            <EditableField value={spell.school} onChange={v => handleFieldChange('school', v)} isEditMode={isEditMode} placeholder="Escuela" />
            <span className="level-separator"> · Nivel </span>
            <EditableField value={spell.level} onChange={v => handleFieldChange('level', v)} isEditMode={isEditMode} placeholder="Nivel" />
          </div>
        </div>
        <FiligreeDivider />
        <div className="card-details">
          <EditableField value={`Lanzamiento: ${spell.castingTime}`} onChange={v => handleFieldChange('castingTime', v.split(/:(.*)/s)[1] || '')} isEditMode={isEditMode} />
          <EditableField value={`Alcance: ${spell.range}`} onChange={v => handleFieldChange('range', v.split(/:(.*)/s)[1] || '')} isEditMode={isEditMode} />
          <EditableField value={`Componentes: ${spell.components}`} onChange={v => handleFieldChange('components', v.split(/:(.*)/s)[1] || '')} isEditMode={isEditMode} />
          <EditableField value={`Duración: ${spell.duration}`} onChange={v => handleFieldChange('duration', v.split(/:(.*)/s)[1] || '')} isEditMode={isEditMode} />
        </div>
        <FiligreeDivider />
        <div className="card-body">
            <EditableField 
              value={spell.description} 
              onChange={value => handleFieldChange('description', value)} 
              isEditMode={isEditMode}
              isTextarea={true}
              placeholder="Descripción..."
            />
        </div>
        <div className="card-footer">D&D 5e Conjuro</div>
      </div>
      <button
        aria-label="Eliminar carta"
        className="delete-button"
        onClick={onDelete}
        title="Eliminar este hechizo"
      >
        <i className="fas fa-trash-alt"></i>
      </button>
    </div>
  );
};

export default SpellCard;
