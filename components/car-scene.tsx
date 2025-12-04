"use client"

import { Suspense, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Car } from "./car"
import { Ground } from "./ground"
import { Roads } from "./roads"
import { DustParticles } from "./dust-particles"
import { AreaZones } from "./area-zones"
import { Village } from "./village"
import type * as THREE from "three"

interface CarSceneProps {
	onZoneComplete?: (zoneId: string) => void
}

export function CarScene({ onZoneComplete }: CarSceneProps) {
	const lightRef = useRef<THREE.DirectionalLight>(null)

	useFrame(({ camera }) => {
		if (lightRef.current) {
			lightRef.current.position.x = camera.position.x + 10
			lightRef.current.position.z = camera.position.z + 10
		}
	})

	return (
		<Suspense>
			{/* Warm cozy lighting */}
			<ambientLight intensity={0.6} color="#fff5e0" />
			<directionalLight
				ref={lightRef}
				position={[10, 20, 10]}
				intensity={1.2}
				color="#fff0d4"
				castShadow
				shadow-mapSize-width={2048}
				shadow-mapSize-height={2048}
				shadow-camera-far={80}
				shadow-camera-left={-40}
				shadow-camera-right={40}
				shadow-camera-top={40}
				shadow-camera-bottom={-40}
			/>
			<hemisphereLight intensity={0.4} color="#ffe4c4" groundColor="#98d4a0" />

			<color attach="background" args={["#ffecd2"]} />
			<fog attach="fog" args={["#ffecd2", 60, 140]} />

			{/* Ground */}
			<Ground />

			{/* Roads */}
			<Roads />

			<Village />

			{/* Area Zones */}
			<AreaZones onZoneComplete={onZoneComplete} />

			{/* Car */}
			<Car />

			{/* Dust Particles */}
			<DustParticles />
		</Suspense>
	)
}
