import Gallery from "@/components/custom/Gallery";
import MotionProvider from "@/components/custom/MotionProvider";

export default function GalleryPage() {
  return (
    <main className="min-h-screen py-12">
      <MotionProvider>
        <Gallery />
      </MotionProvider>
    </main>
  );
}
