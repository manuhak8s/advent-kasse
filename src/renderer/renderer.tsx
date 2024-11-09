import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import BurgerMenu from './components/BurgerMenu';
import { MenuItem } from './components/BurgerMenu';
import Homepage from './pages/Homepage';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
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
      label: 'Einstellungen',
      onClick: () => navigate('/settings'),
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
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <header style={{
        background: theme.colors.primary,
        color: theme.colors.textLight,
        padding: `0 ${theme.spacing.xl}`,
        height: '64px',
        minHeight: '64px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: theme.shadows.medium,
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
          Advent-Kasse
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        overflow: 'hidden',
        paddingTop: '8px'
      }}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/settings" element={<Settings />} />
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