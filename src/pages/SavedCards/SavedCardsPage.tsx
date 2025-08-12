import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/PageContainer';
import './SavedCardsPage.css';

const SavedCardsPage: React.FC = () => {
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const cardsFromStorage = JSON.parse(localStorage.getItem('savedCards') || '[]');
      setSavedCards(cardsFromStorage);
    } catch (error) {
      console.error("Error loading cards from localStorage", error);
      setSavedCards([]);
    }
  }, []);

  const handleDeleteCard = (cardId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta carta?')) {
      const updatedCards = savedCards.filter(card => card.id !== cardId);
      localStorage.setItem('savedCards', JSON.stringify(updatedCards));
      setSavedCards(updatedCards);
    }
  };

  const handleLoadCard = (cardId: number) => {
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
                <div className="saved-card-preview">
                  {/* We can add a mini-preview component here later */}
                  <div className="card-placeholder">
                    <span className="card-title-preview">{card.titleProps?.text || 'Carta sin título'}</span>
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
            <p>¡Ve al <a href="/card-generator">Creador de Cartas</a> para empezar a diseñar!</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default SavedCardsPage;
