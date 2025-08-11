import { Routes, Route } from 'react-router-dom';
import SpellCardGeneratorPage from './pages/SpellCardGenerator/SpellCardGeneratorPage';
import CardGeneratorPage from './pages/CardGenerator/CardGeneratorPage';
import Navigation from './components/Navigation'; // Import the new component
import './App.css';

function App() {
  return (
    <div className="App">
      <Navigation /> {/* Add the new navigation component */}
      <main className="page-content">
        <Routes>
          <Route path="/" element={<SpellCardGeneratorPage />} />
          <Route path="/card-generator" element={<CardGeneratorPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
