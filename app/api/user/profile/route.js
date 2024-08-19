//app/api/user/profile/route.js

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

    const userData = {
      username: user.username,
      email: user.email,
      avatarURL: user.avatarURL,
      lastLogin: user.loginActivity[user.loginActivity.length - 1]?.datetime,
      createdAt: user.createdAt, // You might need to add this field when creating a user
      accountStatus: 'Active', // You might want to add an actual status field to your user data
    };

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Error fetching user data' }, { status: 500 });
  }
}