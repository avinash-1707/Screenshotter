'use client'

import { Slider } from '@/components/ui/Slider'

type Props = {
  padding: number
  borderRadius: number
  onPaddingChange: (v: number) => void
  onBorderRadiusChange: (v: number) => void
}

export default function Sliders({ padding, borderRadius, onPaddingChange, onBorderRadiusChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <Slider label="Padding" value={padding} min={0} max={60} unit="%" onChange={onPaddingChange} />
      <Slider label="Roundness" value={borderRadius} min={0} max={80} unit="px" onChange={onBorderRadiusChange} />
    </div>
  )
}
