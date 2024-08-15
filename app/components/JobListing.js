// components/JobListing.js
import { useState } from 'react';

export default function JobListing({ job }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [application, setApplication] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: job.id, application }),
    });
    if (response.ok) {
      alert('Application submitted successfully!');
      setApplication('');
      setIsExpanded(false);
    }
  };

  return (
    <div>
      <h2>{job.title}</h2>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Close' : 'Apply'}
      </button>
      {isExpanded && (
        <form onSubmit={handleSubmit}>
          <textarea
            value={application}
            onChange={(e) => setApplication(e.target.value)}
            placeholder="Why do you think you're a good match for this job?"
          />
          <button type="submit">Submit Application</button>
        </form>
      )}
    </div>
  );
}