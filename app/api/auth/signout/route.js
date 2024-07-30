// app/api/auth/signout/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  return response;
}
