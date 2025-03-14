import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function createParametricStructures() {
  const structures = [];
  
  // Create central runway - 5 times thicker
  const runwayGeometry = new THREE.BoxGeometry(100, 2.5, 6);
  const runway = {
    geometry: runwayGeometry,
    position: [0, 6.25, 0],
    rotation: [0, 0, 0],
    type: 'runway'
  };
  structures.push(runway);

  // Create left structures - increased spread and density on left side
  for (let i = 0; i < 20; i++) { // Increased from 15 to 20
    const width = 5 + Math.random() * 15;
    const height = 0.2;
    const depth = 1 + Math.random() * 3;
    
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const position = [
      -25 - Math.random() * 15, // Moved further left and increased spread
      2 + i * 2,
      -30 + Math.random() * 60 // Increased z-range for more depth
    ];
    const rotation = [
      Math.random() * Math.PI * 0.2,
      Math.random() * Math.PI * 0.2,
      Math.random() * Math.PI * 0.5
    ];
    
    structures.push({ geometry, position, rotation, type: 'structure' });
  }

  // Create right structures - reduced density
  for (let i = 0; i < 10; i++) { // Reduced from 15 to 10
    const width = 5 + Math.random() * 15;
    const height = 0.2;
    const depth = 1 + Math.random() * 3;
    
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const position = [
      15 + Math.random() * 10,
      2 + i * 2,
      -20 + Math.random() * 40
    ];
    const rotation = [
      Math.random() * Math.PI * 0.2,
      Math.random() * Math.PI * 0.2,
      Math.random() * Math.PI * 0.5
    ];
    
    structures.push({ geometry, position, rotation, type: 'structure' });
  }

  // Create overhead structures - more concentrated on left
  for (let i = 0; i < 30; i++) {
    const length = 20 + Math.random() * 40;
    const width = 0.2;
    const height = 0.1;
    
    const geometry = new THREE.BoxGeometry(length, height, width);
    const position = [
      -40 + Math.random() * 70, // Shifted range to favor left side
      20 + Math.random() * 20,
      -20 + Math.random() * 40
    ];
    const rotation = [
      Math.random() * Math.PI * 0.1,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 0.1
    ];
    
    structures.push({ geometry, position, rotation, type: 'overhead' });
  }

  // Create underground structures - more concentrated on left
  for (let i = 0; i < 30; i++) {
    const length = 20 + Math.random() * 40;
    const width = 0.2;
    const height = 0.1;
    
    const geometry = new THREE.BoxGeometry(length, height, width);
    const position = [
      -40 + Math.random() * 70, // Shifted range to favor left side
      -10 - Math.random() * 20,
      -20 + Math.random() * 40
    ];
    const rotation = [
      Math.random() * Math.PI * 0.1,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 0.1
    ];
    
    structures.push({ geometry, position, rotation, type: 'underground' });
  }

  // Create diagonal connecting structures - more on left side
  for (let i = 0; i < 20; i++) { // Increased from 15 to 20
    const height = 15 + Math.random() * 10;
    const width = 0.1;
    
    const geometry = new THREE.CylinderGeometry(width, width, height, 6);
    const position = [
      -40 + Math.random() * 70, // Shifted range to favor left side
      -5 + height/2,
      -20 + Math.random() * 40
    ];
    const rotation = [
      Math.random() * 0.5 - 0.25,
      Math.random() * Math.PI * 2,
      Math.random() * 0.5 - 0.25
    ];
    
    structures.push({ geometry, position, rotation, type: 'connector' });
  }

  // Create vertical struts - more concentrated on left
  for (let i = 0; i < 20; i++) {
    const height = 10 + Math.random() * 30;
    const width = 0.1;
    
    const geometry = new THREE.CylinderGeometry(width, width, height, 6);
    const position = [
      -50 + i * 4, // Start further left
      5 + height/2,
      -2 + Math.random() * 4
    ];
    const rotation = [
      Math.random() * 0.2 - 0.1,
      0,
      Math.random() * 0.2 - 0.1
    ];
    
    structures.push({ geometry, position, rotation, type: 'strut' });
  }

  return structures;
}

