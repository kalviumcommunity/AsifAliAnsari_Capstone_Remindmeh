import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json([
      { id: 1, title: 'Drink Water', time: '08:00 AM' },
      { id: 2, title: 'Morning Walk', time: '06:30 AM' },
      { id: 3, title: 'Read Book', time: '09:00 PM' },
    ])
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
