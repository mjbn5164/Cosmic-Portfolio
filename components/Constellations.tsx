import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Stars = () => {
  const meshRef = useRef<THREE.Points>(null);

  // 1. Criamos dados únicos para cada estrela
  const { positions, offsets, speeds } = useMemo(() => {
    const pos = [];
    const off = [];
    const spd = [];
    for (let i = 0; i < 6000; i++) {
      // Posição aleatória no espaço
      pos.push((Math.random() - 0.5) * 1000);
      pos.push((Math.random() - 0.5) * 1000);
      pos.push((Math.random() - 0.5) * 1000);
      
      // Offset (tempo de início) e Velocidade de brilho aleatórios
      off.push(Math.random() * Math.PI * 2); 
      spd.push(0.5 + Math.random() * 2.0); 
    }
    return {
      positions: new Float32Array(pos),
      offsets: new Float32Array(off),
      speeds: new Float32Array(spd)
    };
  }, []);

  // 2. Definimos o "Cérebro" das estrelas (Shaders)
  const starShader = {
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: 1.5 }
    },
    vertexShader: `
      uniform float uTime;
      uniform float uSize;
      attribute float aOffset;
      attribute float aSpeed;
      varying float vOpacity;

      void main() {
        // Cálculo do brilho independente: cada estrela usa o seu offset e velocidade
        vOpacity = 0.4 + 0.6 * sin(uTime * aSpeed + aOffset);
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        // Faz com que as estrelas mais longe pareçam menores
        gl_PointSize = uSize * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying float vOpacity;
      void main() {
        // Cria um efeito circular suave (em vez de um quadrado)
        float dist = distance(gl_PointCoord, vec2(0.5));
        if (dist > 0.5) discard;
        
        gl_FragColor = vec4(1.0, 1.0, 1.0, vOpacity);
      }
    `
  };

  useFrame((state) => {
    if (meshRef.current) {
      // Atualiza o tempo global para o Shader saber quando brilhar
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.getElapsedTime();
      // Rotação lentíssima do fundo para dar profundidade
      meshRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aOffset"
          count={offsets.length}
          array={offsets}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          count={speeds.length}
          array={speeds}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        fragmentShader={starShader.fragmentShader}
        vertexShader={starShader.vertexShader}
        uniforms={starShader.uniforms}
      />
    </points>
  );
};

export default Stars;