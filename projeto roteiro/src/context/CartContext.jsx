import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products once and cache them
  useEffect(() => {
    fetch('/api/products')
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setProducts(data);
        // We do NOT set loading to false here, fetchCart will do it when it finishes
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  const fetchCart = useCallback(async () => {
    if (products.length === 0) return;
    setLoading(true);
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const remoteCart = await response.json();
        
        // Use remoteCart.items since the API returns { items: [], total: ... }
        const cartItemsData = remoteCart.items || remoteCart;
        
        const merged = cartItemsData.map(item => {
          const product = products.find(p => p.id === Number(item.productId));
          return product ? { product, quantity: item.quantity } : null;
        }).filter(Boolean);
        
        setCartItems(merged);
      } else {
        // Fallback to localStorage if API returns error
        const saved = localStorage.getItem('roteiros_cart');
        if (saved) setCartItems(JSON.parse(saved));
      }
    } catch (err) {
      // Fallback to localStorage if API is down
      try {
        const saved = localStorage.getItem('roteiros_cart');
        if (saved) setCartItems(JSON.parse(saved));
      } catch (parseErr) {
        console.error('Failed to parse cart from localStorage:', parseErr);
      }
    } finally {
      setLoading(false);
    }
  }, [products]);

  useEffect(() => {
    if (products.length > 0) {
      fetchCart();
    }
  }, [fetchCart, products]);

  useEffect(() => {
    try {
      localStorage.setItem('roteiros_cart', JSON.stringify(cartItems));
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err);
    }
  }, [cartItems]);

  const addToCart = async (product) => {
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      });
      fetchCart();
    } catch {
      setCartItems(prev => {
        const existing = prev.find(item => item.product.id === product.id);
        if (existing) {
          return prev.map(item =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prev, { product, quantity: 1 }];
      });
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await fetch(`/api/cart/${productId}`, { method: 'DELETE' });
      fetchCart();
    } catch {
      setCartItems(prev => prev.filter(item => item.product.id !== productId));
    }
  };

  const updateQuantity = async (productId, amount) => {
    let newQty = 1;
    setCartItems(prev => {
      const updated = prev.map(item => {
        if (item.product.id === productId) {
          newQty = Math.max(1, item.quantity + amount);
          return { ...item, quantity: newQty };
        }
        return item;
      });
      return updated;
    });

    // Sync with API
    try {
      await fetch(`/api/cart/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty })
      });
    } catch (err) {
      console.error('Failed to update quantity on API:', err);
    }
  };

  const clearCart = async () => {
    try {
      await fetch('/api/cart', { method: 'DELETE' });
      setCartItems([]);
    } catch {
      setCartItems([]);
    }
  };

  const getSubtotal = useCallback(() => 
    cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0),
    [cartItems]
  );

  const cartCount = useMemo(() => 
    cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getSubtotal, cartCount, loading }}>
      {children}
    </CartContext.Provider>
  );
};
