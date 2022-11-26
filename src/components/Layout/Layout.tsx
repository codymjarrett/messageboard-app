import React from 'react'
import Link from 'next/link'

import Header from './Header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <Header />

      <div className="h-screen bg-gray-100 pt-6">
        <div className="w-5/12 mx-auto ">{children}</div>
      </div>
    </div>
  )
}
