import Image from 'next/image'

import { User } from '../types'

export default function Comment({
  id,
  user,
  text,
}: {
  id: string
  user: User
  text: string
}) {
  return (
    <div key={id} className="flex mt-4">
      <div>
        <Image
          src={user?.profile_pic as string}
          width={40}
          height={40}
          className="rounded-full"
          alt="profile image"
        />
      </div>
      <div className="ml-4 px-3 py-2 bg-slate-300 rounded-lg text-sm">
        <div className="font-semibold">{user?.username}</div>
        <div>{text}</div>
      </div>
    </div>
  )
}
