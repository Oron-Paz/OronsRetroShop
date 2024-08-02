'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import ManageProducts from './manageProducts';

export default function AdminPage() {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('');
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin');
    } else if (isAuthenticated) {
      fetchActivities();
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/admin/activities', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      } else {
        console.error('Failed to fetch activities');
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const filteredActivities = activities.filter(activity => 
    activity.username.toLowerCase().startsWith(filter.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
    <ManageProducts />

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by username"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Datetime</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Activity Type</th>
          </tr>
        </thead>
        <tbody>
          {filteredActivities.map((activity, index) => (
            <tr key={index}>
              <td className="border p-2">{new Date(activity.datetime).toLocaleString()}</td>
              <td className="border p-2">{activity.username}</td>
              <td className="border p-2">{activity.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}