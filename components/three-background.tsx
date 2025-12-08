"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useRef, useMemo, useEffect, useState } from "react"
import * as THREE from "three"

function createCircleTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext("2d")!

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, "rgba(128, 128, 128, 1)")
  gradient.addColorStop(0.5, "rgba(128, 128, 128, 0.8)")
  gradient.addColorStop(1, "rgba(128, 128, 128, 0)")

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(32, 32, 32, 0, Math.PI * 2)
  ctx.fill()

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

function useMousePosition() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return mouse
}

function InteractiveParticles({
  mouse,
  circleTexture,
}: { mouse: { x: number; y: number }; circleTexture: THREE.Texture }) {
  const pointsRef = useRef<THREE.Points>(null)
  const { viewport } = useThree()

  const particlesCount = 2000

  const { positions, velocities, originalPositions } = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3)
    const vel = new Float32Array(particlesCount * 3)
    const orig = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount; i++) {
      const x = (Math.random() - 0.5) * 30
      const y = (Math.random() - 0.5) * 50
      const z = (Math.random() - 0.5) * 10

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      orig[i * 3] = x
      orig[i * 3 + 1] = y
      orig[i * 3 + 2] = z

      vel[i * 3] = 0
      vel[i * 3 + 1] = 0
      vel[i * 3 + 2] = 0
    }
    return { positions: pos, velocities: vel, originalPositions: orig }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return

    const positionAttribute = pointsRef.current.geometry.attributes.position
    const posArray = positionAttribute.array as Float32Array

    const mouseX = mouse.x * viewport.width * 0.5
    const mouseY = mouse.y * viewport.height * 0.5

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3

      const x = posArray[i3]
      const y = posArray[i3 + 1]
      const z = posArray[i3 + 2]

      const dx = x - mouseX
      const dy = y - mouseY
      const dist = Math.sqrt(dx * dx + dy * dy)

      const interactionRadius = 3

      if (dist < interactionRadius && dist > 0.1) {
        const force = (1 - dist / interactionRadius) * 0.03
        velocities[i3] += (dx / dist) * force
        velocities[i3 + 1] += (dy / dist) * force
      }

      const origX = originalPositions[i3]
      const origY = originalPositions[i3 + 1]
      const origZ = originalPositions[i3 + 2]

      velocities[i3] += (origX - x) * 0.003
      velocities[i3 + 1] += (origY - y) * 0.003
      velocities[i3 + 2] += (origZ - z) * 0.002

      velocities[i3] *= 0.92
      velocities[i3 + 1] *= 0.92
      velocities[i3 + 2] *= 0.92

      posArray[i3] += velocities[i3]
      posArray[i3 + 1] += velocities[i3 + 1]
      posArray[i3 + 2] += velocities[i3 + 2]

      posArray[i3 + 1] += Math.sin(state.clock.elapsedTime * 0.08 + i * 0.05) * 0.0003
    }

    positionAttribute.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particlesCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.25}
        color="#aaaaaa"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        map={circleTexture}
        alphaMap={circleTexture}
      />
    </points>
  )
}

