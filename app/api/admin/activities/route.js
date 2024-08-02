import { NextResponse } from 'next/server';
import { verifyToken } from '../../../utils/authMiddleware';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

async function getAllUserActivities() {
  const files = await fs.readdir(DATA_DIR);
  const activities = [];

  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(DATA_DIR, file);
      const data = await fs.readFile(filePath, 'utf8');
      const userData = JSON.parse(data);
      
      activities.push(...(userData.loginActivity || []).map(activity => ({
        ...activity,
        username: userData.username
      })));
    }
  }

  return activities.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
}

export async function GET(request) {
  const token = request.cookies.get('token');
  
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const decoded = verifyToken(token.value);
  if (!decoded || decoded.username !== 'admin') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  try {
    const activities = await getAllUserActivities();
    return NextResponse.json(activities, { status: 200 });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Error fetching activities' }, { status: 500 });
  }
}