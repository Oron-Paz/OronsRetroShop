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

export async function GET() {
  const reviews = getReviews();
  return NextResponse.json(reviews);
}

export async function POST(request) {
  const { message } = await request.json();
  const reviews = getReviews();
  const newReview = {
    id: Date.now().toString(),
    message,
    likes: 0,
    dislikes: 0
  };

  reviews.unshift(newReview);
  if (reviews.length > 10) {
    reviews.pop();
  }

  saveReviews(reviews);
  return NextResponse.json(newReview, { status: 201 });
}