import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import BurgerMenu from './components/BurgerMenu';
import { MenuItem } from './components/BurgerMenu';
import Homepage from './pages/Homepage';
import Statistics from './pages/Statistics';

const App: React.FC = () => {
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      label: 'Startseite',
      onClick: () => navigate('/'),
      type: 'navigation' as const
    },
    {
      label: 'Statistik',
      onClick: () => navigate('/statistics'),
      type: 'navigation' as const
    },
    {
      label: 'App beenden',
      onClick: () => {
        if (window.electron) {
          window.electron.send('quit-app');
        }
      },
      type: 'action' as const
    }
  ];

  return (
    <div>
      <BurgerMenu items={menuItems} />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </div>
  );
};

// Wrap the app with Router
const AppWrapper: React.FC = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app');
  if (container) {
    const root = createRoot(container);
    root.render(<AppWrapper />);
  }
});