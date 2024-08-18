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
        <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 py-12 px-4">
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-3xl font-bold mb-2 text-stone-800">Review Blog</h2>
                    <p className="text-lg text-stone-600 font-mono">Here's what some of our users have to say about the store</p>
                </div>
                <div className="p-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="mb-6 bg-stone-50 p-4 rounded-lg shadow">
                            <p className="text-lg text-stone-800 mb-2">{review.message}</p>
                            <p className="text-sm text-stone-500 mb-3">Posted by: {review.username}</p>
                            <div className="flex items-center space-x-4">
                                <button onClick={() => handleLikeDislike(review.id, 'like')} className="flex items-center space-x-1 text-stone-700 hover:text-yellow-500 transition">
                                    <span>👍</span>
                                    <span>{review.likes}</span>
                                </button>
                                <button onClick={() => handleLikeDislike(review.id, 'dislike')} className="flex items-center space-x-1 text-stone-700 hover:text-yellow-500 transition">
                                    <span>👎</span>
                                    <span>{review.dislikes}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="p-6 bg-stone-50 border-t border-gray-200">
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        rows="4"
                        placeholder="Write your review here..."
                    />
                    <button
                        type="submit"
                        className="w-full bg-yellow-500 text-stone-800 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
                    >
                        Submit Review
                    </button>
                </form>
            </div>
        </div>
    );
}