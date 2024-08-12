import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../utils/authMiddleware';
import { addLoginActivity } from '../../../../utils/userManager';

import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data/users/');
const ITEMS_DATA_DIR = path.join(process.cwd(), 'data/items/'); // Assuming you have a directory for items data

async function getUserData(username) {
  const filePath = path.join(DATA_DIR, `${username}.json`);
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { username, cart: [] };
    }
    throw error;
  }
}

async function saveUserData(username, data) {
  const filePath = path.join(DATA_DIR, `${username}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function getItemDetails(itemId) {
  try {
    const files = await fs.readdir(ITEMS_DATA_DIR);
    // Find the file that matches the itemId
    const fileName = files.find(file => file.startsWith(`${itemId}-`));
    
    if (!fileName) {
      return null; // Item not found
    }
    
    const filePath = path.join(ITEMS_DATA_DIR, fileName);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading item details:', error);
    throw error;
  }
}

export async function DELETE(request, { params }) {
  const token = request.cookies.get('token');
  
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const decoded = verifyToken(token.value);
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const { itemId } = params;
    const userData = await getUserData(decoded.username);
    
    // Fetch the item details
    const itemDetails = await getItemDetails(itemId);

    // Remove the item from the cart
    const removedItem = userData.cart.find(item => item.id === parseInt(itemId));
    userData.cart = userData.cart.filter(item => item.id !== parseInt(itemId));

    await saveUserData(decoded.username, userData);

    let name;
    if (itemDetails) {
      name = itemDetails.name;
    } else if (removedItem) {
      name = removedItem.name;
    } else {
      name = 'Unknown Item (removed from store)';
    }

    await addLoginActivity(decoded.username, `Removed ${name} from cart`);

    return NextResponse.json(userData.cart, { status: 200 });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json({ error: 'Error removing item from cart' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const token = request.cookies.get('token');
  
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const decoded = verifyToken(token.value);
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const { itemId } = params;
    const { quantity } = await request.json();
    const userData = await getUserData(decoded.username);
    
    // Find the item in the cart
    const itemIndex = userData.cart.findIndex(item => item.id === parseInt(itemId));

    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
    }

    // Update the quantity
    userData.cart[itemIndex].quantity = quantity;

    // Fetch the item details
    const itemDetails = await getItemDetails(itemId);

    await saveUserData(decoded.username, userData);

    const name = itemDetails ? itemDetails.name : 'Unknown Item (possibly removed)';

    await addLoginActivity(decoded.username, `Updated quantity of ${name} in cart to ${quantity}`);

    return NextResponse.json(userData.cart, { status: 200 });
  } catch (error) {
    console.error('Error updating item quantity in cart:', error);
    return NextResponse.json({ error: 'Error updating item quantity in cart' }, { status: 500 });
  }
}
