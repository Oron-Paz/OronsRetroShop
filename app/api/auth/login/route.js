//app/api/auth/login/route.js

import { validateUser, addLoginActivity } from '../../../utils/userManager';
import { generateToken } from '../../../utils/authMiddleware';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { username, password, rememberMe } = await request.json();

  try {
    const isValid = await validateUser(username, password);
    if (!isValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken(username, rememberMe);
    
    const response = NextResponse.json({ message: 'Logged in successfully' }, { status: 200 });
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: rememberMe ? 10 * 24 * 60 * 60 : 30 * 60,
      path: '/'
    });
    
    await addLoginActivity(username, 'login'); 
    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Error logging in', error: error.message }, { status: 500 });
  }
}