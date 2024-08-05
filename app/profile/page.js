// app/profile/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import Image from 'next/image';

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [pastPurchases, setPastPurchases] = useState([]);
  const [newAvatarURL, setNewAvatarURL] = useState('');
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin');
    } else if (isAuthenticated) {
      fetchUserData();
      fetchPastPurchases();
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchPastPurchases = async () => {
    try {
      const response = await fetch('/api/user/purchases', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setPastPurchases(data);
      } else {
        console.error('Failed to fetch past purchases');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAvatarChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/update-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatarURL: newAvatarURL }),
        credentials: 'include',
      });
      if (response.ok) {
        setUserData({ ...userData, avatarURL: newAvatarURL });
        setNewAvatarURL('');
      } else {
        console.error('Failed to update avatar');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // This will be handled by the useEffect redirect
  }

  if (!userData) {
    return <div className="text-center mt-8">Loading user data...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex items-center mb-6">
          <Image 
            src={userData.avatarURL || '/default-avatar.png'} 
            alt="Profile Picture" 
            width={100} 
            height={100} 
            className="rounded-full mr-4"
          />
          <div>
            <h2 className="text-2xl font-semibold">{userData.username}</h2>
            <p className="text-gray-600">{userData.email}</p>
          </div>
        </div>

        <form onSubmit={handleAvatarChange} className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Change Profile Picture</h3>
          <div className="flex">
            <input
              type="text"
              value={newAvatarURL}
              onChange={(e) => setNewAvatarURL(e.target.value)}
              placeholder="Enter new avatar URL"
              className="flex-grow border rounded-l px-3 py-2"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r">
              Update
            </button>
          </div>
        </form>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Last Login:</p>
            <p>{new Date(userData.lastLogin).toLocaleString()}</p>
          </div>
          <div>
            <p className="font-semibold">Member Since:</p>
            <p>{new Date(userData.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-semibold">Total Purchases:</p>
            <p>{pastPurchases.length}</p>
          </div>
          <div>
            <p className="font-semibold">Account Status:</p>
            <p>{userData.accountStatus}</p>
          </div>
        </div>
      </div>
    </div>
  );
}