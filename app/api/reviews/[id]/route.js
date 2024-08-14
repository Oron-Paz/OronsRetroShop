import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

  const reviews = getReviews();
  const reviewIndex = reviews.findIndex(review => review.id.toString() === id);

  if (reviewIndex === -1) {
    return NextResponse.json({ message: 'Review not found' }, { status: 404 });
  }

  const review = reviews[reviewIndex];

  if (action === 'like') {
    if (review.userAction === 'like') {
      review.likes -= 1;
      review.userAction = null;
    } else {
      if (review.userAction === 'dislike') {
        review.dislikes -= 1;
      }
      review.likes += 1;
      review.userAction = 'like';
    }
  } else if (action === 'dislike') {
    if (review.userAction === 'dislike') {
      review.dislikes -= 1;
      review.userAction = null;
    } else {
      if (review.userAction === 'like') {
        review.likes -= 1;
      }
      review.dislikes += 1;
      review.userAction = 'dislike';
    }
  } else {
    return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
  }

  saveReviews(reviews);
  return NextResponse.json(review);
}