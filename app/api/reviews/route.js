//app/api/reviews/route.js

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyToken } from '../../utils/authMiddleware';

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

export async function GET() {
  const reviews = getReviews();
  return NextResponse.json(reviews);
}

export async function POST(request) {
  const token = request.cookies.get('token');
  
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const decoded = verifyToken(token.value);
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { message } = await request.json();
  const reviews = getReviews();
  const newReview = {
    id: Date.now().toString(),
    message,
    likes: 0,
    dislikes: 0,
    username: decoded.username
  };

  reviews.unshift(newReview);
  if (reviews.length > 9) {
    reviews.pop();
  }

  saveReviews(reviews);
  return NextResponse.json(newReview, { status: 201 });
}