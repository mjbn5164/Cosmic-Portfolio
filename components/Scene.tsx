import React, { useRef, useMemo, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import { Group, ShaderMaterial, Vector3 } from 'three';
import gsap from 'gsap';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Planet } from './Planet';
import '../types';

// Custom Nebula Component
const Nebula: React.FC = () => {
  const materialRef = useRef<ShaderMaterial>(null);
  useFrame((state) => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.2;
  });
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new Vector3(0.02, 0.01, 0.05) }, 
    uColor2: { value: new Vector3(0.18, 0.0, 0.27) },  
    uColor3: { value: new Vector3(0.0, 0.74, 1.0) }    
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
        vec2 st = vUv * 3.0;
        float q = fbm(st + uTime * 0.1);
        vec2 r = vec2(fbm(st + q + uTime * 0.2 + vec2(1.7, 9.2)), fbm(st + q + uTime * 0.15 + vec2(8.3, 2.8)));
        float f = fbm(st + r);
        vec3 color = mix(uColor1, uColor2, clamp((f*f)*4.0, 0.0, 1.0));
        color = mix(color, uColor3, clamp(length(r.x), 0.0, 1.0));
        float alpha = f * 0.05;
        float dist = distance(vUv, vec2(0.5));
        alpha *= smoothstep(0.6, 0.2, dist);
        gl_FragColor = vec4(color, alpha);
    }
  `;
  return (
    <mesh position={[0, 0, -200]} scale={[300, 300, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={materialRef} transparent depthWrite={false} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
    </mesh>
  );
};

const StarField: React.FC = () => {
  const count = 3000; 
  const materialRef = useRef<ShaderMaterial>(null);
  const { positions, sizes, shifts } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const shifts = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 200; 
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = Math.random() * 1.5 + 0.5;
      shifts[i] = Math.random() * Math.PI;
    }
    return { positions, sizes, shifts };
  }, []);
  useFrame((state) => { if (materialRef.current) materialRef.current.uniforms.uTime.value = state.clock.elapsedTime; });
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  const vertexShader = `
    uniform float uTime; attribute float aSize; attribute float aShift; varying float vAlpha;
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = aSize * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
      float blink = sin(uTime * 0.5 + aShift);
      vAlpha = 0.5 + 0.5 * blink; 
    }
  `;
  const fragmentShader = `
    varying float vAlpha;
    void main() {
      float r = distance(gl_PointCoord, vec2(0.5));
      if (r > 0.5) discard;
      float glow = 1.0 - (r * 2.0); glow = pow(glow, 1.5);
      gl_FragColor = vec4(1.0, 1.0, 1.0, vAlpha * glow);
    }
  `;
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aShift" count={count} array={shifts} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial ref={materialRef} transparent depthWrite={false} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
    </points>
  );
};

const SceneContent: React.FC = () => {
  const scroll = useScroll();
  const { camera } = useThree();
  const starsRef = useRef<Group>(null);
  const nebulaRef = useRef<Group>(null);
  const sunRef = useRef<Group>(null); 
  
  const START_Z = 10;
  const END_Z = -190; 
  const TOTAL_DISTANCE = START_Z - END_Z;

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
    
    if (starsRef.current) { starsRef.current.position.z = camera.position.z * 0.95; starsRef.current.rotation.z += 0.00005; }
    if (nebulaRef.current) { nebulaRef.current.position.z = camera.position.z * 0.95; }
  });

  return (
    <>
      <group ref={nebulaRef}><Nebula /></group>
      <group ref={starsRef}><StarField /></group>

      <ambientLight intensity={1.0} />
      <directionalLight position={[0, 10, 50]} intensity={1.5} color="#ffffff" />
      <pointLight position={[0, 0, 0]} intensity={2.0} distance={1000} decay={0} color="#ffaa00" />

      {/* PLANET OBJECTS (Visuals Only) */}
      <group ref={sunRef}>
        <Planet position={[0, 0, 0]} size={4.8} textureType="sun" />
      </group>

      <Suspense fallback={null}>
        <Planet position={[-3.5, -1, -25]} size={2.0} textureType="earth" />
      </Suspense>

      <Planet position={[4, 2, -55]} size={1.8} textureType="mars" />
      <Planet position={[-4.5, -1.5, -90]} size={4.2} textureType="jupiter" />
      <Planet position={[3.5, 0.5, -125]} size={2.1} textureType="saturn" />
      <Planet position={[-3, -1, -160]} size={1.9} textureType="uranus" />
      
      <EffectComposer enableNormalPass={false}>
        <Bloom luminanceThreshold={0.25} mipmapBlur intensity={0.6} />
      </EffectComposer>
    </>
  );
};

export default SceneContent;