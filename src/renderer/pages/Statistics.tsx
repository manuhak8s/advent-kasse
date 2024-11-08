import * as React from 'react';
import { theme } from '../styles/theme';

const Statistics: React.FC = () => {
  const cardStyles: React.CSSProperties = {
    background: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: '8px',
    boxShadow: theme.shadows.medium,
    border: `1px solid ${theme.colors.border}`,
    maxWidth: '800px',
    margin: '0 auto'
  };

  const cardHeaderStyles: React.CSSProperties = {
    color: theme.colors.primary,
    fontSize: '24px',
    fontWeight: 500,
    marginBottom: theme.spacing.lg,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm
  };

  return (
    <div style={cardStyles}>
      <h2 style={cardHeaderStyles}>
        <span>📊</span>
        Statistiken
      </h2>
      <p style={{ 
        color: theme.colors.text,
        lineHeight: 1.6,
        fontSize: '16px'
      }}>
        Hier werden Ihre Statistiken angezeigt.
      </p>
    </div>
  );
};

export default Statistics;