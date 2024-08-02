import { NextResponse } from 'next/server';

let items = [
  { id: 1, name: "Vintage T-Shirt", description: "A cool retro t-shirt", image: "/images/tshirt.jpg", price: 19.99 },
  { id: 2, name: "Classic Jeans", description: "Comfortable and stylish jeans", image: "/images/jeans.jpg", price: 49.99 },
  { id: 3, name: "Retro Sneakers", description: "Throwback sneakers for everyday wear", image: "/images/sneakers.jpg", price: 79.99 },
];

export async function GET() {
  return NextResponse.json(items);
}

export async function POST(request) {
  const newItem = await request.json();
  newItem.id = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  items.push(newItem);
  return NextResponse.json(newItem, { status: 201 });
}

export async function PUT(request) {
  const updatedItem = await request.json();
  const index = items.findIndex(item => item.id === updatedItem.id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updatedItem };
    return NextResponse.json(items[index]);
  }
  return NextResponse.json({ error: 'Item not found' }, { status: 404 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get('id'));
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    const deletedItem = items.splice(index, 1)[0];
    return NextResponse.json(deletedItem);
  }
  return NextResponse.json({ error: 'Item not found' }, { status: 404 });
}