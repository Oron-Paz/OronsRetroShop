// app/hooks/useAdmin.js
'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdmin = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/checkAdmin', {
        method: 'GET',
        credentials: 'include',
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
  }, []);

  useEffect(() => {
    checkAdmin();
  }, [checkAdmin]);

  return (
    <AdminContext.Provider value={{ isAdmin, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
