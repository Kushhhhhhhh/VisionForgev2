import CreateForm from "@/components/custom/CreateForm"
import InteractiveGrid from "@/components/animated/InteractiveGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Stunning AI-Generated Images - VisionForge",
  description:
    "Unleash your creativity on VisionForge's 'Create' page. Transform simple prompts into breathtaking AI-generated visuals. Perfect for designers, marketers, and creatives looking for high-quality, effortless image creation.",
  keywords:
    "create AI images, AI image generation, VisionForge create, stunning visuals, free AI-generated images, image creation tool, high-quality graphics, AI art, creative design tool, visual design AI, marketers tools, designer tools, AI-powered images, free image creation, effortless design",
};

export default function CreatePage() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <InteractiveGrid />
      <div className="max-w-5xl mx-auto">
        <div className="p-6 md:p-8 relative z-10">
          <CreateForm />
        </div>
      </div>
    </main>
  )
}