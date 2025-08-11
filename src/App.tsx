import { Routes, Route, NavLink } from 'react-router-dom';
import SpellCardGeneratorPage from './pages/SpellCardGenerator/SpellCardGeneratorPage';
import CardGeneratorPage from './pages/CardGenerator/CardGeneratorPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <nav className="main-nav">
        <NavLink to="/">Generador de Conjuros</NavLink>
        <NavLink to="/card-generator">Generador de Cartas</NavLink>
      </nav>
      <div className="page-content">
        <Routes>
          <Route path="/" element={<SpellCardGeneratorPage />} />
          <Route path="/card-generator" element={<CardGeneratorPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
