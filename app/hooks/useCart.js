'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/user/cart', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const addToCart = async (item) => {
    try {
      // First, check if the item already exists in the cart
      const existingItem = cart.find(cartItem => cartItem.id === item.id);
      
      let response;
      if (existingItem) {
        // If the item exists, update its quantity
        response = await fetch(`/api/user/cart/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: existingItem.quantity + 1 }),
          credentials: 'include',
        });
      } else {
        // If the item doesn't exist, add it to the cart
        response = await fetch('/api/user/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...item, quantity: 1 }),
          credentials: 'include',
        });
      }
  
      if (response.ok) {
        // Fetch the updated cart from the server
        await fetchCart();
      }
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const response = await fetch(`/api/user/cart/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
        credentials: 'include',
      });
      
      if (response.ok) {
        // Fetch the updated cart from the server
        await fetchCart();
      }
    } catch (error) {
      console.error('Failed to update item quantity:', error);
    }
  };


  const removeFromCart = async (itemId) => {
    try {
      const response = await fetch(`/api/user/cart/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setCart(cart.filter(item => item.id !== itemId));
      }
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}