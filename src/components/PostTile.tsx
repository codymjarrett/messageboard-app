import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { Post, Comment as CommentType, Like } from '../types'
import { Divider, Textarea, Button } from '@chakra-ui/react'
import { useUser } from '@auth0/nextjs-auth0'
import axios from 'axios'

import Comment from './Comment'
import { useQuery, useMutation } from '@tanstack/react-query'
import queryClient from '../queryClient'

type ActionLabelType = 'comment' | 'like'

interface Action {
  iconPath: string
  alt: string
  iconWidth: number
  iconHeight: number
  label?: string
  type: ActionLabelType
  disabled?: boolean
  onClick: () => void
}
interface PostTile {
  text: string
  username: string
  profilePic: string
  topic: string
  comments: CommentType[]
  likes: Like[]
  createdAt: string
  postId: string
  refetchPosts: () => void
}

interface LikeVariables {
  sub: string
  postId?: string
  commentId?: string
}

async function createComment({
  text,
  sub,
  postId,
  nickname,
  email,
  name,
  picture,
}: {
  text: string
  sub: string
  postId: string
  nickname: string
  email: string
  name: string
  picture: string
}) {
  const response = await axios.post(`/api/comment/?postId=${postId}`, {
    text,
    sub,
  })

  return response.data
}

const likeAction = {
  type: 'like' as ActionLabelType,
  iconPath: 'thumbs-up-outline.svg',
  iconWidth: 18,
  iconHeight: 18,
  label: 'Like',
  alt: 'Like',
}
const commentAction = {
  type: 'comment' as ActionLabelType,
  iconPath: 'comment.svg',
  iconWidth: 18,
  iconHeight: 18,
  alt: 'Comments',
  label: 'Comment',
}

function Action({
  iconPath,
  alt,
  iconWidth,
  iconHeight,
  label,
  disabled,
  onClick,
}: Action) {
  return (
    <div className="flex items-center justify-center">
      <Button disabled={disabled} variant="ghost" px="10" onClick={onClick}>
        <span>
          <Image
            src={`/${iconPath}`}
            width={iconWidth}
            height={iconHeight}
            alt={alt}
          />
        </span>
        <span className="ml-2">{label && <span>{label}</span>}</span>
      </Button>
    </div>
  )
}

export default function PostTile({
  text,
  username,
  profilePic,
  topic,
  comments,
  createdAt,
  postId,
  refetchPosts,
}: PostTile) {
  const { user, error, isLoading: userIsLoading } = useUser()
  const userLoggedIn = user !== undefined

  const commentTextareaRef = useRef<HTMLTextAreaElement>(null)

  const [comment, setComment] = useState('')

  const { mutate: createCommentMutation, isLoading: commentIsLoading } =
    useMutation({
      mutationFn: createComment,
      onSettled: () => refetchPosts(),
    })

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!comment) return

    if (event.key === 'Enter') {
      setComment('')
      commentTextareaRef?.current?.blur()
      return createCommentMutation({
        text: comment,
        sub: user?.sub as string,
        postId,
        nickname: user?.nickname as string,
        email: user?.email as string,
        name: user?.name as string,
        picture: user?.picture as string,
      })
    }
  }

  const hasComments = !!comments?.length

  return (
    <div
      className="bg-white px-6 pt-2 pb-6 rounded-lg border-gray-200 border"
      style={{ fontFamily: 'Roboto Slab' }}
    >
      <div className="flex justify-between ">
        <div>t/{topic}</div>
        <div className="text-gray-400 text-sm">
          {`${new Date(createdAt).toLocaleDateString()}, ${new Date(
            createdAt
          ).toLocaleTimeString()}`}
        </div>
      </div>
      <div className="text-lg font-sans text-center">{text}</div>
      <div className="flex mt-4 items-center justify-center">
        <Image src={profilePic} alt="" width={30} height={30} />
        <span className="ml-3">u/{username}</span>
      </div>
      <div className="flex justify-between">
        {hasComments && <div>{`${comments?.length} comments`}</div>}
      </div>
      <div className="mt-4">
        <Divider />
        <div className="flex justify-center">
          <Action
            {...commentAction}
            disabled={!userLoggedIn}
            onClick={() => commentTextareaRef?.current?.focus()}
          />
        </div>
        <Divider />
      </div>
      <div>
        {hasComments &&
          comments?.map((comment) => {
            return (
              <Comment
                id={comment.id}
                text={comment.text}
                user={comment.user}
                key={comment.id}
              />
            )
          })}
      </div>
      {userLoggedIn && (
        <div className="mt-4 flex items-center">
          <div>
            <Image
              src={user?.picture as string}
              width={40}
              height={40}
              className="rounded-full"
              alt="profile image"
            />
          </div>
          <div className="ml-4 w-full">
            <Textarea
              placeholder="Comment on dat' post..."
              resize="none"
              variant="filled"
              ref={commentTextareaRef}
              onKeyDown={handleKeyDown}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                setComment(event.currentTarget.value)
              }
              value={comment}
            />
          </div>
        </div>
      )}
    </div>
  )
}
