"use client"

export function Roads() {
  return (
    <group position={[0, 0.01, 0]}>
      {/* Main horizontal road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 5]} />
        <meshStandardMaterial color="#c9a87c" flatShading />
      </mesh>

      {/* Main vertical road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5, 80]} />
        <meshStandardMaterial color="#c9a87c" flatShading />
      </mesh>

      {/* Road markings - horizontal (cobblestone style) */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh key={`h-${i}`} position={[-35 + i * 5, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2, 0.2]} />
          <meshStandardMaterial color="#a88c5c" flatShading />
        </mesh>
      ))}

      {/* Road markings - vertical */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh key={`v-${i}`} position={[0, 0.02, -35 + i * 5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.2, 2]} />
          <meshStandardMaterial color="#a88c5c" flatShading />
        </mesh>
      ))}

      {/* Diagonal road */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[5, 100]} />
        <meshStandardMaterial color="#c9a87c" flatShading />
      </mesh>

      {/* Diagonal road markings */}
      {Array.from({ length: 18 }).map((_, i) => {
        const offset = -40 + i * 5
        const x = offset * Math.cos(Math.PI / 4)
        const z = offset * Math.sin(Math.PI / 4)
        return (
          <mesh key={`d-${i}`} position={[x, 0.02, z]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
            <planeGeometry args={[2, 0.2]} />
            <meshStandardMaterial color="#a88c5c" flatShading />
          </mesh>
        )
      })}
    </group>
  )
}
