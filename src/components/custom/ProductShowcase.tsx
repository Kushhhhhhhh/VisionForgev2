import { Marquee } from "@/components/ui/marquee"
import { cn } from "@/lib/utils"
import { images } from "@/data/data"

const firstRow = images.slice(0, images.length / 2);
const secondRow = images.slice(images.length / 2);

const ImageCard = ({ src }: { src: string }) => {
  return (
    <div
      className={cn(
        "relative w-64 h-40 cursor-pointer overflow-hidden",
      )}
    >
      <img
        src={src}
        alt="AI-generated visual"
        className="h-full w-full object-cover rounded-lg"
      />
    </div>
  );
};

export default function ProductShowcase() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden">
  
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((src, index) => (
          <ImageCard key={index} src={src} />
        ))}
      </Marquee>

      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((src, index) => (
          <ImageCard key={index} src={src} />
        ))}
      </Marquee>

    </div>
  );
}