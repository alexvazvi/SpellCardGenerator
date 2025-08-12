import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import FiligreeDivider from './FiligreeDivider';
import type { Spell } from '../types';

// El formulario manejará un "borrador" del hechizo, sin el ID.
type SpellDraft = Omit<Spell, 'id'>;

interface SpellFormProps {
  onAddSpell: (spellDraft: SpellDraft) => void;
  showSuccess: boolean;
}

const SpellForm: React.FC<SpellFormProps> = ({ onAddSpell, showSuccess }) => {
  const initialDraft: SpellDraft = {
    name: '', level: '', school: '', castingTime: '',
    range: '', components: '', duration: '', description: '',
  };
  
  const [spellDraft, setSpellDraft] = useState<SpellDraft>(initialDraft);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSpellDraft(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (spellDraft.name.trim()) {
      onAddSpell(spellDraft);
      setSpellDraft(initialDraft);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="spell-form-as-card">
      <div className="card-header">
        <input
          name="name"
          value={spellDraft.name}
          onChange={handleChange}
          placeholder="Nombre del Hechizo"
          className="form-card-input card-title"
          required
        />
        <p className="card-level">
          <input name="school" value={spellDraft.school} onChange={handleChange} placeholder="Escuela" className="form-card-input-inline" required />
          {' · Nivel '}
          <input name="level" value={spellDraft.level} onChange={handleChange} placeholder="Nivel" className="form-card-input-inline" style={{width: '40px'}} required />
        </p>
      </div>
      <FiligreeDivider />
      <div className="card-details">
        <div><strong>Lanzamiento:</strong> <input name="castingTime" value={spellDraft.castingTime} onChange={handleChange} placeholder="1 acción" className="form-card-input" required /></div>
        <div><strong>Alcance:</strong> <input name="range" value={spellDraft.range} onChange={handleChange} placeholder="60 pies" className="form-card-input" required /></div>
        <div><strong>Componentes:</strong> <input name="components" value={spellDraft.components} onChange={handleChange} placeholder="V, S, M" className="form-card-input" required /></div>
        <div><strong>Duración:</strong> <input name="duration" value={spellDraft.duration} onChange={handleChange} placeholder="Instantánea" className="form-card-input" required /></div>
      </div>
      <FiligreeDivider />
      <div className="card-body">
        <textarea
          name="description"
          value={spellDraft.description}
          onChange={handleChange}
          placeholder="Describe los efectos del hechizo aquí..."
          className="form-card-textarea"
          required
        />
      </div>
      <div className="card-footer">
        <button type="submit" className="spell-form-button">
          <i className="fas fa-wand-magic-sparkles mr-2"></i> Forjar Hechizo
        </button>
      </div>
      {showSuccess && (
        <div className="form-success-message">
          ¡Hechizo añadido al grimorio!
        </div>
      )}
    </form>
  );
};

export default SpellForm;
