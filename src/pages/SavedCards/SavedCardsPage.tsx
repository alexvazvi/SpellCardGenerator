import React from 'react';
import PageContainer from '../../components/PageContainer';
import './SavedCardsPage.css';

const SavedCardsPage: React.FC = () => {
  // TODO: Fetch decks and cards from the user's account
  const decks = [
    {
      name: 'Equipo del Aventurero',
      cards: [
        { id: 1, name: 'Poción de Curación', imageUrl: '/frames/classic-frame.png' },
        { id: 2, name: 'Espada Larga +1', imageUrl: '/frames/classic-frame.png' },
        { id: 3, name: 'Amuleto de Salud', imageUrl: '/frames/classic-frame.png' },
      ],
    },
    {
      name: 'Hechizos de Fuego',
      cards: [
        { id: 4, name: 'Bola de Fuego', imageUrl: '/frames/elvish-frame.png' },
        { id: 5, name: 'Rayo de Fuego', imageUrl: '/frames/elvish-frame.png' },
      ],
    },
    {
        name: 'Tesoros del Dragón',
        cards: [
          { id: 6, name: 'Corona de Mando', imageUrl: '/frames/dwarven-frame.png' },
          { id: 7, name: 'Gema del Alma', imageUrl: '/frames/dwarven-frame.png' },
          { id: 8, name: 'Hacha de los Reinos', imageUrl: '/frames/dwarven-frame.png' },
          { id: 9, name: 'Escudo del Defensor', imageUrl: '/frames/dwarven-frame.png' },
        ],
      },
  ];

  return (
    <PageContainer>
      <div className="saved-cards-page">
        <div className="page-header">
          <h1 className="page-title">Mis Cartas Guardadas</h1>
        <p className="page-subtitle">Organiza tus creaciones en barajas temáticas.</p>
      </div>
      
      <div className="decks-container">
        {decks.map(deck => (
          <div key={deck.name} className="deck">
            <h2 className="deck-title">{deck.name}</h2>
            <div className="card-spread">
              {deck.cards.map((card, index) => (
                <div key={card.id} className="card-in-deck" style={{ transform: `translateX(${index * 40}px) rotateZ(${(index - (deck.cards.length -1) / 2) * 5}deg)` }}>
                  <img src={card.imageUrl} alt={card.name} />
                  <div className="card-name-overlay">{card.name}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="todo-section spell-form-as-card">
        <h3 className="section-title">Development To-Do</h3>
        <ul className="todo-list">
          <li><i className="far fa-square"></i> Implement "Crear Baraja" functionality.</li>
          <li><i className="far fa-square"></i> Allow users to drag-and-drop cards between decks.</li>
          <li><i className="far fa-square"></i> Add a way to view/edit individual cards from this screen.</li>
          <li><i className="far fa-square"></i> Connect to a database to save and load real user-created decks.</li>
          <li><i className="far fa-square"></i> Implement pagination for decks with many cards.</li>
        </ul>
      </div>
      </div>
    </PageContainer>
  );
};

export default SavedCardsPage;
