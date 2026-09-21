import Reveal from "@/components/custom/Reveal"
import Link from "next/link"

const checkIcon = (
  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)

export default function SecondaryCallToAction() {
  return (
    <section className="py-20 bg-white">
      <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 md:p-12 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Unleash Your <span className="text-yellow-300">Creativity</span> Today
          </h2>

          <p className="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
            Experience the easiest way to create professional-quality visuals with AI. No design skills required.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/create"
              className="inline-block bg-white text-indigo-700 font-bold py-4 px-10 rounded-full text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Start Creating Free
            </Link>

            <Link
              href="/gallery"
              className="inline-block bg-transparent border-2 border-white text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              See Examples
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4 text-indigo-100 text-sm md:text-base">
            <div className="flex items-center">
              {checkIcon}
              <span>No credit card needed</span>
            </div>
            <div className="flex items-center">
              {checkIcon}
              <span>Commercial use allowed</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
