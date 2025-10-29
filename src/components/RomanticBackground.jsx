import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars, Sphere } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

// Floating Heart Component
function Heart({ position, scale = 1, ...props }) {
  const heartShape = useMemo(() => {
    const shape = new THREE.Shape()
    const x = 0
    const y = 0
    shape.moveTo(x + 0.5, y + 0.5)
    shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y)
    shape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7)
    shape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9)
    shape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7)
    shape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1, y)
    shape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5)
    return shape
  }, [])

  const extrudeSettings = {
    depth: 0.2,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 0.1,
    bevelThickness: 0.1
  }

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={0.5} {...props}>
      <mesh position={position} scale={scale}>
        <extrudeGeometry args={[heartShape, extrudeSettings]} />
        <meshStandardMaterial 
          color="#ff69b4" 
          emissive="#ff1493" 
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  )
}

// Particle System Component
function ParticleSystem() {
  const particlesRef = useRef()
  
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < 100; i++) {
      const x = (Math.random() - 0.5) * 20
      const y = (Math.random() - 0.5) * 20
      const z = (Math.random() - 0.5) * 20
      temp.push(x, y, z)
    }
    return new Float32Array(temp)
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffb6c1"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Main Romantic Background Component
export default function RomanticBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff69b4" />
        
        {/* Floating Hearts */}
        <Heart position={[-3, 2, 0]} scale={0.3} />
        <Heart position={[3, -1, 2]} scale={0.2} />
        <Heart position={[0, 3, -2]} scale={0.25} />
        <Heart position={[-2, -2, 1]} scale={0.15} />
        <Heart position={[4, 1, -1]} scale={0.35} />
        
        {/* Particle System */}
        <ParticleSystem />
        
        {/* Stars Background */}
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1}
        />
        
        {/* Floating Orbs */}
        <Float speed={3} rotationIntensity={0.5} floatIntensity={0.3}>
          <Sphere position={[2, -2, 3]} args={[0.3, 32, 32]}>
            <meshStandardMaterial 
              color="#ff1493" 
              emissive="#ff69b4" 
              emissiveIntensity={0.3}
              transparent
              opacity={0.7}
            />
          </Sphere>
        </Float>
        
        <Float speed={2} rotationIntensity={0.8} floatIntensity={0.4}>
          <Sphere position={[-3, 1, -3]} args={[0.2, 32, 32]}>
            <meshStandardMaterial 
              color="#ffb6c1" 
              emissive="#ffc0cb" 
              emissiveIntensity={0.4}
              transparent
              opacity={0.6}
            />
          </Sphere>
        </Float>
      </Canvas>
    </div>
  )
}