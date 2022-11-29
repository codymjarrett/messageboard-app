import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../db'

export default async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  switch (method) {
    case 'GET': {
      const posts = await prisma.post.findMany({
        include: {
          user: true,
          topic: true,
          comments: true,
        },
      })
      res.json({ success: true, data: posts })
    }
    case 'POST': {
    }
  }
}
