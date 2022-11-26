import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
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
        <li>
          <Link
            href="/signup"
            className="rounded-full text-blue-600 px-8 py-1 border-blue-600 border-solid border-2"
          >
            Sign Up
          </Link>
        </li>
        <li className="ml-6">
          <Link
            href="/signin"
            className="rounded-full bg-blue-600 text-white px-8 py-1"
          >
            Login
          </Link>
        </li>
        <li></li>
      </ul>
    </header>
  )
}
