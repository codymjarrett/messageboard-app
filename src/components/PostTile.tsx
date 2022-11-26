import Image from 'next/image'
import { Post, Comment } from '../types'

type ActionLabelType = 'comment' | 'save'

interface Action {
  iconPath: string
  alt: string
  iconWidth: number
  iconHeight: number
  label?: string
  type: ActionLabelType
}

interface Actions {
  numOfComments: number
}

const actions: Action[] = [
  {
    type: 'comment',
    iconPath: 'comment.svg',
    iconWidth: 14,
    iconHeight: 14,
    alt: 'Comments',
  },
  {
    type: 'save',
    iconPath: 'bookmark-outline.svg',
    iconWidth: 10,
    iconHeight: 10,
    label: 'Save',
    alt: 'Save',
  },
]

function getActionLabel(type: ActionLabelType, props: Actions) {
  if (type === 'comment' && 'numOfComments' in props) {
    return `${props.numOfComments} comments`
  }
}

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
      <span className="ml-2">
        <span>{label}</span>
      </span>
    </button>
  )
}

function Actions(props: Actions) {
  return (
    <div className="flex justify-evenly">
      {actions.map((action) => {
        const label = action.label
          ? action.label
          : getActionLabel(action.type, props)
        return <Action key={action.type} {...action} label={label} />
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
}

export default function PostTile({
  text,
  username,
  profilePic,
  topic,
  comments,
}: PostTile) {
  return (
    <div
      className="bg-white w-5/12 mx-auto"
      style={{ fontFamily: 'Roboto Slab' }}
    >
      <div className="ml-4">t/{topic}</div>
      <div className="text-lg font-sans text-center">{text}</div>
      <div className="flex mt-4 items-center justify-center">
        <Image src={profilePic} alt="" width={30} height={30} />
        <span className="ml-3">u/{username}</span>
      </div>
      <div className="py-2">
        <Actions numOfComments={comments?.length} />
      </div>
    </div>
  )
}
