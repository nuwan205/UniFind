
import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Individual floating object components
const FloatingKey = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.7) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef} position={position}>
        {/* Key shaft */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
          <meshPhongMaterial color="#FFD700" />
        </mesh>
        {/* Key head */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.2, 8]} />
          <meshPhongMaterial color="#FFD700" />
        </mesh>
        {/* Key teeth */}
        <mesh position={[0.3, -0.8, 0]}>
          <boxGeometry args={[0.3, 0.2, 0.1]} />
          <meshPhongMaterial color="#FFD700" />
        </mesh>
        <mesh position={[0.3, -0.4, 0]}>
          <boxGeometry args={[0.2, 0.2, 0.1]} />
          <meshPhongMaterial color="#FFD700" />
        </mesh>
      </group>
    </Float>
  );
};

const FloatingBook = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.6) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.7}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[1.5, 2, 0.3]} />
        <meshPhongMaterial color="#8B5CF6" />
      </mesh>
    </Float>
  );
};

const FloatingPhone = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.9) * 0.2;
      groupRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 1.2) * 0.3;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
      <group ref={groupRef} position={position}>
        {/* Phone body */}
        <mesh>
          <boxGeometry args={[1, 2, 0.2]} />
          <meshPhongMaterial color="#1F2937" />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0, 0.11]}>
          <boxGeometry args={[0.8, 1.6, 0.01]} />
          <meshPhongMaterial color="#14B8A6" emissive="#14B8A6" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </Float>
  );
};

const FloatingBag = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.25;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });

  return (
    <Float speed={1.3} rotationIntensity={0.6} floatIntensity={0.4}>
      <group ref={groupRef} position={position}>
        {/* Bag body */}
        <mesh>
          <boxGeometry args={[2, 2.5, 1]} />
          <meshPhongMaterial color="#DC2626" />
        </mesh>
        {/* Handle */}
        <mesh position={[0, 1.8, 0]}>
          <torusGeometry args={[0.8, 0.1, 8, 16]} />
          <meshPhongMaterial color="#7F1D1D" />
        </mesh>
      </group>
    </Float>
  );
};

const FloatingCard = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.1) * 0.4;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.8) * 0.2;
    }
  });

  return (
    <Float speed={2.2} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[1.6, 1, 0.05]} />
        <meshPhongMaterial color="#FBBF24" />
      </mesh>
    </Float>
  );
};

// Main component
const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
      <pointLight position={[10, -10, 10]} intensity={0.5} color="#14B8A6" />
      
      {/* Floating objects positioned around the scene */}
      <FloatingKey position={[-6, 2, -3]} />
      <FloatingBook position={[5, -1, -2]} />
      <FloatingPhone position={[-4, -3, 2]} />
      <FloatingBag position={[6, 3, 1]} />
      <FloatingCard position={[-7, -2, 4]} />
      <FloatingKey position={[3, 4, -4]} />
      <FloatingBook position={[-2, 1, 3]} />
      <FloatingPhone position={[7, -4, -1]} />
    </>
  );
};

const FloatingObjects = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default FloatingObjects;
