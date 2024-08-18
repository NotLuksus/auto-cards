'use client'

import { rngFloat, SeedArray } from '@/game/seed'
import { Html, Stars } from '@react-three/drei'
import { Canvas, Euler, useFrame, Vector3 } from '@react-three/fiber'
import { range } from 'lodash-es'
import { ReactNode, useRef } from 'react'
import { Mesh } from 'three/src/Three.js'

// FROM: https://teampilot.ai/team/tristan/chat/eacdf40de2b8991cac2577c4b3d7a8d4

const Card = ({ seed, children }: { seed: SeedArray; children: ReactNode }) => {
  const meshRef = useRef<Mesh | undefined>()

  const minY = -8
  const maxY = -1 * minY

  useFrame(() => {
    if (!meshRef.current) return
    // Apply continuous rotation
    meshRef.current.rotation.x += 0.01
    meshRef.current.rotation.y += 0.01
    meshRef.current.position.y -= 0.05 // Falling effect
    if (meshRef.current.position.y < minY) {
      meshRef.current.position.y = maxY // Reset to top
    }
  })

  const position: Vector3 = [
    rngFloat({ seed: [...seed, 'position', 'x'], min: -10, max: 10 }),
    rngFloat({ seed: [...seed, 'position', 'y'], min: minY, max: maxY }),
    rngFloat({ seed: [...seed, 'position', 'z'], min: -5, max: 2 }),
  ]

  const rotation = range(3).map(
    (idx) => rngFloat({ seed: [...seed, 'rotation', idx] }) * Math.PI,
  ) as Euler

  return (
    <mesh ref={meshRef as any} position={position} rotation={rotation}>
      <planeGeometry args={[1, 1.5]} />
      <meshBasicMaterial attach="material" color="white"></meshBasicMaterial>
      <Html transform>{children}</Html>
    </mesh>
  )
}

export const TitleScreenClient = ({ children }: { children: ReactNode[] }) => {
  return (
    <Canvas style={{ position: 'fixed', inset: 0 }}>
      <Stars />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {children.map((child, idx) => (
        <Card key={idx} seed={[idx]}>
          {child}
        </Card>
      ))}
    </Canvas>
  )
}
