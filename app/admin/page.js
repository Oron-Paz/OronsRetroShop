// app/admin/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import ItemForm from '../components/ItemForm';
import { useAdmin } from '../hooks/useAdmin';


export default function AdminPage() {
  const [items, setItems] = useState([]);
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [showJobContent, setShowJobContent] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [newJob, setNewJob] = useState({ title: '', description: '' });

  const router = useRouter();

  const { isAdmin, isLoading } = useAdmin();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      alert('You are not authorized to view this page. \nRedirecting to home page.');
      router.push('/'); 
    } else if (isAdmin) {
      fetchActivities();
      fetchItems();
      fetchReviews(); // Add this line
    }
  }, [isAdmin, isLoading, router]);

  useEffect(() => {
    if (showJobContent) {
      fetchJobs();
      fetchApplications();
    }
  }, [showJobContent]);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        console.error('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        console.error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
      });
      if (response.ok) {
        const addedJob = await response.json();
        setJobs([...jobs, addedJob]);
        setNewJob({ title: '', description: '' });
      }
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setJobs(jobs.filter(job => job.id !== id));
      } else {
        console.error('Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleUpdateApplication = async (id, status) => {
    try {
      const response = await fetch('/api/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (response.ok) {
        setApplications(applications.map(app => 
          app.id === id ? { ...app, status } : app
        ));
      }
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };


  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        console.error('Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      const response = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setReviews(reviews.filter(review => review.id !== id));
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

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

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        console.error('Failed to fetch items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleAddItem = async (newItem) => {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        const addedItem = await response.json();
        setItems([...items, addedItem]);
        setIsAddingItem(false);
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleUpdateItem = async (updatedItem) => {
    try {
      const response = await fetch('/api/items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      });
      if (response.ok) {
        const updated = await response.json();
        setItems(items.map(item => item.id === updated.id ? updated : item));
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`/api/items?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setItems(items.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const filteredActivities = activities.filter(activity =>
    activity.username.toLowerCase().includes(filter.toLowerCase())
  );

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <button 
        onClick={() => setShowJobContent(!showJobContent)} 
        className="bg-purple-500 text-white px-4 py-2 rounded mb-4"
      >
        {showJobContent ? 'Hide Job Content' : 'Show Job Content'}
      </button>

      {showJobContent && (
        <div>
          <h2 className="text-2xl font-bold mt-8 mb-4">Manage Jobs</h2>
          <form onSubmit={handleAddJob} className="mb-4">
            <input
              type="text"
              placeholder="Job Title"
              value={newJob.title}
              onChange={(e) => setNewJob({...newJob, title: e.target.value})}
              className="border p-2 mr-2"
            />
            <input
              type="text"
              placeholder="Job Description"
              value={newJob.description}
              onChange={(e) => setNewJob({...newJob, description: e.target.value})}
              className="border p-2 mr-2"
            />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              Add Job
            </button>
          </form>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map(job => (
              <div key={job.id} className="border p-4 rounded">
                <h3 className="font-bold">{job.title}</h3>
                <p>{job.description}</p>
                <button
                  onClick={() => handleDeleteJob(job.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded mt-2"
                >
                  Delete Job
                </button>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Manage Applications</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Job</th>
                <th className="border p-2">Applicant</th>
                <th className="border p-2">Message</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td className="border p-2">{jobs.find(job => job.id === app.jobId)?.title}</td>
                  <td className="border p-2">{app.applicant}</td>
                  <td className="border p-2">{app.message}</td>
                  <td className="border p-2">{app.status}</td>
                  <td className="border p-2">
                    <button 
                      onClick={() => handleUpdateApplication(app.id, 'accepted')}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleUpdateApplication(app.id, 'rejected')}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4">Manage Products</h2>
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="border p-4 rounded">
            <h3 className="text-xl font-bold">{item.name}</h3>
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
            <button onClick={() => setEditingItem(item)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
              Edit
            </button>
            <button onClick={() => handleDeleteItem(item.id)} className="bg-red-500 text-white px-2 py-1 rounded">
              Delete
            </button>
          </div>
        ))}
      </div>
      {!isAddingItem && (
        <button onClick={() => setIsAddingItem(true)} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
          Add New Item
        </button>
      )}
      {isAddingItem && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Add New Item</h3>
          <ItemForm 
            onSubmit={handleAddItem} 
            onCancel={() => setIsAddingItem(false)}
          />
        </div>
      )}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-2">Edit Item</h3>
            <ItemForm 
              item={editingItem} 
              onSubmit={handleUpdateItem} 
              onCancel={() => setEditingItem(null)}
            />
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4">Manage Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map(review => (
          <div key={review.id} className="border p-4 rounded">
            <p>{review.message}</p>
            <p>By: {review.username}</p>
            <p>Likes: {review.likes} | Dislikes: {review.dislikes}</p>
            <button 
              onClick={() => handleDeleteReview(review.id)} 
              className="bg-red-500 text-white px-2 py-1 rounded mt-2"
            >
              Delete Review
            </button>
          </div>
        ))}
      </div>


      <h2 className="text-2xl font-bold mt-8 mb-4">User Activities</h2>
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