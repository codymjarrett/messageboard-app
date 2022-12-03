import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  switch (method) {
    case 'POST': {
      const { query, body } = req
      const { text, sub, nickname, email, name, picture } = body

      try {
        // check if user is in DB
        const userExists = await prisma.user.findFirst({
          where: {
            username: nickname,
            email,
          },
        })
        // if user, use user, otherwise create a new user
        const user = userExists
          ? userExists
          : await prisma.user.create({
              data: {
                name,
                username: nickname,
                email,
                profile_pic: picture,
                sub,
              },
            })

        try {
          // create post
          const createdPost = await prisma.comment.create({
            data: {
              text,
              userId: user?.id,
              postId: query.postId as string,
            },
          })
          res.json({ success: true, data: createdPost })
        } catch (error) {
          console.log(error)
        }
      } catch (error) {
        console.log(error)
      }

      res.json({ success: false, data: { error: 'Something went wrong' } })

      break
    }
  }
}
