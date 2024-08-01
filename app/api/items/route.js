import { NextResponse } from 'next/server';

// This is a mock database. In a real application, you would fetch this data from a database.
const items = [
  { id: 1, title: "Vintage T-Shirt", description: "A cool retro t-shirt", imageUrl: "/images/tshirt.jpg", price: 19.99 },
  { id: 2, title: "Classic Jeans", description: "Comfortable and stylish jeans", imageUrl: "/images/jeans.jpg", price: 49.99 },
  { id: 3, title: "Retro Sneakers", description: "Throwback sneakers for everyday wear", imageUrl: "/images/sneakers.jpg", price: 79.99 },
  // Add more items as needed
];

export async function GET() {
  return NextResponse.json(items);
}