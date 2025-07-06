// app/api/reminders/route.ts
import { NextResponse } from 'next/server'

// Dummy data to simulate reminders
const reminders = [
  { id: 1, title: 'Drink Water', time: '08:00 AM' },
  { id: 2, title: 'Morning Walk', time: '06:30 AM' },
  { id: 3, title: 'Read Book', time: '09:00 PM' }
]

export async function GET() {
  return NextResponse.json(reminders)
}
