'use client'

import { motion } from 'framer-motion'
import { UserButton } from '@clerk/nextjs'

export default function ProfileHeader() {
  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center my-12"
    >
      <div className="inline-block rounded-full bg-indigo-100 p-3 mb-4">
        <UserButton appearance={{
              elements: {
                userButtonAvatarBox: "h-16 w-16",
              },
            }} />
      </div>
      <h1 className="text-4xl font-bold text-indigo-900 mb-2">Your AI Creations</h1>
      <p className="text-xl text-blue-800">Explore and manage your generated masterpieces</p>
    </motion.section>
  )
}