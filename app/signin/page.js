"use client"

import { useState } from 'react';


export default function page() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    // Perform sign-in logic here
    console.log('Signing in...');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-10">
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
      <form className="flex flex-col gap-4">
        <label htmlFor="user">Username:</label>
        <input
          type="user"
          id="user"
          value={user}
          onChange={(e) => setUser(e.target.value)}
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

        <button
          type="button"
          onClick={handleSignIn}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign In
        </button>
      </form>

      <div className="mt-4">
        <p>Don't have an account? <a href="/signup" className="text-blue-500">Sign up</a></p>
      </div>
    </div>
  );
}

