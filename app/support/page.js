"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

const supportQuestions = [
  {
    question: "What's in my cart?",
    answer: async () => {
      const response = await fetch('/api/user/cart');
      if (response.ok) {
        const cart = await response.json();
        return `Your cart contains: ${cart.map(item => `${item.quantity} x ${item.name}`).join(', ')}`;
      }
      return "Unable to fetch cart information at the moment or user is not logged in.";
    }
  },
  {
    question: "When did I last sign in?",
    answer: async () => {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const userData = await response.json();
        return `Your last login was on ${new Date(userData.lastLogin).toLocaleString()}`;
      }
      return "Unable to fetch last login information at the moment or user is not logged in.";
    }
  },
  {
    question: "What items are available in the store?",
    answer: async () => {
      const response = await fetch('/api/items');
      if (response.ok) {
        const items = await response.json();
        return `Available items: ${items.map(item => item.name).join(', ')}`;
      }
      return "Unable to fetch store items at the moment.";
    }
  },
  {
    question: "What's your most expensive item?",
    answer: async () => {
      const response = await fetch('/api/items');
      if (response.ok) {
        const items = await response.json();
        const mostExpensive = items.reduce((max, item) => parseInt(item.price) > parseInt(max.price) ? item : max, items[0]);
        return `Our most expensive item is ${mostExpensive.name} at $${mostExpensive.price}`;
      }
      return "Unable to determine the most expensive item at the moment.";
    }
  },
  {
    question: "What's the most liked review?",
    answer: async () => {
      const response = await fetch('/api/reviews');
      if (response.ok) {
        const reviews = await response.json();
        const mostLiked = reviews.reduce((max, review) => review.likes > max.likes ? review : max, reviews[0]);
        if (mostLiked) {
          return `The most liked review is: "${mostLiked.message}" by ${mostLiked.username} with ${mostLiked.likes} likes`;
        } else {
          return "No reviews found.";
        }
      }
      return "Unable to fetch the most liked review at the moment.";
    }
  },
  {
    question: "What kind of things can I find on this site",
    answer: async() => {
        return "Our store has a variety of items including electronics, clothing, and accessories. We also have a blog where users can post reviews and share their experiences with our products. Its mainly for retro and vintage items."
    }
  },
  {
    question: "Whos the coolest guy ever?",
    answer: async() => {
        return "You are!"
    }
  },
];

export default function Page() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuestionClick = async (index) => {
    setSelectedQuestion(index);
    setLoading(true);
    try {
      const result = await supportQuestions[index].answer();
      setAnswer(result);
    } catch (error) {
      setAnswer("An error occurred while fetching the answer.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-10">
      <h2 className="text-2xl font-bold mb-4">Support Chat</h2>
      <p className="text-md mb-5 text-stone-600 font-mono">Welcome to our support chat! Select one of the options below to receive answers regarding our most commonly asked questions</p>
      
      <div className="w-full max-w-md">
        {supportQuestions.map((item, index) => (
          <div key={index} className="mb-4">
            <button
              className="w-full text-left p-2 bg-yellow-200 hover:bg-yellow-300 rounded"
              onClick={() => handleQuestionClick(index)}
            >
              {item.question}
            </button>
            {selectedQuestion === index && (
              <p className="mt-2 p-2 bg-gray-100 rounded">
                {loading ? 'Loading...' : answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}