function ParticleConnections({
  mouse,
  circleTexture,
}: { mouse: { x: number; y: number }; circleTexture: THREE.Texture }) {
  const linesRef = useRef<THREE.LineSegments>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const { viewport } = useThree()

  const particlesCount = 40
  const maxConnections = 200

  const { positions, linePositions, pointPositions } = useMemo(() => {
    const pos: [number, number, number][] = []
    const pointPos = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount; i++) {
      const x = (Math.random() - 0.5) * 25
      const y = (Math.random() - 0.5) * 35
      const z = (Math.random() - 0.5) * 8 - 2
      pos.push([x, y, z])
      pointPos[i * 3] = x
      pointPos[i * 3 + 1] = y
      pointPos[i * 3 + 2] = z
    }
    return {
      positions: pos,
      linePositions: new Float32Array(maxConnections * 6),
      pointPositions: pointPos,
    }
  }, [])

  const velocities = useMemo(() => {
    return positions.map(() => [
      (Math.random() - 0.5) * 0.002,
      (Math.random() - 0.5) * 0.002,
      (Math.random() - 0.5) * 0.001,
    ])
  }, [positions])

  useFrame(() => {
    if (!linesRef.current || !pointsRef.current) return

    const mouseX = mouse.x * viewport.width * 0.5
    const mouseY = mouse.y * viewport.height * 0.5

    for (let i = 0; i < particlesCount; i++) {
      const dx = positions[i][0] - mouseX
      const dy = positions[i][1] - mouseY
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 3 && dist > 0.1) {
        const force = (1 - dist / 3) * 0.008
        velocities[i][0] += (dx / dist) * force
        velocities[i][1] += (dy / dist) * force
      }

      positions[i][0] += velocities[i][0]
      positions[i][1] += velocities[i][1]
      positions[i][2] += velocities[i][2]

      velocities[i][0] *= 0.985
      velocities[i][1] *= 0.985
      velocities[i][2] *= 0.985

      velocities[i][0] += (Math.random() - 0.5) * 0.0002
      velocities[i][1] += (Math.random() - 0.5) * 0.0002

      if (Math.abs(positions[i][0]) > 15) velocities[i][0] *= -0.8
      if (Math.abs(positions[i][1]) > 20) velocities[i][1] *= -0.8
      if (Math.abs(positions[i][2]) > 6) velocities[i][2] *= -0.8

      pointPositions[i * 3] = positions[i][0]
      pointPositions[i * 3 + 1] = positions[i][1]
      pointPositions[i * 3 + 2] = positions[i][2]
    }

    let connectionIndex = 0
    const connectionDistance = 4

    for (let i = 0; i < particlesCount && connectionIndex < maxConnections; i++) {
      for (let j = i + 1; j < particlesCount && connectionIndex < maxConnections; j++) {
        const dx = positions[i][0] - positions[j][0]
        const dy = positions[i][1] - positions[j][1]
        const dz = positions[i][2] - positions[j][2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < connectionDistance) {
          const idx = connectionIndex * 6
          linePositions[idx] = positions[i][0]
          linePositions[idx + 1] = positions[i][1]
          linePositions[idx + 2] = positions[i][2]
          linePositions[idx + 3] = positions[j][0]
          linePositions[idx + 4] = positions[j][1]
          linePositions[idx + 5] = positions[j][2]
          connectionIndex++
        }
      }
    }

    for (let i = connectionIndex * 6; i < maxConnections * 6; i++) {
      linePositions[i] = 0
    }

    linesRef.current.geometry.attributes.position.needsUpdate = true
    linesRef.current.geometry.setDrawRange(0, connectionIndex * 2)
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particlesCount} array={pointPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.35}
          color="#999999"
          transparent
          opacity={0.6}
          sizeAttenuation
          depthWrite={false}
          map={circleTexture}
          alphaMap={circleTexture}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={maxConnections * 2} array={linePositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#cccccc" transparent opacity={0.15} />
      </lineSegments>
    </>
  )
}

function Scene({ mouse }: { mouse: { x: number; y: number } }) {
  const [circleTexture, setCircleTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    setCircleTexture(createCircleTexture())
  }, [])

  if (!circleTexture) return null

  return (
    <>
      <color attach="background" args={["#ffffff"]} />
      <InteractiveParticles mouse={mouse} circleTexture={circleTexture} />
      <ParticleConnections mouse={mouse} circleTexture={circleTexture} />
    </>
  )
}

export function ThreeBackground() {
  const mouse = useMousePosition()

  return (
    <div className="fixed inset-0 z-0 pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 20], fov: 50 }} gl={{ antialias: true, alpha: false }} dpr={[1, 2]}>
        <Scene mouse={mouse} />
      </Canvas>
    </div>
  )
}
