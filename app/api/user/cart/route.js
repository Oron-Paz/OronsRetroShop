//app/api/user/cart/route.js

import { NextResponse } from 'next/server';
import { verifyToken } from '../../../utils/authMiddleware';
import fs from 'fs/promises';
import path from 'path';


const DATA_DIR = path.join(process.cwd(), 'data/users/');

async function getUserData(username) {
  const filePath = path.join(DATA_DIR,  `${username}.json`);
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
    
    const existingItemIndex = userData.cart.findIndex(cartItem => cartItem.id === item.id);
    if (existingItemIndex !== -1) {
      userData.cart[existingItemIndex].quantity += item.quantity;
    } else {
      userData.cart.push(item);
    }

    await saveUserData(decoded.username, userData);
    return NextResponse.json(userData.cart, { status: 200 });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json({ error: 'Error adding item to cart' }, { status: 500 });
  }
}

