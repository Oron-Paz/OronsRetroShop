//app/api/reviews/id/route.js

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyToken } from '../../../utils/authMiddleware';

const REVIEWS_FILE = path.join(process.cwd(), 'data', 'reviews.json');

function getReviews() {
  if (fs.existsSync(REVIEWS_FILE)) {
    const fileContents = fs.readFileSync(REVIEWS_FILE, 'utf8');
    try {
      return JSON.parse(fileContents);
    } catch (error) {
      console.error('Error parsing reviews JSON:', error);
      return [];
    }
  }
  return [];
}

function saveReviews(reviews) {
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
}

export async function POST(request, { params }) {
  const { id } = params;
  const { action } = await request.json();
  const token = request.cookies.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const decoded = verifyToken(token.value);
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const reviews = getReviews();
  const reviewIndex = reviews.findIndex(review => review.id.toString() === id);

  if (reviewIndex === -1) {
    return NextResponse.json({ message: 'Review not found' }, { status: 404 });
  }

  const review = reviews[reviewIndex];
  const userId = decoded.username;

  // Initialize userActions if it doesn't exist
  if (!review.userActions) {
    review.userActions = {};
  }

  const previousAction = review.userActions[userId];

  // Adjust like/dislike counts
  if (action === 'like') {
    if (previousAction === 'like') {
      // Remove like
      review.likes -= 1;
      review.userActions[userId] = null;
    } else {
      if (previousAction === 'dislike') {
        // Convert dislike to like
        review.dislikes -= 1;
      }
      review.likes += 1;
      review.userActions[userId] = 'like';
    }
  } else if (action === 'dislike') {
    if (previousAction === 'dislike') {
      // Remove dislike
      review.dislikes -= 1;
      review.userActions[userId] = null;
    } else {
      if (previousAction === 'like') {
        // Convert like to dislike
        review.likes -= 1;
      }
      review.dislikes += 1;
      review.userActions[userId] = 'dislike';
    }
  } else {
    return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
  }

  saveReviews(reviews);
  return NextResponse.json(review);
}


export async function DELETE(request, { params }) {
    const { id } = params;
  
    const reviews = getReviews();
    const updatedReviews = reviews.filter(review => review.id.toString() !== id);
  
    if (reviews.length === updatedReviews.length) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }
  
    saveReviews(updatedReviews);
    return NextResponse.json({ message: 'Review deleted successfully' });
  }