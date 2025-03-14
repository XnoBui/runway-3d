import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Scene from './components/Scene';
import './App.css';

function ModelInfo({ model, onClose }) {
  if (!model) return null;
  
  return (
    <div className="model-info">
      <span className="close-btn" onClick={onClose}>✕</span>
      <h3>{model.name}: {model.outfit}</h3>
      <p>{model.description}</p>
    </div>
  );
}

function App() {
  const [selectedModel, setSelectedModel] = useState(null);

  return (
    <div className="App">
      <div className="info">DRAG TO ROTATE | SCROLL TO ZOOM | CLICK MODELS FOR INFO</div>
      <div className="logo">AEAEA</div>
      <div className="title">PARAMETRIC</div>
      <div className="subtitle">ANGULAR COLLECTION</div>
      
      <Canvas
        camera={{ 
          position: [-50, 30, 20],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        style={{ width: '100vw', height: '100vh' }}
        shadows
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 60, 180]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight 
          position={[5, 80, 5]} 
          intensity={2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={1000}
        />

        {/* Main Scene */}
        <Scene onModelSelect={setSelectedModel} />
        
        {/* Controls */}
        <OrbitControls 
          target={[0, 8, 0]}
          enableDamping
          dampingFactor={0.05}
          minDistance={30}
          maxDistance={150}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI * 0.6}
          enablePan={true}
          panSpeed={0.5}
        />
        
        {/* Environment */}
        <Environment preset="night" />
      </Canvas>

      <ModelInfo model={selectedModel} onClose={() => setSelectedModel(null)} />
    </div>
  );
}

export default App;
