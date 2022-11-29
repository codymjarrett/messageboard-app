import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../db'

export default async function topicHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  switch (method) {
    case 'GET': {
      const topics = await prisma.topic.findMany()
      res.json({ success: true, data: topics })
    }
    case 'POST': {
      const { title } = req.body

      const createdTopic = await prisma.topic.create({
        data: {
          title,
        },
      })

      res.json({ success: true, data: createdTopic })
    }
  }
}
