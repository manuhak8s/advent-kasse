import * as React from 'react';
import { useState } from 'react';
import { theme } from '../styles/theme';

export interface MenuItem {
  label: string;
  onClick: () => void;
  type: 'navigation' | 'action';
}

interface BurgerMenuProps {
  items: MenuItem[];
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const burgerButtonStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '32px',
    height: '32px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: theme.spacing.xs,
    zIndex: 1000
  };

  const burgerLineStyles: React.CSSProperties = {
    width: '100%',
    height: '2px',
    background: theme.colors.textLight,
    borderRadius: '1px',
    transition: 'all 0.3s'
  };

  const sideMenuStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: isOpen ? 0 : '-300px',
    width: '300px',
    height: '100vh',
    background: theme.colors.surface,
    boxShadow: theme.shadows.large,
    transition: 'all 0.3s',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column'
  };

  const menuHeaderStyles: React.CSSProperties = {
    padding: theme.spacing.lg,
    background: theme.colors.primary,
    color: theme.colors.textLight,
    fontSize: '18px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm
  };

  const getMenuItemStyles = (index: number, type: 'navigation' | 'action'): React.CSSProperties => ({
    padding: theme.spacing.lg,
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: hoveredIndex === index ? theme.colors.border : theme.colors.surface,
    color: type === 'action' ? theme.colors.error : theme.colors.text,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderBottom: type === 'navigation' ? `1px solid ${theme.colors.border}` : 'none'
  });

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden',
    transition: 'all 0.3s',
    zIndex: 999
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'navigation':
        return '🎄';
      case 'action':
        return '✨';
      default:
        return '•';
    }
  };

  // Teile die Menüpunkte in Navigation und Aktionen auf
  const navigationItems = items.filter(item => item.type === 'navigation');
  const actionItems = items.filter(item => item.type === 'action');

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} style={burgerButtonStyles}>
        <span style={burgerLineStyles} />
        <span style={burgerLineStyles} />
        <span style={burgerLineStyles} />
      </button>

      <div style={overlayStyles} onClick={() => setIsOpen(false)} />

      <div style={sideMenuStyles}>
        <div style={menuHeaderStyles}>
          <span>⭐</span>
          Menü
        </div>
        
        {/* Navigation Items */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {navigationItems.map((item, index) => (
            <div
              key={index}
              style={getMenuItemStyles(index, item.type)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
            >
              <span>{getIcon(item.type)}</span>
              {item.label}
            </div>
          ))}
        </div>

        {/* Action Items (App beenden) */}
        <div style={{ 
          borderTop: `1px solid ${theme.colors.border}`,
          marginTop: 'auto'  // Drückt den Footer ans Ende
        }}>
          {actionItems.map((item, index) => (
            <div
              key={`action-${index}`}
              style={getMenuItemStyles(navigationItems.length + index, item.type)}
              onMouseEnter={() => setHoveredIndex(navigationItems.length + index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
            >
              <span>{getIcon(item.type)}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BurgerMenu;