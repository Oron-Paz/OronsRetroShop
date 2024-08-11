// app/api/items/upload/route.js

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
    try {
      const formData = await request.formData();
      const file = formData.get('image');
  
      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }
  
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
  
      // Sanitize the filename
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
      const fileName = `${Date.now()}-${sanitizedName}`;
      const filePath = path.join(process.cwd(), 'public', 'items', fileName);
  
      await fs.writeFile(filePath, buffer);
      return NextResponse.json({ imageUrl: `/items/${fileName}` }, { status: 200 });
    } catch (error) {
      console.error('Error saving file:', error);
      return NextResponse.json({ error: 'Error saving file' }, { status: 500 });
    }
  }