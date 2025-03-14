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
          position: [0, 25, 60], 
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        style={{ width: '100vw', height: '100vh' }}
        shadows
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 30, 100]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 10, 7]} 
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Main Scene */}
        <Scene onModelSelect={setSelectedModel} />
        
        {/* Controls */}
        <OrbitControls 
          enablePan={true}
          minDistance={20}
          maxDistance={100}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 10, 0]}
          enableDamping={true}
          dampingFactor={0.05}
        />
        
        {/* Environment */}
        <Environment preset="night" />
      </Canvas>

      <ModelInfo model={selectedModel} onClose={() => setSelectedModel(null)} />
    </div>
  );
}

export default App;
