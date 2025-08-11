import { Routes, Route } from 'react-router-dom';
import SpellCardGeneratorPage from './pages/SpellCardGenerator/SpellCardGeneratorPage';
import CardGeneratorPage from './pages/CardGenerator/CardGeneratorPage';
import ProfilePage from './pages/Profile/ProfilePage';
import SavedCardsPage from './pages/SavedCards/SavedCardsPage';
import SubscriptionPage from './pages/Subscription/SubscriptionPage';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header-sticky">
        <Navigation />
      </header>
      <div className="app-body-content">
        <Routes>
          <Route path="/" element={<SpellCardGeneratorPage />} />
          <Route path="/card-generator" element={<CardGeneratorPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/saved-cards" element={<SavedCardsPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
