import { verifyToken } from '../../../utils/authMiddleware';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const token = request.cookies.get('token');
  
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const decoded = verifyToken(token.value);
  if (!decoded) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Assuming the decoded token contains user information
  const user = {
    id: decoded.userId,
    username: decoded.username,
    // Add any other user properties you want to include
  };

  return NextResponse.json({ authenticated: true, user }, { status: 200 });
}