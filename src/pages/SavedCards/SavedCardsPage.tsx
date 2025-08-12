import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageContainer from '../../components/PageContainer';
import GenericCardPreview from '../../components/GenericCardPreview';
import CardBackPreview from '../../components/CardBackPreview'; // Importar el reverso
import { getSavedCards, deleteCard } from '../../services/cardStorage';
import type { Card } from '../../types';
import './SavedCardsPage.css';

// Creamos props "dummy" para los componentes de previsualización
const dummyFunc = () => {};
const dummySmartGuides = { vertical: null, horizontal: null };

const SavedCardsPage: React.FC = () => {
  const [savedCards, setSavedCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    setSavedCards(getSavedCards());
  }, []);

  const handleFlipCard = (cardId: number) => {
    setFlippedCards(prev => {
      const newFlipped = new Set(prev);
      if (newFlipped.has(cardId)) {
        newFlipped.delete(cardId);
      } else {
        newFlipped.add(cardId);
      }
      return newFlipped;
    });
  };

  const handleDeleteCard = (cardId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta carta?')) {
      const updatedCards = deleteCard(cardId);
      setSavedCards(updatedCards);
    }
  };

  const handleLoadCard = (cardId: number) => {
    // La lógica para cargar la carta en el generador puede variar.
    // Una opción es guardar el ID en localStorage y que el generador lo lea.
    localStorage.setItem('cardToLoad', cardId.toString());
    navigate('/card-generator');
  };

  return (
    <PageContainer>
      <div className="saved-cards-page">
        <div className="page-header">
          <h1 className="page-title">Mis Cartas Guardadas</h1>
          <p className="page-subtitle">Aquí puedes ver, cargar y eliminar tus creaciones.</p>
        </div>
        
        {savedCards.length > 0 ? (
          <div className="saved-cards-grid">
            {savedCards.map(card => (
              <div key={card.id} className="saved-card-item">
                <div className="saved-card-preview-wrapper" onClick={() => handleFlipCard(card.id)}>
                  <div className={`card-flipper ${flippedCards.has(card.id) ? 'is-flipped' : ''}`}>
                    <div className="card-face card-front">
                      <GenericCardPreview
                        cardProps={card.cardProps}
                        image={card.image}
                        imageBorder={card.imageBorder}
                        onImageUpdate={dummyFunc}
                        imageSize={card.imageSize}
                        imageRotation={card.imageRotation}
                        titleProps={card.titleProps}
                        descriptionProps={card.descriptionProps}
                        footerProps={card.footerProps}
                        onElementUpdate={dummyFunc}
                        divider1={card.divider1}
                        divider2={card.divider2}
                        setDivider1={dummyFunc}
                        setDivider2={dummyFunc}
                        smartGuides={dummySmartGuides}
                        handleDragStart={dummyFunc}
                        handleDragStop={dummyFunc}
                        activeElement={null}
                        onElementClick={dummyFunc}
                      />
                    </div>
                    <div className="card-face card-back">
                      <CardBackPreview
                        cardProps={card.cardProps}
                        imageBack={card.imageBack}
                        imageBackSize={card.imageBackSize}
                        onImageUpdate={dummyFunc}
                        activeElement={null}
                        onElementClick={dummyFunc}
                        handleDragStart={dummyFunc}
                        handleDragStop={dummyFunc}
                        imageBorder={card.imageBorder}
                      />
                    </div>
                  </div>
                </div>
                <div className="saved-card-actions">
                  <button onClick={() => handleLoadCard(card.id)} className="action-button">Cargar</button>
                  <button onClick={() => handleDeleteCard(card.id)} className="action-button danger">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-cards-message spell-form-as-card">
            <h3>No tienes cartas guardadas</h3>
            <p>¡Ve al <Link to="/card-generator">Creador de Cartas</Link> para empezar a diseñar!</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default SavedCardsPage;
