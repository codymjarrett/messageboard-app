import React from 'react'
import Header from './Header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <Header />

      <div className="pt-6">
        <div className="mx-auto mb-10 max-w-screen-md">{children}</div>
      </div>
    </div>
  )
}
