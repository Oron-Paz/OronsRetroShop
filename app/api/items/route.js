// pages/api/items/route.js
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const itemsDirectory = path.join(process.cwd(), 'data', 'items');

async function getItems() {
  try {
    const fileNames = await fs.readdir(itemsDirectory);
    const items = await Promise.all(
      fileNames.map(async (fileName) => {
        const filePath = path.join(itemsDirectory, fileName);
        const fileContents = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContents);
      })
    );
    return items;
  } catch (error) {
    console.error('Error reading items:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const items = await getItems();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const newItem = await request.json();
    const items = await getItems();
    newItem.id = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    const fileName = `${newItem.id}-${newItem.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    await fs.writeFile(path.join(itemsDirectory, fileName), JSON.stringify(newItem, null, 2));
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const updatedItem = await request.json();
    const items = await getItems();
    const existingItem = items.find(item => item.id === updatedItem.id);
    if (existingItem) {
      const oldFileName = `${existingItem.id}-${existingItem.name.toLowerCase().replace(/\s+/g, '-')}.json`;
      const newFileName = `${updatedItem.id}-${updatedItem.name.toLowerCase().replace(/\s+/g, '-')}.json`;
      
      // Delete old file if name has changed
      if (oldFileName !== newFileName) {
        await fs.unlink(path.join(itemsDirectory, oldFileName));
      }
      
      // Write new file
      await fs.writeFile(path.join(itemsDirectory, newFileName), JSON.stringify(updatedItem, null, 2));
      return NextResponse.json(updatedItem);
    }
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const id = Number(request.nextUrl.searchParams.get('id'));
    const items = await getItems();
    const item = items.find(item => item.id === id);
    if (item) {
      const fileName = `${item.id}-${item.name.toLowerCase().replace(/\s+/g, '-')}.json`;
      await fs.unlink(path.join(itemsDirectory, fileName));
      return NextResponse.json(item);
    }
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}