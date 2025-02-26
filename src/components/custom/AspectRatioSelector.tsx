import type React from 'react'
import { Square, RectangleVerticalIcon as Rectangle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { RectangleHorizontal } from 'lucide-react'

export type AspectRatio = "1:1" | "16:9" | "4:3"

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio
  onRatioChange: (ratio: AspectRatio) => void
}

export function AspectRatioSelector({ selectedRatio, onRatioChange }: AspectRatioSelectorProps) {
  const ratios: { value: AspectRatio; icon: React.ComponentType; label: string }[] = [
    { value: "1:1", icon: Square, label: "Square" },
    { value: "16:9", icon: RectangleHorizontal, label: "Landscape" },
    { value: "4:3", icon: Rectangle, label: "Portrait" },
  ]

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {ratios.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          variant={selectedRatio === value ? "default" : "outline"}
          className="flex flex-col items-center gap-1 p-3 h-auto"
          onClick={() => onRatioChange(value)}
        >
          <Icon className="w-6 h-6" />
          <span className="text-xs">{label}</span>
          <span className="text-xs text-muted-foreground">{value}</span>
        </Button>
      ))}
    </div>
  )
}