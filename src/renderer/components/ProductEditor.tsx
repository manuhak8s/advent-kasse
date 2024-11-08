import * as React from 'react';
import { useState, useEffect } from 'react';
import { theme } from '../styles/theme';
import { Product } from '../types/types';

interface ProductEditorProps {
  products: Product[];
  onClose: () => void;
  onSave: (products: Product[]) => void;
}

const ProductEditor: React.FC<ProductEditorProps> = ({
  products,
  onClose,
  onSave
}) => {
  const [editableProducts, setEditableProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });

  useEffect(() => {
    setEditableProducts(products);
  }, [products]);

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price) {
      const price = parseFloat(newProduct.price);
      if (!isNaN(price)) {
        const product: Product = {
          id: Date.now().toString(),
          name: newProduct.name,
          price: price
        };
        setEditableProducts([...editableProducts, product]);
        setNewProduct({ name: '', price: '' });
      }
    }
  };

  const handleDeleteProduct = (id: string) => {
    setEditableProducts(editableProducts.filter(p => p.id !== id));
  };

  const handleUpdateProduct = (id: string, field: 'name' | 'price', value: string) => {
    setEditableProducts(editableProducts.map(p => {
      if (p.id === id) {
        if (field === 'price') {
          const price = parseFloat(value);
          if (!isNaN(price)) {
            return { ...p, [field]: price };
          }
          return p;
        }
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const dialogStyles: React.CSSProperties = {
    background: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: '8px',
    boxShadow: theme.shadows.large,
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg
  };

  const tableStyles: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: theme.spacing.lg
  };

  const inputStyles: React.CSSProperties = {
    padding: theme.spacing.sm,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '4px',
    width: '100%'
  };

  return (
    <div style={overlayStyles}>
      <div style={dialogStyles}>
        <h2 style={{ margin: 0, color: theme.colors.primary }}>Produkte bearbeiten</h2>

        <div style={{ overflowY: 'auto' }}>
          <table style={tableStyles}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: theme.spacing.sm }}>Name</th>
                <th style={{ textAlign: 'left', padding: theme.spacing.sm }}>Preis (€)</th>
                <th style={{ textAlign: 'center', padding: theme.spacing.sm }}>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {editableProducts.map((product) => (
                <tr key={product.id}>
                  <td style={{ padding: theme.spacing.sm }}>
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => handleUpdateProduct(product.id, 'name', e.target.value)}
                      style={inputStyles}
                    />
                  </td>
                  <td style={{ padding: theme.spacing.sm }}>
                    <input
                      type="number"
                      step="0.01"
                      value={product.price}
                      onChange={(e) => handleUpdateProduct(product.id, 'price', e.target.value)}
                      style={inputStyles}
                    />
                  </td>
                  <td style={{ padding: theme.spacing.sm, textAlign: 'center' }}>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      style={{
                        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                        background: theme.colors.error,
                        color: theme.colors.textLight,
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ 
          padding: theme.spacing.md,
          borderTop: `1px solid ${theme.colors.border}`,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr auto',
          gap: theme.spacing.md,
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="Produktname"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            style={inputStyles}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Preis"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            style={inputStyles}
          />
          <button
            onClick={handleAddProduct}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              background: theme.colors.primary,
              color: theme.colors.textLight,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Hinzufügen
          </button>
        </div>

        <div style={{ 
          display: 'flex',
          gap: theme.spacing.md,
          justifyContent: 'flex-end',
          marginTop: theme.spacing.md
        }}>
          <button
            onClick={() => {
              onSave(editableProducts);
              onClose();
            }}
            style={{
              padding: theme.spacing.md,
              background: theme.colors.primary,
              color: theme.colors.textLight,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Speichern
          </button>
          <button
            onClick={onClose}
            style={{
              padding: theme.spacing.md,
              background: theme.colors.error,
              color: theme.colors.textLight,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductEditor;