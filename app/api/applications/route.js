import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'applications.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const applications = JSON.parse(fileContents);
  return NextResponse.json(applications);
}

export async function POST(request) {
  const { jobId, applicant, message } = await request.json();
  const filePath = path.join(process.cwd(), 'data', 'applications.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const applications = JSON.parse(fileContents);
  const newApplication = { id: Date.now(), jobId, applicant, message, status: 'pending' };
  applications.push(newApplication);
  fs.writeFileSync(filePath, JSON.stringify(applications, null, 2));
  return NextResponse.json(newApplication, { status: 201 });
}

export async function PUT(request) {
  const { id, status } = await request.json();
  const filePath = path.join(process.cwd(), 'data', 'applications.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  let applications = JSON.parse(fileContents);
  applications = applications.map(app => app.id === id ? {...app, status} : app);
  fs.writeFileSync(filePath, JSON.stringify(applications, null, 2));
  return NextResponse.json({ message: 'Application updated successfully' });
}