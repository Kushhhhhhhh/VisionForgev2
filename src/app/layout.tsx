import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from "next/font/google";
import Header from '@/components/custom/Header'
import Footer from '@/components/custom/Footer'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: "VisionForge - Free Image Generation, AI Image Creation, Stunning Visuals",
  description: "VisionForge is a cutting-edge platform for free image generation, leveraging advanced AI to create stunning visuals effortlessly. Perfect for designers, marketers, and creatives seeking high-quality images.",
  keywords: "free image generation, AI image creation, stunning visuals, high-quality images, designers, marketers, creatives, advanced AI, VisionForge, image generation platform, free images, AI-powered visuals, high-quality graphics, image creation, AI, visual design, graphic design, image generation tool, image creation tool, AI tool, design tool, creative tool"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} antialiased`}
        >
          <Header />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}