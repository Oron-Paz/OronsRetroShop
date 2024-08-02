// app/api/auth/signout/route.js
import { NextResponse } from 'next/server';
import { verifyToken } from '../../../utils/authMiddleware';
import { addLoginActivity } from '../../../utils/userManager'; // Make sure this import is correct

export async function POST(request) {
  const tokenCookie = request.cookies.get('token');
  
  if (!tokenCookie) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const decoded = verifyToken(tokenCookie.value);
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
  
  // Use the username from the decoded token
  await addLoginActivity(decoded.username, 'logout'); 
  return response;
}