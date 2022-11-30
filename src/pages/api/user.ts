import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../db'

export default async function userHandler(
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
      const { name, picture, email, sub, nickname } = req.body

      try {
        const duplicateUser = await prisma.user.findFirst({
          where: {
            username: nickname,
            email,
          },
        })

        if (duplicateUser) {
          console.log({ duplicateUser })
          return res
            .status(400)
            .json({ success: false, message: 'Duplicate credentials' }) // conflict
        }

        try {
          const user = await prisma.user.create({
            data: {
              name,
              username: nickname,
              email,
              profile_pic: picture,
              sub,
            },
          })
          res.status(201).json({ success: true, user })
        } catch (error) {
          const customError = {
            ...(error as Error),
          }
          res.status(500).json({ success: false, message: customError.message })
        }
      } catch (error) {
        const customError = {
          ...(error as Error),
        }
        res.status(500).json({ success: false, message: customError.message })
      }
    }
  }
}
