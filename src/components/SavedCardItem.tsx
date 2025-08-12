import React, { useState } from 'react';
import GenericCardPreview from './GenericCardPreview';
import CardBackPreview from './CardBackPreview';
import './SavedCardItem.css';
import type { Card } from '../types';

interface SavedCardItemProps {
  card: Card;
  onLoad: (card: Card) => void;
  onDelete: (cardId: number) => void;
}

const SavedCardItem: React.FC<SavedCardItemProps> = ({ card, onLoad, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Funciones vacías para desactivar la interactividad en la previsualización.
  // Esto asegura que las funciones de arrastrar, redimensionar, etc., no se ejecuten.
  const doNothing = () => {};

  const dummyHandlers = {
      onImageUpdate: doNothing,
      onElementUpdate: doNothing,
      setDivider1: doNothing,
      setDivider2: doNothing,
      handleDragStart: doNothing,
      handleDragStop: doNothing,
      onElementClick: doNothing,
  };

  return (
    <div className="saved-card-item">
      <div 
        className="saved-card-flipper-container"
        // Permite voltear la carta al hacer clic en el contenedor
        onClick={() => setIsFlipped(p => !p)}
      >
        <div className={`card-flipper ${isFlipped ? 'is-flipped' : ''}`}>
          <div className="card-face card-front">
            {/* 
              Pasamos todas las propiedades del objeto 'card' al preview.
              Luego, sobrescribimos las funciones de interactividad con nuestras funciones vacías.
            */}
            <GenericCardPreview
              cardProps={card.cardProps}
              image={card.image}
              imageBorder={card.imageBorder}
              imageSize={card.imageSize}
              imageRotation={card.imageRotation}
              titleProps={card.titleProps}
              descriptionProps={card.descriptionProps}
              footerProps={card.footerProps}
              divider1={card.divider1}
              divider2={card.divider2}
              {...dummyHandlers}
              smartGuides={{ vertical: null, horizontal: null }}
              activeElement={null} 
            />
          </div>
          <div className="card-face card-back">
            <CardBackPreview
              cardProps={card.cardProps}
              imageBack={card.imageBack}
              imageBackSize={card.imageBackSize}
              imageBorder={card.imageBorder}
              onImageUpdate={doNothing}
              activeElement={null}
              onElementClick={doNothing}
              handleDragStart={doNothing}
              handleDragStop={doNothing}
            />
          </div>
        </div>
      </div>
      <div className="saved-card-actions">
        <button onClick={(e) => { e.stopPropagation(); onLoad(card); }} className="action-button">Cargar</button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(card.id); }} className="action-button delete">Eliminar</button>
      </div>
    </div>
  );
};

export default SavedCardItem;
