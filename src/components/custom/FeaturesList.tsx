import { features } from "@/data/data"

export default function FeaturesList() {
  return (
    <section className="max-w-5xl mx-auto py-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Why Choose Our Vision Forge?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <feature.icon className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}