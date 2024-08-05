import { NextResponse } from 'next/server';
import { verifyToken } from '../../../utils/authMiddleware';
import { getUser, updateUser } from '../../../utils/userManager';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  const token = request.cookies.get('token');
  
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const decoded = verifyToken(token.value);
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const formData = await request.formData();
  let avatarURL;

  try {
    const user = await getUser(decoded.username);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (formData.has('avatar')) {
      const file = formData.get('avatar');
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Save the file
      const filename = `${decoded.username}_${Date.now()}${path.extname(file.name)}`;
      const filepath = path.join(process.cwd(), 'public', 'avatar', filename);
      await writeFile(filepath, buffer);
      avatarURL = `/avatar/${filename}`;
    } else if (formData.has('avatarURL')) {
      avatarURL = formData.get('avatarURL');
    } else {
      return NextResponse.json({ error: 'No avatar provided' }, { status: 400 });
    }

    await updateUser(decoded.username, { avatarURL });
    return NextResponse.json({ message: 'Avatar updated successfully', avatarURL }, { status: 200 });
  } catch (error) {
    console.error('Error updating avatar:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}