"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { carState } from "./car"

const PARTICLE_COUNT = 800

interface Particle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  lifetime: number
  maxLifetime: number
  scale: number
}

export function DustParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      position: new THREE.Vector3(0, -100, 0),
      velocity: new THREE.Vector3(),
      lifetime: 0,
      maxLifetime: 1,
      scale: 1,
    }))
  }, [])

  const nextParticle = useRef(0)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const spawnTimer = useRef(0)

  useFrame((_, delta) => {
    if (!meshRef.current) return

    const dt = Math.min(delta, 0.03)
    const speed = Math.abs(carState.speed)
    const isMoving = speed > 0.05

    if (isMoving) {
      const baseRate = speed * 25
      const driftBonus = carState.isDrifting ? 350 : 0
      const spawnRate = baseRate + driftBonus

      spawnTimer.current += spawnRate * dt

      while (spawnTimer.current >= 1) {
        spawnTimer.current -= 1

        const p = particles[nextParticle.current]
        nextParticle.current = (nextParticle.current + 1) % PARTICLE_COUNT

        const wheelOffsets = [
          { x: 0.7, z: -0.9, weight: carState.isDrifting ? 0.4 : 0.3 },
          { x: -0.7, z: -0.9, weight: carState.isDrifting ? 0.4 : 0.3 },
          { x: 0.7, z: 0.7, weight: 0.15 },
          { x: -0.7, z: 0.7, weight: 0.15 },
        ]

        const rand = Math.random()
        let cumWeight = 0
        let wheel = wheelOffsets[0]
        for (const w of wheelOffsets) {
          cumWeight += w.weight
          if (rand < cumWeight) {
            wheel = w
            break
          }
        }

        const cosDir = Math.cos(carState.direction)
        const sinDir = Math.sin(carState.direction)

        const randX = (Math.random() - 0.5) * 0.4
        const randZ = (Math.random() - 0.5) * 0.4

        p.position.set(
          carState.position.x + (wheel.x + randX) * cosDir - (wheel.z + randZ) * sinDir,
          0.05 + Math.random() * 0.15,
          carState.position.z + (wheel.x + randX) * sinDir + (wheel.z + randZ) * cosDir,
        )

        const spreadAmount = carState.isDrifting ? 10 : 5
        const upAmount = carState.isDrifting ? 6 : 4

        p.velocity.set(
          (Math.random() - 0.5) * spreadAmount - carState.velocity.x * 0.4,
          Math.random() * upAmount + 2,
          (Math.random() - 0.5) * spreadAmount - carState.velocity.z * 0.4,
        )

        p.maxLifetime = carState.isDrifting ? 4 : 3
        p.lifetime = p.maxLifetime
        p.scale = carState.isDrifting ? 1.5 + Math.random() * 1 : 0.8 + Math.random() * 0.6
      }
    }

    // Update all particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i]

      if (p.lifetime > 0) {
        p.position.x += p.velocity.x * dt
        p.position.y += p.velocity.y * dt
        p.position.z += p.velocity.z * dt

        p.velocity.y -= 1.5 * dt

        // Air drag
        p.velocity.x *= 0.99
        p.velocity.z *= 0.99

        // Ground collision
        if (p.position.y < 0.1) {
          p.position.y = 0.1
          p.velocity.y *= -0.05
          p.velocity.x *= 0.3
          p.velocity.z *= 0.3
        }

        p.lifetime -= dt

        const lifeRatio = p.lifetime / p.maxLifetime
        const fadeOut = Math.pow(lifeRatio, 0.3)
        const currentScale = p.scale * fadeOut

        dummy.position.copy(p.position)
        dummy.scale.setScalar(Math.max(0.01, currentScale))
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
      } else {
        dummy.position.set(0, -100, 0)
        dummy.scale.setScalar(0.01)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <icosahedronGeometry args={[0.6, 0]} />
      <meshStandardMaterial color="#d4a574" transparent opacity={0.85} flatShading roughness={1} />
    </instancedMesh>
  )
}
