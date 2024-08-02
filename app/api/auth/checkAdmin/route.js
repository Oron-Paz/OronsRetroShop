// app/api/auth/checkAdmin/route.js
import { NextResponse } from 'next/server';
import { verifyToken } from '../../../utils/authMiddleware';

export async function GET(request) {
  const token = request.cookies.get('token');
  
  if (!token) {
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }

  const decoded = verifyToken(token.value);
  if (!decoded || decoded.username !== 'admin') {
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }

  return NextResponse.json({ isAdmin: true }, { status: 200 });
}
