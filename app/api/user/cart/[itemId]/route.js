//app/api/user/cart/[itemId]/route.js

import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../utils/authMiddleware';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

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
    
    userData.cart = userData.cart.filter(item => item.id !== parseInt(itemId));

    await saveUserData(decoded.username, userData);
    return NextResponse.json(userData.cart, { status: 200 });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json({ error: 'Error removing item from cart' }, { status: 500 });
  }
}