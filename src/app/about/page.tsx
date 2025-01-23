import ProductShowcase from "@/components/custom/ProductShowcase"
import FeaturesList from "@/components/custom/FeaturesList"
import CallToAction from "@/components/custom/CallToAction"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About VisionForge - Your AI-Powered Image Generation Platform",
  description:
    "Learn about VisionForge, the innovative platform revolutionizing image generation with advanced AI technology. Discover our mission to empower creatives, designers, and marketers with free, high-quality visuals.",
  keywords:
    "about VisionForge, AI image platform, advanced AI tools, image generation technology, about us, VisionForge mission, creative tools, designer tools, marketer tools, high-quality visuals, AI-powered platform, free image generation, AI technology, innovative image creation, VisionForge story, AI creativity",
};

export default function About() {
  return (
    <main className="min-h-screen">
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center mb-8">Discover the Power of AI-Generated Images</h1>
        <ProductShowcase />
        <FeaturesList />
      </div>
      <CallToAction />
    </main>
  )
}