import React, { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import { Group, ShaderMaterial, Vector3 } from 'three';
import gsap from 'gsap';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Planet } from './Planet';
import Stars from './Constellations';
import '../types';

// Custom Nebula Component
const Nebula: React.FC = () => {
  const materialRef = useRef<ShaderMaterial>(null);
  useFrame((state) => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.1;
  });
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    // Paleta: Tons de Azul (Escuro, Médio, Claro)
    uColor1: { value: new Vector3(0.0, 0.05, 0.2) },  // Azul Profundo Escuro
    uColor2: { value: new Vector3(0.0, 0.25, 0.6) },  // Azul Médio (Royal)
    uColor3: { value: new Vector3(0.0, 0.6, 1.0) }    // Azul Ciano Brilhante
  }), []);
  const vertexShader = `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `;
  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor1; uniform vec3 uColor2; uniform vec3 uColor3;
    varying vec2 vUv;
    float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
    float noise(vec2 st) {
        vec2 i = floor(st); vec2 f = fract(st);
        float a = random(i); float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    float fbm(vec2 st) {
        float value = 0.0; float amplitude = 0.5;
        for (int i = 0; i < 5; i++) { value += amplitude * noise(st); st *= 2.0; amplitude *= 0.5; }
        return value;
    }
    void main() {
        // Escala aumentada para manter detalhe na mesh gigante
        vec2 st = vUv * 8.0;
        float q = fbm(st + uTime * 0.1);
        vec2 r = vec2(fbm(st + q + uTime * 0.2 + vec2(1.7, 9.2)), fbm(st + q + uTime * 0.15 + vec2(8.3, 2.8)));
        float f = fbm(st + r);
        
        vec3 color = mix(uColor1, uColor2, clamp((f*f)*4.0, 0.0, 1.0));
        color = mix(color, uColor3, clamp(length(r.x), 0.0, 1.0));
        
        // Aumentando o contraste para reduzir a área de cobertura (mais "buracos" negros)
        // smoothstep(0.4, 1.0, f) significa que qualquer valor de noise abaixo de 0.4 será invisível
        float alpha = smoothstep(0.4, 1.0, f) * 0.4;
        
        float dist = distance(vUv, vec2(0.5));
        // Vignette para suavizar bordas (mantendo o efeito full screen mas focado no centro)
        alpha *= smoothstep(0.7, 0.1, dist);
        
        gl_FragColor = vec4(color, alpha);
    }
  `;
  return (
    // Escala massiva para garantir imersão total
    <mesh position={[0, 0, -200]} scale={[2000, 2000, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={materialRef} transparent depthWrite={false} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
    </mesh>
  );
};

const SceneContent: React.FC = () => {
  const scroll = useScroll();
  const { camera, size } = useThree();
  const starsRef = useRef<Group>(null);
  const nebulaRef = useRef<Group>(null);
  const sunRef = useRef<Group>(null); 
  
  // Estado para responsividade
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const START_Z = 10;
  const END_Z = -190; 
  const TOTAL_DISTANCE = START_Z - END_Z;

  // Fator de ajuste horizontal: 
  // No mobile, reduzimos drasticamente o X para os planetas caberem no ecrã vertical
  const xFactor = isMobile ? 0.35 : 1.0;

  useFrame(() => {
    const offset = scroll.offset; 
    
    // ENVIAR O PROGRESSO PARA A UI
    window.dispatchEvent(new CustomEvent('planetScroll', { detail: { offset } }));

    const targetZ = START_Z - (offset * TOTAL_DISTANCE);
    
    // Smooth camera movement
    gsap.to(camera.position, {
      z: targetZ,
      duration: 0.8, 
      ease: "power1.out", 
      overwrite: "auto"
    });

    if (sunRef.current) {
      sunRef.current.position.x = -offset * 100; 
      sunRef.current.position.z = -offset * 40; 
      sunRef.current.scale.setScalar(1 - offset * 0.5); 
    }

    // Ensure camera stays centered (no shake)
    camera.position.x = 0;
    camera.position.y = 0;
    
    if (starsRef.current) { starsRef.current.position.z = camera.position.z * 0.95; }
    if (nebulaRef.current) { nebulaRef.current.position.z = camera.position.z * 0.95; }
  });

  return (
    <>
      <group ref={nebulaRef}><Nebula /></group>
      <group ref={starsRef}><Stars /></group>

      <ambientLight intensity={1.0} />
      <directionalLight position={[0, 10, 50]} intensity={1.5} color="#ffffff" />
      <pointLight position={[0, 0, 0]} intensity={2.0} distance={1000} decay={0} color="#ffaa00" />

      {/* PLANET OBJECTS (Visuals Only) */}
      <group ref={sunRef}>
        <Planet position={[0, 0, 0]} size={4.8} textureType="sun" />
      </group>

      <Suspense fallback={null}>
        {/* EARTH: Multiplicamos o X pelo xFactor para aproximar do centro no mobile */}
        <Planet position={[-3.5 * xFactor, -1, -25]} size={2.0} textureType="earth" />
      </Suspense>

      <Planet position={[4 * xFactor, 2, -55]} size={1.8} textureType="mars" />
      <Planet position={[-4.5 * xFactor, -1.5, -90]} size={4.2} textureType="jupiter" />
      <Planet position={[3.5 * xFactor, 0.5, -125]} size={2.1} textureType="saturn" />
      <Planet position={[-3 * xFactor, -1, -160]} size={1.9} textureType="uranus" />
      
      <EffectComposer enableNormalPass={false}>
        <Bloom luminanceThreshold={0.25} mipmapBlur intensity={0.6} />
      </EffectComposer>
    </>
  );
};

export default SceneContent;