import type { CSSProperties } from "react"
import {
  Camera,
  Image,
  Palette,
  Wand2,
  Sparkles,
  Brush,
  Layers,
  Shapes,
  Lightbulb,
  Zap,
  Aperture,
  Compass,
} from "lucide-react"

// x/y are three waypoints (in vw / vh) each icon travels between, like the original random paths.
const icons = [
  { Icon: Camera, delay: 0, duration: 20, x: [8, 62, 30], y: [70, 15, 55] },
  { Icon: Image, delay: 2, duration: 15, x: [85, 20, 55], y: [25, 80, 40] },
  { Icon: Palette, delay: 1, duration: 18, x: [40, 90, 12], y: [10, 60, 85] },
  { Icon: Wand2, delay: 3, duration: 22, x: [15, 48, 82], y: [50, 90, 20] },
  { Icon: Sparkles, delay: 0.5, duration: 17, x: [70, 10, 45], y: [85, 35, 10] },
  { Icon: Brush, delay: 2.5, duration: 19, x: [30, 78, 5], y: [20, 70, 60] },
  { Icon: Layers, delay: 1.5, duration: 21, x: [92, 35, 65], y: [55, 8, 75] },
  { Icon: Shapes, delay: 3.5, duration: 16, x: [50, 5, 88], y: [80, 45, 15] },
  { Icon: Lightbulb, delay: 0.7, duration: 23, x: [22, 68, 40], y: [12, 65, 90] },
  { Icon: Zap, delay: 2.7, duration: 14, x: [75, 28, 95], y: [40, 88, 30] },
  { Icon: Aperture, delay: 1.2, duration: 20, x: [5, 55, 72], y: [90, 30, 50] },
  { Icon: Compass, delay: 3.2, duration: 18, x: [60, 92, 18], y: [5, 55, 78] },
]

const FloatingIcons = () => (
  <div
    aria-hidden="true"
    className="absolute inset-0 pointer-events-none overflow-hidden motion-reduce:hidden"
  >
    {icons.map(({ Icon, delay, duration, x, y }, index) => {
      const timing = { animationDuration: `${duration}s`, animationDelay: `${delay}s` }
      const path = {
        ...timing,
        "--x1": `${x[0]}vw`, "--x2": `${x[1]}vw`, "--x3": `${x[2]}vw`,
        "--y1": `${y[0]}vh`, "--y2": `${y[1]}vh`, "--y3": `${y[2]}vh`,
      } as CSSProperties

      return (
        <div key={index} className="floating-path absolute left-0 top-0" style={path}>
          <div className="floating-fade" style={timing}>
            <Icon className="w-8 h-8 text-indigo-600 opacity-50" />
          </div>
        </div>
      )
    })}
  </div>
)

export default FloatingIcons
