// app/components/Navbar.js
'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, isLoading: isAuthLoading, signout } = useAuth();
  const { isAdmin, isLoading: isAdminLoading, checkAdmin } = useAdmin();

  useEffect(() => {
    if (isAuthenticated && !isAuthLoading) {
      checkAdmin();
    }
  }, [isAuthenticated, isAuthLoading, checkAdmin]);

  const navItems = useMemo(() => {
    const items = [
      { name: 'Home', path: '/' },
      { name: 'Store', path: '/store' },
    ];

    if (isAuthenticated && !isAuthLoading) {
      items.push({ name: 'Cart', path: '/cart' });
      items.push({ name: 'Profile', path: '/profile' });
      if (isAdmin && !isAdminLoading) {
        items.push({ name: 'Admin Dashboard', path: '/admin' });
      }
    } else if (!isAuthLoading) {
      items.push({ name: 'Sign-In', path: '/signin' });
    }

    return items;
  }, [isAuthenticated, isAuthLoading, isAdmin, isAdminLoading]);

  if (isAuthLoading || isAdminLoading) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="bg-stone-800 p-3 relative">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-xl">
          OronsRetroShop
        </Link>
        <div className="hidden sm:flex space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-white hover:text-gray-300 ${
                pathname === item.path ? 'font-bold' : ''
              }`}
            >
              {item.name}
            </Link>
          ))}
          {isAuthenticated && (
            <button
              onClick={signout}
              className="text-white hover:text-gray-300"
            >
              Sign Out
            </button>
          )}
        </div>
        <button
          className="sm:hidden text-white w-10 h-10 relative focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Open main menu</span>
          <div className="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span
              aria-hidden="true"
              className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${
                isOpen ? 'rotate-45' : '-translate-y-1.5'
              }`}
            ></span>
            <span
              aria-hidden="true"
              className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${
                isOpen ? 'opacity-0' : 'opacity-100'
              }`}
            ></span>
            <span
              aria-hidden="true"
              className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${
                isOpen ? '-rotate-45' : 'translate-y-1.5'
              }`}
            ></span>
          </div>
        </button>
      </div>
      {isOpen && (
        <div className="sm:hidden absolute bg-stone-800 w-screen left-0 top-13 px-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block text-white hover:text-gray-300 py-2 ${
                pathname === item.path ? 'font-bold' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {isAuthenticated && (
            <button
              onClick={() => {
                signout();
                setIsOpen(false);
              }}
              className="block text-white hover:text-gray-300 py-2"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;