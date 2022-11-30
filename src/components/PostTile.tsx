import { useRef } from 'react'
import Image from 'next/image'
import { Post, Comment, Likes } from '../types'
import { Textarea, Button } from '@chakra-ui/react'
import { useUser } from '@auth0/nextjs-auth0'

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

interface PostTile {
  text: string
  username: string
  profilePic: string
  topic: string
  comments: Comment[]
  likes: Likes[]
  createdAt: string
}

export default function PostTile({
  text,
  username,
  profilePic,
  topic,
  likes,
  comments,
  createdAt,
}: PostTile) {
  const { user, error, isLoading: userIsLoading } = useUser()
  const userLoggedIn = user !== undefined

  const commentInputRef = useRef(null)

  return (
    <div
      className="bg-white px-6 py-2 rounded-lg border-gray-200 border"
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
        <div>{`${likes.length} likes`}</div>
        <div>{`${comments.length} comments`}</div>
      </div>
      <div className="border-t border-b border-gray-300 mt-4">
        <div className="flex justify-evenly">
          <Action {...likeAction} />
          <Action
            {...commentAction}
            disabled={!userLoggedIn}
            onClick={() => commentInputRef?.current?.focus()}
          />
        </div>
      </div>
      {userLoggedIn && (
        <div className="mt-4 flex items-center">
          <Image
            src={user?.picture as string}
            width={50}
            height={50}
            className="rounded-full"
            alt="profile image"
          />
          <div className="ml-4 w-full">
            <Textarea
              placeholder="Comment on dat' post..."
              resize="none"
              variant="filled"
              ref={commentInputRef}
            />
          </div>
        </div>
      )}
    </div>
  )
}
