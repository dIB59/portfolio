"use client"

import { Suspense, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { CarScene } from "@/components/car-scene"
import { Loader } from "lucide-react"

export default function Home() {
  const [completedZones, setCompletedZones] = useState<string[]>([])

  const handleZoneComplete = (zoneId: string) => {
    setCompletedZones((prev) => [...prev, zoneId])
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Loader className="h-8 w-8 animate-spin text-orange-400" />
          </div>
        }
      >
        <Canvas
          shadows
          camera={{
            position: [15, 15, 15],
            fov: 50,
            near: 0.1,
            far: 1000,
          }}
          className="h-full w-full"
        >
          <CarScene onZoneComplete={handleZoneComplete} />
        </Canvas>
      </Suspense>

      {/* Score display */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2">
        <div className="rounded-lg bg-white/90 px-6 py-3 backdrop-blur-sm border-2 border-orange-200 shadow-lg">
          <p className="font-mono text-lg text-orange-600 font-bold text-center">Zones: {completedZones.length} / 4</p>
        </div>
      </div>

      {/* Controls UI */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <div className="rounded-lg bg-white/90 px-6 py-4 backdrop-blur-sm border-2 border-orange-200 shadow-lg">
          <p className="font-mono text-sm text-orange-600 font-medium">WASD or Arrow Keys to Drive Car</p>
          <p className="mt-1 font-mono text-xs text-orange-400">Space to Brake • Hold Space + Turn to Drift</p>
          <p className="mt-2 font-mono text-xs text-orange-500">Park on zones for 3 seconds to complete them</p>
        </div>
      </div>
    </div>
  )
}
