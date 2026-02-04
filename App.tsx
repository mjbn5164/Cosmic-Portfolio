import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import SceneContent from './components/Scene';
import NavigationOverlay from './components/NavigationOverlay';

const App: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: 'black' }}>
      
      {/* 1. A UI FICA AQUI (Fora do Canvas!) */}
      <div className="absolute top-5 left-0 w-full z-10 flex justify-between px-8 pointer-events-none text-white">
        <h1 className="text-xl font-bold tracking-widest uppercase opacity-80">Portfolio</h1>
        <div className="text-sm font-light opacity-60">
          <span>Scroll: Explore System</span>
        </div>
      </div>

      <NavigationOverlay />

      {/* 2. O MUNDO 3D FICA POR BAIXO */}
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 60, near: 0.1, far: 1000 }} 
        dpr={[1, 2]} 
        gl={{ antialias: true }}
        className="touch-none" 
      >
        <Suspense fallback={null}>
          <ScrollControls pages={6} damping={0.3}>
            <SceneContent />
          </ScrollControls>
        </Suspense>
      </Canvas>

      <div className="absolute bottom-5 left-0 w-full text-center pointer-events-none opacity-30 text-[10px] text-white z-10">
        EXPERIÊNCIA IMERSIVA WEBGL
      </div>
    </div>
  );
};

export default App;