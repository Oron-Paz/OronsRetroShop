import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'jobs.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const jobs = JSON.parse(fileContents);
  return NextResponse.json(jobs);
}

export async function POST(request) {
  const { title, description } = await request.json();
  const filePath = path.join(process.cwd(), 'data', 'jobs.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const jobs = JSON.parse(fileContents);
  const newJob = { id: Date.now(), title, description };
  jobs.push(newJob);
  fs.writeFileSync(filePath, JSON.stringify(jobs, null, 2));
  return NextResponse.json(newJob, { status: 201 });
}

export async function DELETE(request) {
  const id = request.url.split('/').pop(); // Extract the id from the URL path
  const filePath = path.join(process.cwd(), 'data', 'jobs.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  let jobs = JSON.parse(fileContents);
  
  jobs = jobs.filter(job => job.id !== parseInt(id));
  
  fs.writeFileSync(filePath, JSON.stringify(jobs, null, 2));
  
  return NextResponse.json({ message: 'Job deleted successfully' });
}
