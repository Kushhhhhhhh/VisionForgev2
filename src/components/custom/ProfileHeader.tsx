'use client'

import { UserButton } from '@clerk/nextjs'

export default function ProfileHeader() {
  return (
    <section className="text-center my-12">
      <div className="inline-block rounded-full bg-indigo-100 p-3 mb-4 min-h-[88px] min-w-[88px]">
        <UserButton appearance={{
              elements: {
                userButtonAvatarBox: "h-16 w-16",
              },
            }} />
      </div>
      <h1 className="text-4xl font-bold text-indigo-900 mb-2">Your AI Creations</h1>
      <p className="text-xl text-blue-800">Explore and manage your generated masterpieces</p>
    </section>
  )
}
