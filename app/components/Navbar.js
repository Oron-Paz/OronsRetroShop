// components/Navbar.js
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Sign In', path: '/signin' },
  { name: 'Sign Up', path: '/signup' },
  { name: 'Cart', path: '/cart' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 p-4 relative">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-xl">
          Your Logo
        </Link>
        <div className="hidden md:flex space-x-4">
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
        </div>
        <button
          className="md:hidden text-white w-10 h-10 relative focus:outline-none"
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
        <div className="md:hidden absolute bg-gray-800 w-screen left-0 top-16 px-4">
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;
