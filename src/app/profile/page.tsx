import type { Metadata } from "next"
import ProfileHeader from "@/components/custom/ProfileHeader"
import ImageGrid from "@/components/custom/ImageGrid"

export const metadata: Metadata = {
  title: "Your AI Creations | Profile",
  description: "View and manage your AI-generated images",
}

export default function ProfilePage() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ProfileHeader />
        <ImageGrid />
      </div>
    </main>
  )
}