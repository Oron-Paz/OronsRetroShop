// pages/api/items.js
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const itemsDirectory = path.join(process.cwd(), 'data', 'items');

async function getItems() {
  const fileNames = await fs.readdir(itemsDirectory);
  const items = await Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = path.join(itemsDirectory, fileName);
      const fileContents = await fs.readFile(filePath, 'utf8');
      return JSON.parse(fileContents);
    })
  );
  return items;
}

export async function GET() {
  const items = await getItems();
  return NextResponse.json(items);
}

export async function POST(request) {
  const newItem = await request.json();
  const items = await getItems();
  newItem.id = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  const fileName = `${newItem.id}-${newItem.name.toLowerCase().replace(/\s+/g, '-')}.json`;
  await fs.writeFile(path.join(itemsDirectory, fileName), JSON.stringify(newItem, null, 2));
  return NextResponse.json(newItem, { status: 201 });
}

export async function PUT(request) {
  const updatedItem = await request.json();
  const items = await getItems();
  const index = items.findIndex(item => item.id === updatedItem.id);
  if (index !== -1) {
    const fileName = `${updatedItem.id}-${updatedItem.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    await fs.writeFile(path.join(itemsDirectory, fileName), JSON.stringify(updatedItem, null, 2));
    return NextResponse.json(updatedItem);
  }
  return NextResponse.json({ error: 'Item not found' }, { status: 404 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get('id'));
  const items = await getItems();
  const item = items.find(item => item.id === id);
  if (item) {
    const fileName = `${item.id}-${item.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    await fs.unlink(path.join(itemsDirectory, fileName));
    return NextResponse.json(item);
  }
  return NextResponse.json({ error: 'Item not found' }, { status: 404 });
}