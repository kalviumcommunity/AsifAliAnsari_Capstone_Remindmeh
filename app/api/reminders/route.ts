// app/api/reminders/route.ts
import { NextResponse } from 'next/server'

let reminders = [
  { id: 1, title: 'Drink Water', time: '08:00 AM' },
  { id: 2, title: 'Morning Walk', time: '06:30 AM' },
  { id: 3, title: 'Read Book', time: '09:00 PM' }
]

export async function GET() {
  return NextResponse.json(reminders)
}

export async function POST(req: Request) {
  const body = await req.json()
  const newReminder = {
    id: reminders.length + 1,
    title: body.title,
    time: body.time,
  }
  reminders.push(newReminder)
  return NextResponse.json({ message: 'Reminder added!', reminder: newReminder }, { status: 201 })
}

export async function PUT(req: Request) {
  const body = await req.json()
  const { id, title, time } = body

  const index = reminders.findIndex(reminder => reminder.id === id)

  if (index === -1) {
    return NextResponse.json({ error: 'Reminder not found' }, { status: 404 })
  }

  reminders[index] = { id, title, time }

  return NextResponse.json({ message: 'Reminder updated', reminder: reminders[index] })
}
