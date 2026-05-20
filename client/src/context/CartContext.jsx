/**
 * CART CONTEXT
 * 
 * Global state management for shopping cart functionality.
 * 
 * Provides:
 * - Add to cart (with quantity)
 * - Remove from cart
 * - Update quantity
 * - Clear cart
 * - Cart item access
 * 
 * Uses React Context API for efficient state distribution across components.
 * Persists cart to localStorage for session continuity.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * CartContext
 * Holds cart state and dispatch functions
 */
const CartContext = createContext();

/**
 * CartProvider
 * Wraps the application to provide cart functionality everywhere
 * 
 * @param {React.ReactNode} children - App components
 */
export function CartProvider({ children }) {
  // ===== STATE =====
  // cartItems: Array of {id, name, type, price, quantity, imageURL, specs, voltage}
  const [cartItems, setCartItems] = useState(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('lab-reserve-cart');
    return saved ? JSON.parse(saved) : [];
  });

  // ===== PERSISTENCE =====
  // Auto-save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('lab-reserve-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // ===== ACTIONS =====

  /**
   * addToCart
   * Adds a product to the cart or increments quantity if already present
   * 
   * @param {Object} product - Product to add
   * @param {number} quantity - Quantity to add (default: 1)
   */
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      // Check if product already in cart
      const existingItem = prev.find((item) => item.id === product.id);

      if (existingItem) {
        // Increment quantity
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      // Add new item to cart
      return [...prev, { ...product, quantity }];
    });
  };

  /**
   * removeFromCart
   * Completely removes a product from the cart
   * 
   * @param {string} productId - ID of product to remove
   */
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  /**
   * updateQuantity
   * Changes the quantity of an item in the cart
   * 
   * @param {string} productId - ID of product
   * @param {number} newQuantity - New quantity (0 to remove, 1+ to keep)
   */
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  /**
   * clearCart
   * Empties the entire cart
   */
  const clearCart = () => {
    setCartItems([]);
  };

  /**
   * getCartTotal
   * Calculates total cost of all items
   * 
   * @returns {number} Total price
   */
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price?.replace('$', '') || 0);
      return total + price * item.quantity;
    }, 0);
  };

  /**
   * getCartCount
   * Returns total number of items in cart
   * 
   * @returns {number} Item count
   */
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // ===== CONTEXT VALUE =====
  const value = {
    // State
    cartItems,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,

    // Computed values
    cartTotal: getCartTotal(),
    cartCount: getCartCount()
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * useCart
 * Custom hook to access cart context
 * Use this in any component that needs cart functionality
 * 
 * @returns {Object} Cart context value
 * 
 * @example
 * const { cartItems, addToCart, cartCount } = useCart();
 */
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
