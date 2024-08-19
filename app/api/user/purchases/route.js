//app/api/user/purchases/route.js

import { NextResponse } from 'next/server';
import { verifyToken } from '../../../utils/authMiddleware';
import { getUser } from '../../../utils/userManager';

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
    const user = await getUser(decoded.username);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user.purchases, { status: 200 });
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    return NextResponse.json({ error: 'Error fetching user purchases' }, { status: 500 });
  }
}