import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(request, { params }) {
  const { id } = params; // Extract the id from the route
  const filePath = path.join(process.cwd(), 'data', 'jobs.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  let jobs = JSON.parse(fileContents);
  
  jobs = jobs.filter(job => job.id !== parseInt(id));
  
  fs.writeFileSync(filePath, JSON.stringify(jobs, null, 2));
  
  return NextResponse.json({ message: 'Job deleted successfully' });
}
