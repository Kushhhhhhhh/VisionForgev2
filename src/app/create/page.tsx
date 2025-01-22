import CreateForm from "@/components/custom/CreateForm"
import CreativityBubbles from "@/components/custom/CreativityBubbles"

export default function CreatePage() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <CreativityBubbles />
      <div className="max-w-5xl mx-auto">
        <div className="p-6 md:p-8 relative z-10">
          <CreateForm />
        </div>
      </div>
    </main>
  )
}