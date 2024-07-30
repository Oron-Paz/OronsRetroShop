// app/api/user/profile/route.js
import { NextResponse } from 'next/server';
import { verifyToken } from '../../../utils/authMiddleware';

export async function GET(request) {
  const token = request.cookies.get('token');
  
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const decoded = verifyToken(token.value);
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // Only attempt to read user data if the token is valid
  try {
    // Replace this with your actual user data fetching logic
    const userData = { username: decoded.username, /* other user data */ };
    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Error fetching user data' }, { status: 500 });
  }
}