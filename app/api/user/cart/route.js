//app/api/user/cart/route.js


import { NextResponse } from 'next/server';
import { verifyToken } from '../../../utils/authMiddleware';
import { addLoginActivity } from '../../../utils/userManager';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data/users/');
const ITEMS_DATA_DIR = path.join(process.cwd(), 'data/items/');

async function getItemDetails(itemId) {
  try {
    const files = await fs.readdir(ITEMS_DATA_DIR);
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


async function getUserData(username) {
  const filePath = path.join(DATA_DIR, `${username}.json`);
  try {
    const data = await fs.readFile(filePath, 'utf8');
    console.log(`Raw data for ${username}:`, data);
    try {
      return JSON.parse(data);
    } catch (parseError) {
      console.error(`JSON parse error for ${username}:`, parseError);
      console.error('Error position:', parseError.position);
      console.error('JSON substring around error:',
        data.substring(Math.max(0, parseError.position - 20),
                       Math.min(data.length, parseError.position + 20)));
      throw parseError;
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { username, cart: [] };
    }
    console.error(`Error reading file for ${username}:`, error);
    throw error;
  }
}

async function saveUserData(username, data) {
  const filePath = path.join(DATA_DIR, `${username}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function GET(request) {
  const token = request.cookies.get('token');
  
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const decoded = verifyToken(token.value);
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const userData = await getUserData(decoded.username);
    return NextResponse.json(userData.cart, { status: 200 });
  } catch (error) {
    console.error('Error fetching cart data:', error);
    return NextResponse.json({ error: 'Error fetching cart data' }, { status: 500 });
  }
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

  try {
    const item = await request.json();
    const userData = await getUserData(decoded.username);
    
    // Fetch the latest item details
    const latestItemDetails = await getItemDetails(item.id);
    if (!latestItemDetails) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const existingItemIndex = userData.cart.findIndex(cartItem => cartItem.id === item.id);
    if (existingItemIndex !== -1) {
      userData.cart[existingItemIndex] = {
        ...latestItemDetails,
        quantity: userData.cart[existingItemIndex].quantity + item.quantity
      };
    } else {
      userData.cart.push({
        ...latestItemDetails,
        quantity: item.quantity
      });
    }

    await saveUserData(decoded.username, userData);
    await addLoginActivity(decoded.username, `Added item ${latestItemDetails.name} to cart`);

    return NextResponse.json(userData.cart, { status: 200 });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json({ error: 'Error adding item to cart' }, { status: 500 });
  }
}