// app/hooks/useAdmin.js
'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useAuth } from './useAuth'; // Import useAuth

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth(); // Use the auth context

  const checkAdmin = useCallback(async () => {
    setIsLoading(true);
    if (!isAuthenticated) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch('/api/auth/checkAdmin', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Admin check failed:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    checkAdmin();
  }, [checkAdmin, isAuthenticated]);

  return (
    <AdminContext.Provider value={{ isAdmin, isLoading, checkAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}