function SimpleModel({ onSelect }) {
  const group = useRef();
  const walkProgress = useRef(0);
  
  const modelInfo = {
    name: "Model 1",
    outfit: "Parametric Design 2024",
    description: "Angular silhouettes with structural elements inspired by digital architecture and complex geometries."
  };

  // Create model materials
  const materials = useMemo(() => ({
    body: new THREE.MeshStandardMaterial({ 
      color: 0xeeeeee,
      roughness: 0.7,
      metalness: 0.3
    }),
    head: new THREE.MeshStandardMaterial({ 
      color: 0xf0d0b0,
      roughness: 0.5
    }),
    legs: new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      roughness: 0.6
    })
  }), []);

  useFrame((state) => {
    // Update walking animation - much slower pace
    walkProgress.current += 0.0008;
    if (walkProgress.current > 1) walkProgress.current = 0;

    // Move model along runway
    const x = -45 + walkProgress.current * 90;
    group.current.position.x = x;
    
    // Add more subtle bobbing motion - adjusted height for thicker runway
    group.current.position.y = 7.5 + Math.sin(state.clock.elapsedTime * 2) * 0.05;

    // Slower leg movement for graceful walk
    const legRotation = Math.sin(state.clock.elapsedTime * 2) * 0.2; // Reduced frequency and angle
    group.current.children.forEach((child, index) => {
      if (child.name === 'leg') {
        child.rotation.x = legRotation * (index === 0 ? 1 : -1);
      }
    });
  });

  const handleClick = (event) => {
    event.stopPropagation();
    if (onSelect) onSelect(modelInfo);
  };

  return (
    <group 
      ref={group} 
      position={[0, 7.5, 0]}
      rotation={[0, -Math.PI / 2, 0]}
      onClick={handleClick}
    >
      {/* Body */}
      <mesh 
        material={materials.body}
        castShadow
      >
        <cylinderGeometry args={[0.2, 0.15, 1, 8]} />
      </mesh>

      {/* Head */}
      <mesh 
        position={[0, 0.7, 0]} 
        material={materials.head}
        castShadow
      >
        <sphereGeometry args={[0.2, 16, 16]} />
      </mesh>

      {/* Legs */}
      <mesh 
        name="leg"
        position={[0, -0.6, 0.1]} 
        material={materials.legs}
        castShadow
      >
        <cylinderGeometry args={[0.06, 0.06, 0.7, 8]} />
      </mesh>
      <mesh 
        name="leg"
        position={[0, -0.6, -0.1]} 
        material={materials.legs}
        castShadow
      >
        <cylinderGeometry args={[0.06, 0.06, 0.7, 8]} />
      </mesh>
    </group>
  );
}

function ParametricStructure({ geometry, position, rotation, type }) {
  const material = useMemo(() => {
    if (type === 'runway') {
      return new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.2
      });
    }
    return new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.1,
      transmission: ['overhead', 'underground'].includes(type) ? 0.5 : 0,
      transparent: ['overhead', 'underground'].includes(type),
      clearcoat: 1,
      clearcoatRoughness: 0.1
    });
  }, [type]);

  const mesh = React.useRef();

  useFrame((state) => {
    if (type !== 'runway') {
      const time = state.clock.getElapsedTime() * 0.3;
      const factor = type === 'underground' ? -1 : 1; // Reverse animation for underground structures
      mesh.current.rotation.x += Math.sin(time + mesh.current.position.x) * 0.0002 * factor;
      mesh.current.rotation.z += Math.cos(time + mesh.current.position.z) * 0.0002 * factor;
    }
  });

  return (
    <mesh
      ref={mesh}
      geometry={geometry}
      material={material}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    />
  );
}

function Scene({ onModelSelect }) {
  const structures = useMemo(() => createParametricStructures(), []);

  return (
    <group>
      {structures.map((structure, index) => (
        <ParametricStructure key={index} {...structure} />
      ))}
      
      {/* Add walking model */}
      <SimpleModel onSelect={onModelSelect} />
      
      {/* Add spotlights along the runway */}
      <spotLight
        position={[0, 30, 0]}
        angle={Math.PI / 6}
        penumbra={0.1}
        decay={1.5}
        distance={100}
        intensity={1}
        castShadow
      />
      <spotLight
        position={[-20, 20, -10]}
        angle={Math.PI / 8}
        penumbra={0.2}
        decay={1.5}
        distance={80}
        intensity={0.8}
        castShadow
      />
      
      {/* Add point lights for additional highlights */}
      <pointLight position={[0, 15, 2]} intensity={0.5} />
      <pointLight position={[0, 15, -2]} intensity={0.5} />
    </group>
  );
}

export default Scene; 