// app/hooks/useAuth.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.authenticated);
          
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signout = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setIsAuthenticated(false);
      } else {
        console.error('Signout failed');
      }
    } catch (error) {
      console.error('Signout failed:', error);
    }
  };

  return { isAuthenticated, isLoading, signout };
}
