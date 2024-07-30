"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation'


export default function page() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, rememberMe }),
    });

    if (response.ok) {
      router.push('/store'); // Redirect to store page after successful login
    } else {
      const data = await response.json();
      alert(data.message);
    }
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

        <label>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Remember me
        </label>

        <button
          type="button"
          onClick={handleSubmit}
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

