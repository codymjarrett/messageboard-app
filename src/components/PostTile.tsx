import Image from 'next/image'
import { Post, Comment } from '../types'

type ActionLabelType = 'comment' | 'like'

interface Action {
  iconPath: string
  alt: string
  iconWidth: number
  iconHeight: number
  label?: string
  type: ActionLabelType
}

const actions: Action[] = [
  {
    type: 'like',
    iconPath: 'thumbs-up-outline.svg',
    iconWidth: 18,
    iconHeight: 18,
    label: 'Like',
    alt: 'Like',
  },
  {
    type: 'comment',
    iconPath: 'comment.svg',
    iconWidth: 18,
    iconHeight: 18,
    alt: 'Comments',
    label: 'Comment',
  },
]

function Action({ iconPath, alt, iconWidth, iconHeight, label }: Action) {
  return (
    <button className="flex items-center px-3 hover:bg-gray-200">
      <span>
        <Image
          src={`/${iconPath}`}
          width={iconWidth}
          height={iconHeight}
          alt={alt}
        />
      </span>
      <span className="ml-2">{label && <span>{label}</span>}</span>
    </button>
  )
}

function Actions({ actions }: { actions: Action[] }) {
  return (
    <div className="flex justify-evenly">
      {actions.map((action) => {
        return <Action key={action.type} {...action} />
      })}
    </div>
  )
}

interface PostTile {
  text: string
  username: string
  profilePic: string
  topic: string
  comments: Comment[]
  createdAt: string
}

export default function PostTile({
  text,
  username,
  profilePic,
  topic,
  comments,
  createdAt,
}: PostTile) {
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
      <div className="flex justify-end">
        <div>{`${comments.length} comments`}</div>
      </div>
      <div className="mt-4 py-3 border-t border-b border-gray-300">
        <Actions actions={actions} />
      </div>
    </div>
  )
}
