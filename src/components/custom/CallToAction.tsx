import Link from "next/link"

export default function CallToAction() {
  return (
    <section className="bg-gradient-to-r from-indigo-500 to-purple-500 py-16 mt-16">
      <div className="max-w-4xl mx-auto text-center px-4 pb-10 md:pb-6">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Ideas into Stunning Visuals?</h2>
        <p className="text-xl text-white mb-8">
          Join thousands of creators and businesses already using our AI image generator.
        </p>
        <Link
          href="/create"
          className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          Get Started for Free
        </Link>
      </div>
    </section>
  )
}