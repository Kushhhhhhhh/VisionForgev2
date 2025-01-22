import ProductShowcase from "@/components/custom/ProductShowcase"
import FeaturesList from "@/components/custom/FeaturesList"
import CallToAction from "@/components/custom/CallToAction"

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