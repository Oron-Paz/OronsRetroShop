'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth'; // Adjust the import path as needed

export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [application, setApplication] = useState({ jobId: null, message: '' });
  const { user } = useAuth();

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
    if (!user) {
      alert('Please log in to apply for jobs.');
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
        throw new Error('Failed to submit application');
      }

      alert('Application submitted successfully!');
      setApplication({ jobId: null, message: '' });
    } catch (err) {
      console.error('Error submitting application:', err);
      alert('Failed to submit application. Please try again.');
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Careers</h1>
      {jobs.length === 0 ? (
        <p>No jobs available at the moment.</p>
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