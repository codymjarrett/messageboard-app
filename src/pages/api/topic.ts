import type { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'

import prisma from '../../../db'

export default withApiAuthRequired(async function topicHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  const session = getSession(req, res)

  const userId = session?.user.sub

  console.log({ userId })

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
})
