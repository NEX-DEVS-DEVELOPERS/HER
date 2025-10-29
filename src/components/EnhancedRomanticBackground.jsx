import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';

// GPU Detection Hook
const useGPUDetection = () => {
  const [gpuCapability, setGpuCapability] = useState('high');

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      setGpuCapability('none');
      return;
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      // Simple heuristic for GPU capability
      if (renderer.includes('Intel') && !renderer.includes('Iris')) {
        setGpuCapability('low');
      } else if (renderer.includes('Mali') || renderer.includes('Adreno')) {
        setGpuCapability('medium');
      }
    }
  }, []);

  return gpuCapability;
};

// Falling Heart Particle
function FallingHeart({ position, speed = 1, ...props }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x + 0.5, y + 0.5);
    shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
    shape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
    shape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
    shape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
    shape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1, y);
    shape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);
    return shape;
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    meshRef.current.position.y -= speed * delta * 0.75;
    meshRef.current.rotation.x += delta * 0.4;
    meshRef.current.rotation.y += delta * 0.25;

    if (meshRef.current.position.y < -12) {
      meshRef.current.position.y = 12;
      meshRef.current.position.x = (Math.random() - 0.5) * 18;
    }

    const smoothScale = hovered ? 1.12 : 1;
    meshRef.current.scale.x = THREE.MathUtils.damp(meshRef.current.scale.x, smoothScale, 6, delta);
    meshRef.current.scale.y = meshRef.current.scale.x;
    meshRef.current.scale.z = meshRef.current.scale.x;
  });

  const extrudeSettings = {
    depth: 0.1,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 1,
    bevelSize: 0.05,
    bevelThickness: 0.05
  };

  return (
    <Float speed={0.8} rotationIntensity={0.35} floatIntensity={0.35} {...props}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <extrudeGeometry args={[heartShape, extrudeSettings]} />
        <meshStandardMaterial
          color="#ffb6c1"
          emissive="#ff9ac8"
          emissiveIntensity={hovered ? 0.18 : 0.06}
          metalness={0.15}
          roughness={0.35}
          transparent={false}
        />
      </mesh>
    </Float>
  );
}

// Particle System
function HeartParticleSystem({ count = 20, gpuCapability }) {
  const hearts = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 20,
        Math.random() * 20 - 10,
        (Math.random() - 0.5) * 10
      ],
      speed: 0.5 + Math.random() * 1.5
    }));
  }, [count]);

  // Adjust particle count based on GPU capability
  const adjustedCount = gpuCapability === 'low' ? 5 : gpuCapability === 'medium' ? 10 : count;

  return (
    <>
      {hearts.slice(0, adjustedCount).map((heart, index) => (
        <FallingHeart
          key={index}
          position={heart.position}
          speed={heart.speed}
        />
      ))}
    </>
  );
}

// Main Component
export default function EnhancedRomanticBackground() {
  const gpuCapability = useGPUDetection();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fallback for no GPU support
  if (gpuCapability === 'none') {
    return (
      <div className="fallback-background">
        <div className="gradient-overlay"></div>
      </div>
    );
  }

  return (
    <div className="enhanced-background">
      <Canvas
        camera={{ position: [0, 0, 11], fov: 55 }}
        frameloop="always"
        gl={{
          antialias: true,
          powerPreference: 'high-performance'
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#f8f2f7');
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        dpr={gpuCapability === 'low' ? 0.75 : gpuCapability === 'medium' ? 1.25 : 2}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[8, 12, 10]} intensity={0.8} color="#ffe5ec" />
        <pointLight position={[-12, -10, -8]} intensity={0.35} color="#ff89c4" />
        
        {/* Mouse-following light */}
        <pointLight
          position={[mousePosition.x * 5, mousePosition.y * 5, 5]}
          intensity={0.2}
          color="#ffffff"
        />
        
        <HeartParticleSystem count={20} gpuCapability={gpuCapability} />
        
        {/* Stars background - reduced for performance */}
        <Stars
          radius={80}
          depth={40}
          count={gpuCapability === 'low' ? 800 : 2200}
          factor={1.6}
          saturation={0}
          fade
          speed={0.25}
        />
      </Canvas>
    </div>
  );
}