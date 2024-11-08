import * as React from 'react';
import { useState } from 'react';

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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuContainerStyles: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    left: '20px',
    zIndex: 1000
  };

  const burgerButtonStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '2rem',
    height: '2rem',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    zIndex: 10,
  };

  const burgerLineStyles: React.CSSProperties = {
    width: '2rem',
    height: '0.25rem',
    background: '#333',
    borderRadius: '10px',
    transition: 'all 0.3s linear',
    position: 'relative',
    transformOrigin: '1px',
  };

  const sideMenuStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: isOpen ? 0 : '-250px',
    width: '250px',
    height: '100vh',
    background: 'white',
    boxShadow: isOpen ? '2px 0 5px rgba(0,0,0,0.2)' : 'none',
    transition: 'left 0.3s ease-in-out',
    zIndex: 5,
    display: 'flex',
    flexDirection: 'column'
  };

  const menuContentStyles: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto'
  };

  const getMenuItemStyles = (index: number, type: 'navigation' | 'action'): React.CSSProperties => ({
    padding: '15px 20px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.2s',
    backgroundColor: hoveredIndex === index ? '#f5f5f5' : 'white',
    color: type === 'action' ? '#ff4444' : 'inherit'  // Rote Farbe für Aktions-Items wie "App beenden"
  });

  const menuHeaderStyles: React.CSSProperties = {
    padding: '20px',
    borderBottom: '2px solid #eee',
    marginBottom: '10px',
    textAlign: 'center',
    fontSize: '1.2em',
    fontWeight: 'bold'
  };

  const menuFooterStyles: React.CSSProperties = {
    borderTop: '2px solid #eee',
    marginTop: 'auto'
  };

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden',
    transition: 'opacity 0.3s ease-in-out',
    zIndex: 4
  };

  const navigationItems = items.filter(item => item.type === 'navigation');
  const actionItems = items.filter(item => item.type === 'action');

  return (
    <>
      <div style={menuContainerStyles}>
        <button onClick={toggleMenu} style={burgerButtonStyles}>
          <span style={burgerLineStyles} />
          <span style={burgerLineStyles} />
          <span style={burgerLineStyles} />
        </button>
      </div>

      <div 
        style={overlayStyles} 
        onClick={() => setIsOpen(false)}
      />

      <div style={sideMenuStyles}>
        <div style={menuHeaderStyles}>Menü</div>
        
        <div style={menuContentStyles}>
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
              {item.label}
            </div>
          ))}
        </div>

        <div style={menuFooterStyles}>
          {actionItems.map((item, index) => (
            <div
              key={index + navigationItems.length}
              style={getMenuItemStyles(index + navigationItems.length, item.type)}
              onMouseEnter={() => setHoveredIndex(index + navigationItems.length)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BurgerMenu;