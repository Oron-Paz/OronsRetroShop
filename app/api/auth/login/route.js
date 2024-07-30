// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { generateToken } from '../../../../utils/authMiddleware';

export async function POST(request) {
  const { username, password } = await request.json();

  // Verify credentials (replace with your actual auth logic)
  if (username === 'validuser' && password === 'validpassword') {
    const token = generateToken(username);
    
    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 3600, // 1 hour
      path: '/',
    });

    return response;
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}