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
          comments: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      res.json({ success: true, data: posts })
      break
    }
    case 'POST': {
      /* check if user is in DB first, if not, create user. Then proceed to create post.*/
      const { text, topicId, name, picture, email, sub, nickname, topic } =
        req.body

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
          let _topicId = ''

          if (!topicId) {
            const newTopic = await prisma.topic.create({
              data: {
                title: topic,
              },
            })
            _topicId = newTopic?.id
          } else {
            _topicId = topicId
          }

          // create post
          const createdPost = await prisma.post.create({
            data: {
              text,
              userId: user?.id,
              topicId: _topicId,
            },
          })
          res.json({ success: true, data: createdPost })
        } catch (error) {
          console.log(error)
        }
      } catch (error) {
        console.log(error)
      }
      break
    }
  }
}
