import { NextResponse } from 'next/server';
import { verifyToken } from '../../../utils/authMiddleware';
import { getUser, updateUser } from '../../../utils/userManager';

export async function POST(request) {
  const token = request.cookies.get('token');
  
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const decoded = verifyToken(token.value);
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { avatarURL } = await request.json();

  try {
    const user = await getUser(decoded.username);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await updateUser(decoded.username, { avatarURL });
    return NextResponse.json({ message: 'Avatar updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating avatar:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}