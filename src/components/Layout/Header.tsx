import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@auth0/nextjs-auth0'

export default function Header() {
  const { user, error, isLoading } = useUser()

  const userLoggedIn = user !== undefined

  console.log({ user })

  return (
    <header className="h-12 flex items-center mx-10">
      <h1 className="font-sans mr-auto text-2xl ">
        <Link href="/">
          <div className="flex items-center">
            <Image src="/logo.svg" alt="stupid logo" width={50} height={50} />
            <span
              style={{ fontFamily: 'Comfortaa', fontWeight: 'bold' }}
              className="ml-4 text-xl"
            >
              Post Dat&apos;
            </span>
          </div>
        </Link>
      </h1>
      <ul className="flex h-full items-center list-none ">
        <li className="ml-6">
          {userLoggedIn && (
            <Link
              href="/newpost"
              className="rounded-full bg-blue-600 text-white px-8 py-1"
            >
              Create Post
            </Link>
          )}
        </li>
        <li className="ml-6">
          <Link
            href={userLoggedIn ? '/api/auth/logout' : '/api/auth/login'}
            className="rounded-full bg-blue-600 text-white px-8 py-1"
          >
            {userLoggedIn ? 'Logout' : 'Login'}
          </Link>
        </li>
      </ul>
    </header>
  )
}
