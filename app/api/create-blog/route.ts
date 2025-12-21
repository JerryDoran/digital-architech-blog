import { NextResponse } from 'next/server';

export async function POST() {
  // make sure to add authentication logic and validation logic
  console.log('Hello from the POST route');
  return NextResponse.json({ success: true });
}
