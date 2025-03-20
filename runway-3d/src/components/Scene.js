import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function createParametricStructures() {
  const structures = [];
  
  // Create central runway - balanced position
  const runwayGeometry = new THREE.BoxGeometry(150, 10, 3); // Reduced width to 10, increased thickness to 3
  const runway = {
    geometry: runwayGeometry,
    position: [0, 5, 0], // Adjusted y-position to half the new height
    rotation: [0, 0, 0],
    type: 'runway'
  };
  structures.push(runway);

  // Add runway-style structures underneath - evenly distributed
  for (let i = 0; i < 12; i++) {
    const length = 20 + Math.random() * 25; // Scaled down: 20-45 units
    const height = 4 + Math.random() * 2;
    const width = 4 + Math.random() * 2;
    
    const geometry = new THREE.BoxGeometry(length, height, width);
    const position = [
      -75 + (i * 12.5), // Evenly distributed from -75 to 75
      -10 - i * 2, // Staggered height
      -5 + Math.random() * 10
    ];
    const rotation = [
      Math.random() * Math.PI * 0.1,
      Math.random() * Math.PI * 0.2,
      Math.random() * Math.PI * 0.1
    ];
    
    structures.push({ 
      geometry, 
      position, 
      rotation, 
      type: 'runway_style' 
    });
  }

  // Create left structures - balanced spread
  for (let i = 0; i < 15; i++) {
    const width = 5 + Math.random() * 10; // 5-15 units
    const height = 0.2;
    const depth = 1 + Math.random() * 3;
    
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const position = [
      -15 - Math.random() * 15, // -15 to -30
      2 + i * 1.5, // 2 to 25
      -15 + Math.random() * 30 // -15 to 15
    ];
    const rotation = [
      Math.random() * Math.PI * 0.2,
      Math.random() * Math.PI * 0.2,
      Math.random() * Math.PI * 0.5
    ];
    
    structures.push({ geometry, position, rotation, type: 'structure' });
  }

  // Create right structures - balanced with left
  for (let i = 0; i < 15; i++) {
    const width = 5 + Math.random() * 10; // 5-15 units
    const height = 0.2;
    const depth = 1 + Math.random() * 3;
    
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const position = [
      15 + Math.random() * 15, // 15 to 30
      2 + i * 1.5, // 2 to 25
      -15 + Math.random() * 30 // -15 to 15
    ];
    const rotation = [
      Math.random() * Math.PI * 0.2,
      Math.random() * Math.PI * 0.2,
      Math.random() * Math.PI * 0.5
    ];
    
    structures.push({ geometry, position, rotation, type: 'structure' });
  }

  // Add thin structures on left side
  for (let i = 0; i < 10; i++) {
    const width = 10 + Math.random() * 20; // 10-30 units
    const height = 0.15;
    const depth = 0.8 + Math.random() * 1.2;
    
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const position = [
      -10 - Math.random() * 10, // -10 to -20
      11, // Just above runway
      -10 + Math.random() * 20 // -10 to 10
    ];
    const rotation = [
      Math.random() * Math.PI * 0.1,
      Math.random() * Math.PI * 0.15,
      Math.random() * Math.PI * 0.1
    ];
    
    structures.push({ 
      geometry, 
      position, 
      rotation, 
      type: 'thin_structure' 
    });
  }

  // Add thin structures on right side
  for (let i = 0; i < 10; i++) {
    const width = 10 + Math.random() * 20; // 10-30 units
    const height = 0.15;
    const depth = 0.8 + Math.random() * 1.2;
    
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const position = [
      10 + Math.random() * 10, // 10 to 20
      11, // Just above runway
      -10 + Math.random() * 20 // -10 to 10
    ];
    const rotation = [
      Math.random() * Math.PI * 0.1,
      Math.random() * Math.PI * 0.15,
      Math.random() * Math.PI * 0.1
    ];
    
    structures.push({ 
      geometry, 
      position, 
      rotation, 
      type: 'thin_structure' 
    });
  }

  // Create overhead structures - balanced distribution
  for (let i = 0; i < 20; i++) {
    const length = 15 + Math.random() * 25; // 15-40 units
    const width = 0.2;
    const height = 0.1;
    
    const geometry = new THREE.BoxGeometry(length, height, width);
    const position = [
      -50 + Math.random() * 100, // -50 to 50
      20 + Math.random() * 20, // 20 to 40
      -20 + Math.random() * 40 // -20 to 20
    ];
    const rotation = [
      Math.random() * Math.PI * 0.1,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 0.1
    ];
    
    structures.push({ geometry, position, rotation, type: 'overhead' });
  }

  // Create image-like structures around runway
  const imageStructures = [
    {
      size: [15, 25, 0.2],
      position: [0, 22, -10],
      rotation: [0, 0, 0],
    },
    {
      size: [20, 15, 0.2],
      position: [-30, 18, 20],
      rotation: [0, Math.PI * 0.2, 0],
    },
    {
      size: [25, 20, 0.2],
      position: [30, 20, 20],
      rotation: [0, -Math.PI * 0.2, 0],
    },
    {
      size: [15, 30, 0.2],
      position: [0, 28, 20],
      rotation: [Math.PI * 0.1, 0, 0],
    }
  ];

  // Add image structures
  imageStructures.forEach(({ size, position, rotation }) => {
    const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
    structures.push({
      geometry,
      position,
      rotation,
      type: 'image'
    });
  });

  // Add floating platforms with clustering near runway ends
  for (let i = 0; i < 20; i++) {
    const width = 8 + Math.random() * 12; // 8-20 units
    const height = 0.3;
    const depth = 2 + Math.random() * 6; // 2-8 units
    
    // Create clustering effect near runway ends
    const xCluster = Math.random() < 0.6 ? 
      (Math.random() < 0.5 ? -75 + Math.random() * 15 : 60 + Math.random() * 15) : // 60% chance near ends
      -60 + Math.random() * 120; // 40% chance anywhere
    
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const position = [
      xCluster,
      5 + Math.random() * 15, // 5 to 20
      -15 + Math.random() * 30 // -15 to 15
    ];
    const rotation = [
      Math.random() * Math.PI * 0.2,
      Math.random() * Math.PI * 0.5,
      Math.random() * Math.PI * 0.2
    ];
    
    structures.push({ 
      geometry, 
      position, 
      rotation, 
      type: 'platform' 
    });
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

    // Move model along runway - adjusted for longer runway
    const x = -145 + walkProgress.current * 290; // Adjusted range for longer runway (-145 to +145)
    group.current.position.x = x;
    
    // Add more subtle bobbing motion
    group.current.position.y = 8 + Math.sin(state.clock.elapsedTime * 2) * 0.05;

    // Slower leg movement for graceful walk
    const legRotation = Math.sin(state.clock.elapsedTime * 2) * 0.2;
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
      position={[0, 15, 0]} // Adjusted for new runway height
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
    if (type === 'runway' || type === 'runway_style') {
      return new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.3,
        clearcoat: 0.5,
        clearcoatRoughness: 0.2,
        transparent: type === 'runway_style',
        opacity: type === 'runway_style' ? 0.8 : 1
      });
    }
    if (type === 'central') {
      return new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.4,
        transmission: 0.2,
        transparent: true,
        clearcoat: 0.9,
        clearcoatRoughness: 0.1
      });
    }
    if (type === 'image') {
      return new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.8,
        transmission: 0.5,
        transparent: true,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide
      });
    }
    if (type === 'stick' || type === 'diagonal_stick') {
      return new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.8,
        transmission: 0.3,
        transparent: true,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
      });
    }
    if (type === 'floating_stick' || type === 'curved_stick') {
      return new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.05,
        metalness: 0.9,
        transmission: 0.4,
        transparent: true,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05
      });
    }
    return new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.2,
      transmission: ['overhead', 'underground'].includes(type) ? 0.3 : 0,
      transparent: ['overhead', 'underground'].includes(type),
      clearcoat: 0.8,
      clearcoatRoughness: 0.2
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
      
      {/* Add walking model with adjusted range */}
      <SimpleModel onSelect={onModelSelect} />
      
      {/* Adjusted spotlights */}
      <spotLight
        position={[0, 35, 0]}
        angle={Math.PI / 4}
        penumbra={0.2}
        decay={1.2}
        distance={100}
        intensity={2}
        castShadow
      />
      
      <spotLight
        position={[-20, 25, -10]}
        angle={Math.PI / 6}
        penumbra={0.3}
        decay={1.2}
        distance={80}
        intensity={1.5}
        castShadow
      />

      <spotLight
        position={[20, 25, 10]}
        angle={Math.PI / 6}
        penumbra={0.3}
        decay={1.2}
        distance={80}
        intensity={1.5}
        castShadow
      />
      
      {/* Adjusted point lights */}
      <pointLight position={[-15, 12, 0]} intensity={1} />
      <pointLight position={[15, 12, 0]} intensity={1} />
      <pointLight position={[0, 15, -15]} intensity={1} />
      <pointLight position={[0, 15, 15]} intensity={1} />
    </group>
  );
}

export default Scene; 