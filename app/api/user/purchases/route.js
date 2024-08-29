// pages/api/user/purchase.js

import { NextResponse } from 'next/server';
import { verifyToken } from '../../../utils/authMiddleware';
import { addLoginActivity, getUser } from '../../../utils/userManager';

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
    const user = await getUser(decoded.username);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { items, totalAmount } = await request.json();

    await addLoginActivity(user.username, 'Purchased Cart', { items, totalAmount });
    
    return NextResponse.json({ message: 'Purchase recorded successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error recording purchase:', error);
    return NextResponse.json({ error: 'Failed to record purchase' }, { status: 500 });
  }
}