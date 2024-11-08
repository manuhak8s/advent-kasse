import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import BurgerMenu from './components/BurgerMenu';
import { MenuItem } from './components/BurgerMenu';
import Homepage from './pages/Homepage';
import Statistics from './pages/Statistics';
import { theme } from './styles/theme';

const AppContent: React.FC = () => {
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
    <div style={{ 
      minHeight: '100vh',
      background: theme.colors.background,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <header style={{
        background: theme.colors.primary,
        color: theme.colors.textLight,
        padding: `${theme.spacing.md} ${theme.spacing.xl}`,
        display: 'flex',
        alignItems: 'center',
        boxShadow: theme.shadows.medium,
        height: '64px'
      }}>
        <BurgerMenu items={menuItems} />
        <div style={{ 
          marginLeft: '80px',
          fontSize: '24px',
          fontWeight: 500,
          letterSpacing: '0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.sm
        }}>
          <span style={{ color: theme.colors.secondary }}>⭐</span>
          Adventshaus-Kasse
        </div>
      </header>

      <main style={{ 
        flex: 1,
        padding: theme.spacing.xl
      }}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app');
  if (container) {
    const root = createRoot(container);
    root.render(<App />);
  }
});