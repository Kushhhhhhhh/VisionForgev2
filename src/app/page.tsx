import AnimatedBackground from "@/components/animated/AnimatedBackground"
import FloatingIcons from "@/components/animated/FloatingIcons"
import Reveal from "@/components/custom/Reveal"
import Link from "next/link"
import Image from "next/image"

const showcaseImages = Array.from({ length: 16 }, (_, i) => `/ai-image-${i + 1}.jpg`);

const showcasePrompts = [
  "Elephant standing in a calm lake",
  "Surreal giant ice cream machine",
  "Sushi-themed airplane in flight",
  "Ship shaped like a bunny",
  "Starbucks shop as a giant mug",
  "Thinker statue holding cotton candy",
  "Rabbit flying a strawberry plane",
  "Dancing Statue of Liberty",
  "Old man crafting jewelry",
  "Cat in a suit, smoking",
  "Lion in 3-piece suit in cabin",
  "Beautiful natural scenery",
  "Clock merged with waterfall",
  "Magician on flying chessboard",
  "Genie emerging from magic lamp",
  "Diamond-gold chess pieces with faces",
];

const features = [
  {
    title: "Lightning Fast",
    description: "Generate high-quality images in seconds with our optimized AI models",
    icon: "⚡",
  },
  {
    title: "No Watermarks",
    description: "All images are completely free to use without any branding",
    icon: "🖼️",
  },
  {
    title: "Multiple Styles",
    description: "Photorealistic, digital art, anime, fantasy, and more",
    icon: "🎨",
  },
  {
    title: "High Resolution",
    description: "Crisp, clear images suitable for any project",
    icon: "🔍",
  },
  {
    title: "Easy to Use",
    description: "Simple interface that anyone can master in minutes",
    icon: "✨",
  },
  {
    title: "Free Forever",
    description: "No hidden costs - we believe in accessible AI for everyone",
    icon: "💎",
  },
];

const checkIcon = (
  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

export default function Home() {
  return (
    <main className="min-h-screen py-20 relative overflow-hidden bg-white">
      <AnimatedBackground />
      <FloatingIcons />

      <div className="max-w-7xl mx-auto">

        <section className="space-y-6 text-center z-10">
          <div className="flex justify-center items-center my-10">
            <Link
              href="https://www.producthunt.com/products/vision-forge?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-vision&#0045;forge"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=834213&theme=dark&t=1738234916609"
                alt="Vision&#0032;Forge - Stunning&#0032;AI&#0045;generated&#0032;images&#0044;&#0032;just&#0032;a&#0032;click&#0032;away&#0046; | Product Hunt"
                width={250}
                height={54}
                decoding="async"
                className="object-cover"
              />
            </Link>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-gray-900">
            Create Stunning{" "}
            <br />
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-800">
              AI-Generated Images
            </span>
          </h1>

          <p className="mx-auto text-lg md:text-xl text-gray-700 max-w-3xl">
            Turn simple prompts into breathtaking AI-generated visuals. Unlock your creativity with the power of
            artificial intelligence and bring your ideas to life effortlessly.
          </p>

          <div>
            <Link
              href="/create"
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started - It&apos;s Free
            </Link>
          </div>
        </section>

        <section className="py-20 z-10 px-4">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Choose VisionForge?
            </h2>
            <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
              The most powerful free AI image generation platform
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Reveal key={feature.title} delayMs={(index % 3) * 100} className="h-full">
                <div className="h-full bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-purple-400 hover:-translate-y-1 transition-all shadow-sm">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 transform -skew-y-2 origin-top-left z-0" />

          <Reveal className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl mb-6">
                Ready to <span className="text-yellow-300">Transform</span> Your Ideas?
              </h2>

              <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-10">
                Join our community of 50,000+ creators generating stunning AI visuals every day. No credit card required.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/create"
                  className="inline-flex items-center justify-center bg-white text-indigo-600 font-bold py-4 px-10 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  Start Creating Now
                  <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>

                <Link
                  href="/gallery"
                  className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Explore Gallery
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center space-x-4 text-indigo-100">
                <div className="flex items-center">
                  {checkIcon}
                  <span>No watermarks</span>
                </div>
                <div className="flex items-center">
                  {checkIcon}
                  <span>Free forever</span>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="pt-10 z-10 px-4">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Gallery of Creations
            </h2>
            <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
              See what our community has created with VisionForge
            </p>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {showcaseImages.map((image, index) => (
              <Reveal key={image} delayMs={(index % 4) * 60}>
                <div className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-purple-500 hover:scale-105 transition-all shadow-sm">
                  <Image
                    src={image}
                    alt={`AI generated image: ${showcasePrompts[index]}`}
                    fill
                    className="object-cover group-hover:brightness-110 transition-all"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end p-4">
                    <span className="text-white font-medium">
                      Prompt: {showcasePrompts[index]}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
