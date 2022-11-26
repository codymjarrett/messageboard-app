import Link from 'next/link'

export default function Header() {
  return (
    <header className="h-12 flex items-center mx-10">
      <h1 className="font-sans mr-auto text-2xl ">
        <Link href="/">
          <span style={{ fontFamily: 'Comfortaa' }}>Post Dat'</span>
        </Link>
      </h1>
      <ul className="flex h-full items-center list-none ">
        <li>
          <button className="rounded-full text-blue-600 px-8 py-1 border-blue-600 border-solid border-2">
            Sign Up
          </button>
        </li>
        <li className="ml-6">
          <button className="rounded-full bg-blue-600 text-white px-8 py-1">
            Login In
          </button>
        </li>
        <li></li>
      </ul>
    </header>
  )
}
