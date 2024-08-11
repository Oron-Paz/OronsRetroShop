"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

export default function Page() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { checkAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, rememberMe }),
    });

    if (response.ok) {
      await checkAuth(); // This will update the auth state
      router.push('/'); // Redirect to store page after successful login
    } else {
      const data = await response.json();
      // Show error message
      alert(data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-10">
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
      <p className="text-md mb-5 text-stone-600 font-mono">Sign-in to access all features of our amazing store!</p>
      <form className="flex flex-col gap-4 font-mono">
        <label htmlFor="user">Username:</label>
        <input
          type="user"
          id="user"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        />

        <label>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          ‎ Remember me
        </label>

        <button
          type="button"
          onClick={handleSubmit}
          className="bg-yellow-500 text-stone-800 px-4 py-2 rounded"
        >
          Sign In
        </button>
      </form>

      <div className="mt-4 font-mono">
        <p>Don`t have an account? <Link href="/signup" className="text-yellow-600">Sign up</Link></p>
      </div>
    </div>
  );
}

