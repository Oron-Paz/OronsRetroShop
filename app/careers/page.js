'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [application, setApplication] = useState({ jobId: null, message: '' });
  const { isAuthenticated, user, isLoading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch jobs');
        }
        return res.json();
      })
      .then(data => setJobs(data))
      .catch(err => {
        console.error('Error fetching jobs:', err);
        setError(err.message);
      });
  }, []);

  const handleApply = async (jobId) => {
    if (!isAuthenticated || !user) {
      alert('Please log in to apply for jobs.');
      // Optionally, redirect to login page
      // router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          applicant: user.username,
          message: application.message
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit application');
      }

      const result = await response.json();
      console.log('Application submitted:', result);
      alert('Application submitted successfully!');
      setApplication({ jobId: null, message: '' });
    } catch (err) {
      console.error('Error submitting application:', err);
      alert(err.message || 'Failed to submit application. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Careers</h1>
      {isAuthenticated && user ? (
        <p className="font-bold mb-4">Welcome, {user.username}!</p>
      ) : (
        <p className="font-bold mb-4">Please log in to apply for jobs.</p>
      )}
      {jobs.length === 0 ? (
        <p className="font-bold">No jobs available at the moment.</p>
      ) : (
        <div>
          {jobs.map(job => (
            <div key={job.id} className="mb-8 p-4 border rounded">
              <h2 className="text-2xl font-bold">{job.title}</h2>
              <p className="mb-4">{job.description}</p>
              <textarea
                className="w-full p-2 mb-2 border rounded"
                placeholder="Why do you think you're a good fit for this position?"
                value={application.jobId === job.id ? application.message : ''}
                onChange={(e) => setApplication({ jobId: job.id, message: e.target.value })}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => handleApply(job.id)}
                disabled={!isAuthenticated}
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}