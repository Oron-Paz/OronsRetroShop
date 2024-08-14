"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

export default function Page() {
    const [review, setReview] = useState('');
    const [reviews, setReviews] = useState([]);
    const router = useRouter();
    const { checkAuth, isAuthenticated } = useAuth();

    useEffect(() => {
        fetchReviews();
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            router.push('/signin'); // Redirect to login page if not authenticated
            return;
        }
        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: review }),
            });

            if (response.ok) {
                setReview('');
                fetchReviews(); // Refresh the reviews
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        }
    }

    const handleLikeDislike = async (id, action) => {
        try {
            const response = await fetch(`/api/reviews/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });
            if (response.ok) {
                fetchReviews(); // Refresh the reviews
            } else {
                console.error('Failed to update like/dislike');
            }
        } catch (error) {
            console.error('Error updating like/dislike:', error);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen -mt-10">
            <h2 className="text-2xl font-bold mb-4">Review Blog</h2>
            <p className="text-md mb-5 text-stone-600 font-mono">Here's what some of our users have to say about the store</p>
            <div className="w-full max-w-2xl">
                {reviews.map((review) => (
                    <div key={review.id} className="mb-4 p-4 border rounded">
                        <p>{review.message}</p>
                        <p className="text-sm text-gray-500 mt-1">Posted by: {review.username}</p>
                        <div className="mt-2">
                            <button onClick={() => handleLikeDislike(review.id, 'like')} className="mr-2">
                                👍 {review.likes}
                            </button>
                            <button onClick={() => handleLikeDislike(review.id, 'dislike')}>
                                👎 {review.dislikes}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-mono mt-8 w-full max-w-2xl">
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2"
                    rows="4"
                    placeholder="Write your review here..."
                />
                <button
                    type="submit"
                    className="bg-yellow-500 text-stone-800 px-4 py-2 rounded"
                >
                    Submit Review
                </button>
            </form>
        </div>
    );
}