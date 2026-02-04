import React from 'react';
import { Html } from '@react-three/drei';

interface OverlayProps {
  title: string;
  description: string;
  buttonText: string;
  opacity: number;
}

export const Overlay: React.FC<OverlayProps> = ({ title, description, buttonText, opacity }) => {
  // HIDDEN LOGIC: If opacity is too low OR title is empty, do not render anything.
  // This allows us to have "decorative only" planets like the Sun.
  if (opacity <= 0.05 || !title) return null;

  return (
    <Html
      center
      position={[0, 0, 0]} // Position relative to the parent mesh
      style={{
        transition: 'opacity 0.5s ease-out',
        opacity: opacity,
        pointerEvents: opacity > 0.5 ? 'auto' : 'none',
        width: '300px',
      }}
      distanceFactor={10}
      zIndexRange={[100, 0]}
    >
      <div className="flex flex-col items-center justify-center p-6 text-center text-white bg-black/60 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl shadow-cyan-500/20 transform scale-100">
        <h2 className="text-3xl font-bold mb-2 tracking-wider text-cyan-300 uppercase glow-text">
          {title}
        </h2>
        <p className="text-sm text-gray-300 mb-6 font-light leading-relaxed">
          {description}
        </p>
        <button className="px-6 py-2 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 rounded-full font-medium tracking-widest text-xs uppercase cursor-pointer group">
          {buttonText}
          <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>
    </Html>
  );
};