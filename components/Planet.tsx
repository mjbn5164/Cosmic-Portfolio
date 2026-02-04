import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import '../types';

interface PlanetProps {
  position: [number, number, number];
  size: number;
  textureType: 'sun' | 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus';
}

// --- EARTH COMPONENT ---
const EarthMesh: React.FC = () => {
  const earthRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);

  const [colorMap, normalMap, specularMap, cloudsMap] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
  ]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (earthRef.current) earthRef.current.rotation.y = t * 0.1;
    if (cloudsRef.current) cloudsRef.current.rotation.y = t * 0.12;
  });

  return (
    <group>
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial map={colorMap} normalMap={normalMap} specularMap={specularMap} shininess={10} />
      </mesh>
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.015, 64, 64]} />
        <meshStandardMaterial map={cloudsMap} transparent={true} opacity={0.4} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.02, 64, 64]} />
        <meshBasicMaterial color="#4ca6ff" transparent={true} opacity={0.15} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

// --- MARS COMPONENT (Procedural Shader) ---
const MarsMesh: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
        meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  const marsShader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      // Simple pseudo-noise function
      float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
      float noise(vec2 x) {
          vec2 i = floor(x);
          vec2 f = fract(x);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      float fbm(vec2 x) {
          float v = 0.0;
          float a = 0.5;
          vec2 shift = vec2(100.0);
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(00.5));
          for (int i = 0; i < 5; ++i) {
              v += a * noise(x);
              x = rot * x * 2.0 + shift;
              a *= 0.5;
          }
          return v;
      }

      void main() {
        // Distort UVs for spherical wrapping simulation
        vec2 uv = vUv;
        float n = fbm(uv * 8.0);
        
        vec3 cRed = vec3(0.8, 0.35, 0.2);
        vec3 cDark = vec3(0.5, 0.2, 0.1);
        
        vec3 col = mix(cRed, cDark, smoothstep(0.4, 0.7, n));
        
        // Add polar caps
        float polar = smoothstep(0.45, 0.5, abs(uv.y - 0.5));
        if (uv.y < 0.05 || uv.y > 0.95) {
             float capNoise = fbm(uv * 20.0);
             float threshold = (uv.y > 0.95 ? 0.95 : 0.05);
             // Rough approximation of ice caps
             col = mix(col, vec3(0.9, 0.9, 0.9), step(0.5, capNoise) * smoothstep(0.05, 0.0, abs(uv.y - threshold)));
        }

        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(vec3(1.0, 0.2, 1.0));
        float diff = max(dot(normal, lightDir), 0.05);
        
        // Atmospheric glow (Fresnel)
        vec3 viewDir = normalize(vViewPosition);
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
        
        vec3 finalColor = col * diff + vec3(0.3, 0.1, 0.05) * fresnel * 0.5;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  }), []);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial args={[marsShader]} />
    </mesh>
  );
};

// --- JUPITER COMPONENT (Ultra Realistic Shader) ---
const JupiterMesh: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
        // Rotação ajustada para a Mancha ser visível na primeira passagem.
        // A mancha está em UV x=0.65. Para trazê-la para a frente (+Z), 
        // usamos um offset inicial de 3.8 radianos.
        // Velocidade aumentada para 0.1 (anteriormente 0.04) para maior dinamismo
        meshRef.current.rotation.y = 3.8 + state.clock.getElapsedTime() * 0.1; 
        
        // @ts-ignore
        if (meshRef.current.material.uniforms) {
            // @ts-ignore
            meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    }
  });

  const jupiterShader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      // Simplex Noise 
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      float fbm(vec2 p) {
        float f = 0.0;
        float w = 0.5;
        for (int i = 0; i < 6; i++) { // Mais oitavas para detalhe
            f += w * snoise(p);
            p *= 2.05;
            w *= 0.48;
        }
        return f;
      }

      // Warping para criar o efeito de "óleo na água" característico de Júpiter
      float pattern(vec2 p, out vec2 q, out vec2 r) {
        // Movimento muito lento das nuvens
        float t = uTime * 0.005; 
        
        q.x = fbm(p + vec2(0.0, 0.0));
        q.y = fbm(p + vec2(5.2, 1.3));
        
        r.x = fbm(p + 4.0*q + vec2(1.7, 9.2) + vec2(t, 0.0));
        r.y = fbm(p + 4.0*q + vec2(8.3, 2.8));
        
        return fbm(p + 4.0*r);
      }

      void main() {
        vec2 uv = vUv;
        
        // --- PALETA DE CORES (Baseada na imagem de referência) ---
        vec3 cWhite    = vec3(0.90, 0.90, 0.92); // Branco azulado (Zonas)
        vec3 cCream    = vec3(0.90, 0.82, 0.70); // Creme (Zonas tropicais)
        vec3 cBeltDark = vec3(0.50, 0.25, 0.15); // Castanho Ferrugem Escuro (Cinturões)
        vec3 cBeltLight= vec3(0.70, 0.45, 0.30); // Castanho Claro
        vec3 cPolar    = vec3(0.55, 0.53, 0.50); // Cinzento (Polos)
        
        // --- GERAR TEXTURA PROCEDURAL ---
        vec2 q, r;
        // Escala UV: X esticado para bandas, Y comprimido para detalhes finos
        vec2 turbUV = uv * vec2(3.5, 12.0);
        float noiseVal = pattern(turbUV, q, r);
        
        // --- ESTRUTURA DE BANDAS (Latitude) ---
        // Adiciona distorção à coordenada Y para as bandas não serem retas
        float lat = uv.y + (noiseVal * 0.05) - (r.x * 0.03); 

        vec3 col = cCream;

        // Mapeamento aproximado das latitudes (0=Sul, 1=Norte)
        // A Grande Mancha está no cinturão sul (~0.3-0.4)

        if (lat < 0.15) {
             // Polo Sul
             col = mix(cPolar, cBeltLight, noiseVal);
        } else if (lat < 0.28) {
             // Zona Temperada Sul (Clara)
             col = mix(cCream, cWhite, noiseVal * 0.6);
        } else if (lat < 0.44) {
             // Cinturão Equatorial Sul (SEB) - Escuro, abriga a mancha
             col = mix(cBeltDark, cBeltLight, noiseVal * 0.8 + 0.2);
             // Pequena subdivisão clara dentro do cinturão
             if(lat > 0.39 && lat < 0.41) col = mix(col, cCream, 0.3);
        } else if (lat < 0.56) {
             // Zona Equatorial (EZ) - A faixa central brilhante e turbulenta
             float turbulentClouds = smoothstep(0.3, 0.8, noiseVal);
             col = mix(cWhite, cCream, turbulentClouds);
             // Adiciona um tom azulado subtil nas partes mais brancas (efeito ótico)
             col += vec3(0.0, 0.0, 0.05) * turbulentClouds;
        } else if (lat < 0.72) {
             // Cinturão Equatorial Norte (NEB) - Escuro e ondulado
             col = mix(cBeltDark, cBeltLight, noiseVal);
        } else if (lat < 0.85) {
             // Zonas Tropicais Norte
             col = mix(cCream, cWhite, noiseVal * 0.5);
        } else {
             // Polo Norte
             col = mix(cPolar, cBeltLight, noiseVal);
        }

        // --- GRANDE MANCHA VERMELHA (The Great Red Spot) ---
        // Posição: Hemisfério Sul, "mordendo" o cinturão SEB
        vec2 spotPos = vec2(0.65, 0.35); 
        // Coordenadas relativas
        vec2 d = uv - spotPos;
        d.x *= 1.8; // Aspect ratio elíptico (1.8x mais largo que alto)
        float dist = length(d);

        // Tamanho da mancha - REDUZIDO PARA METADE DA ÁREA (raio * ~0.7)
        // Original: 0.13 -> Novo: 0.092
        if (dist < 0.092) {
            // Vórtice Complexo
            float angle = atan(d.y, d.x);
            // Espiral distorcida
            float spiral = angle + dist * 20.0; 
            
            // Textura interna usando noise de alta frequência
            // Usando fbm para mais detalhe que snoise simples
            float spotDetail = fbm(vec2(spiral * 2.0, dist * 40.0));
            
            // Mistura de cores para a mancha
            vec3 spotMain = vec3(0.75, 0.25, 0.1); // Laranja avermelhado
            vec3 spotDark = vec3(0.4, 0.1, 0.05);  // Vermelho escuro/Castanho
            
            // Cor base texturizada
            vec3 spotColor = mix(spotMain, spotDark, spotDetail);
            
            // Núcleo do olho (mais escuro e calmo)
            // Ajustado proporcionalmente: 0.05 -> 0.035, 0.02 -> 0.015
            float eye = smoothstep(0.035, 0.015, dist);
            spotColor = mix(spotColor, vec3(0.3, 0.05, 0.02), eye * 0.5);

            // Borda suave
            // Ajustado proporcionalmente: 0.13 -> 0.092, 0.11 -> 0.078
            float alpha = smoothstep(0.092, 0.078, dist);
            
            // Mistura final com o planeta
            col = mix(col, spotColor, alpha);
        }

        // --- ILUMINAÇÃO ---
        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(vec3(1.0, 0.3, 1.0));
        float diff = max(dot(normal, lightDir), 0.05); // Luz difusa
        
        // Fresnel atmosférico (brilho nas bordas)
        vec3 viewDir = normalize(vViewPosition);
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
        
        // Aplicar iluminação
        vec3 finalColor = col * diff;
        
        // Adicionar atmosfera suave
        finalColor += vec3(0.1, 0.1, 0.15) * fresnel * 0.5;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  }), []);

  return (
    <mesh ref={meshRef}>
      {/* Geometria de alta densidade para o shader funcionar bem nos polos */}
      <sphereGeometry args={[1, 128, 128]} /> 
      <shaderMaterial args={[jupiterShader]} />
    </mesh>
  );
};

// --- SHADER DEFINITIONS FOR OTHER PLANETS ---

const standardVertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const sunFragmentShader = `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
        float noise = sin(vUv.x * 20.0 + uTime) * cos(vUv.y * 20.0 + uTime);
        vec3 color = vec3(1.0, 0.6, 0.0) + vec3(0.4, 0.2, 0.0) * noise;
        float intensity = 1.05 - dot(vNormal, vec3(0.0, 0.0, 1.0));
        vec3 glow = vec3(1.0, 0.4, 0.0) * pow(intensity, 3.0);
        gl_FragColor = vec4(color + glow, 1.0);
    }
`;

const uranusRingShader = {
  uniforms: { uSize: { value: 1.0 } },
  vertexShader: `varying vec3 vPos; void main() { vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
    uniform float uSize; varying vec3 vPos;
    void main() {
      float dist = length(vPos.xy) / uSize;
      vec3 color = vec3(0.6, 0.8, 0.9);
      float rings = sin(dist * 150.0);
      float alpha = smoothstep(0.0, 0.1, rings) * smoothstep(1.45, 1.5, dist) * (1.0 - smoothstep(1.95, 2.0, dist));
      gl_FragColor = vec4(color, alpha * 0.4);
    }
  `
};

// Updated Saturn Ring Shader with Cassini Division and Glow
const saturnRingShader = {
  uniforms: { uSize: { value: 1.0 } },
  vertexShader: `varying vec3 vPos; void main() { vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
    uniform float uSize; varying vec3 vPos;
    void main() {
      float dist = length(vPos.xy) / uSize;
      
      // Base colors for rings
      vec3 innerColor = vec3(0.7, 0.65, 0.6);
      vec3 outerColor = vec3(0.65, 0.6, 0.55);
      
      vec3 color = mix(innerColor, outerColor, smoothstep(1.4, 2.4, dist));
      
      // Fine ring details (stripes)
      float ringDetail = sin(dist * 120.0) * 0.5 + 0.5;
      ringDetail += sin(dist * 400.0) * 0.2;
      
      // Apply details
      color *= (0.8 + 0.2 * ringDetail);

      // Subtle emissive glow
      vec3 glow = vec3(0.1, 0.08, 0.05) * 0.4;
      color += glow;

      float alpha = 0.95;
      
      // Ring opacity edges
      if (dist < 1.4 || dist > 2.4) alpha = 0.0;
      
      // Cassini Division (Sharp gap around 1.95)
      float cassiniCenter = 1.95;
      float cassiniWidth = 0.05;
      // Calculate gap presence
      float inCassini = smoothstep(cassiniCenter - cassiniWidth, cassiniCenter - cassiniWidth + 0.01, dist) * 
                        (1.0 - smoothstep(cassiniCenter + cassiniWidth - 0.01, cassiniCenter + cassiniWidth, dist));
      
      // Make the division transparent
      if (inCassini > 0.0) alpha *= 0.15;

      // Soften inner/outer edges
      alpha *= smoothstep(1.4, 1.45, dist) * (1.0 - smoothstep(2.35, 2.4, dist));

      gl_FragColor = vec4(color, alpha);
    }
  `
};

// --- PROCEDURAL PLANET MATERIAL FOR OTHERS ---
const ProceduralPlanetMesh: React.FC<{ textureType: string }> = ({ textureType }) => {
  const mapTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        const w = 512; const h = 512;
        // MARS removed from here, now has its own component
        if (textureType === 'saturn') {
            // SATURN: Smooth Blended Bands using LinearGradient
            const gradient = ctx.createLinearGradient(0, 0, 0, h);
            const numStops = 50; 
            for (let i = 0; i <= numStops; i++) {
                const isBrown = Math.random() < 0.25; 
                let r, g, b;
                if (isBrown) {
                     r = 170 + Math.random() * 40; g = 150 + Math.random() * 30; b = 120 + Math.random() * 20;
                } else {
                     const val = 155 + Math.random() * 70; r = val; g = val; b = val + Math.random() * 10;
                }
                gradient.addColorStop(i / numStops, `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`);
            }
            ctx.fillStyle = gradient; ctx.fillRect(0, 0, w, h);
            // Noise streaks
            for(let i=0; i<3000; i++) {
                const x = Math.random() * w; const y = Math.random() * h;
                const width = Math.random() * 20 + 5; const alpha = Math.random() * 0.05;
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`; ctx.fillRect(x, y, width, 1);
            }
            // Shadow gradient
            const g = ctx.createLinearGradient(0,0,0,h);
            g.addColorStop(0, 'rgba(0,0,0,0.3)'); g.addColorStop(0.5, 'rgba(255,255,255,0.05)'); g.addColorStop(1, 'rgba(0,0,0,0.3)');
            ctx.fillStyle = g; ctx.fillRect(0,0,w,h);

        } else if (textureType === 'uranus') {
            ctx.fillStyle = '#aae0fa'; ctx.fillRect(0,0,w,h);
        }
    }
    return new THREE.CanvasTexture(canvas);
  }, [textureType]);

  let baseColor = "#ffffff";
  if (textureType === 'saturn') baseColor = "#c0c0c0";
  if (textureType === 'uranus') baseColor = "#aae0fa";

  return (
    <meshStandardMaterial 
      map={mapTexture} 
      color={baseColor}
      roughness={0.5}
      metalness={0.1}
      emissive={baseColor}
      emissiveIntensity={0.15}
    />
  );
};

export const Planet: React.FC<PlanetProps> = ({ 
  position, size, textureType
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  const ringUniforms = useMemo(() => ({ uSize: { value: size } }), [size]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (materialRef.current) materialRef.current.uniforms.uTime.value = t;
    if (meshRef.current) meshRef.current.rotation.y = t * 0.1;
    if (ringRef.current) ringRef.current.rotation.z = t * 0.02;
  });

  if (textureType === 'earth') return <group position={position} scale={[size, size, size]}><EarthMesh /></group>;
  if (textureType === 'mars') return <group position={position} scale={[size, size, size]}><MarsMesh /></group>;
  if (textureType === 'jupiter') return <group position={position} scale={[size, size, size]}><JupiterMesh /></group>;

  const planetRotation: [number, number, number] = textureType === 'uranus' 
    ? [0, 0, Math.PI / 2.1] : [0, 0, 0];

  return (
    <group position={position}>
      <group rotation={planetRotation}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[size, 64, 64]} />
          {textureType === 'sun' ? (
            <shaderMaterial ref={materialRef} vertexShader={standardVertexShader} fragmentShader={sunFragmentShader} uniforms={uniforms} />
          ) : (
            <ProceduralPlanetMesh textureType={textureType} />
          )}
        </mesh>
        {textureType === 'uranus' && (
           <mesh><sphereGeometry args={[size * 1.05, 64, 64]} /><meshBasicMaterial color="#afeeee" transparent opacity={0.1} side={THREE.BackSide} /></mesh>
        )}
        {(textureType === 'saturn' || textureType === 'uranus') && (
          <mesh ref={ringRef} rotation={[textureType === 'saturn' ? Math.PI / 2.2 : Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 1.4, size * 2.4, 64]} />
            <shaderMaterial 
              uniforms={ringUniforms}
              vertexShader={textureType === 'saturn' ? saturnRingShader.vertexShader : uranusRingShader.vertexShader}
              fragmentShader={textureType === 'saturn' ? saturnRingShader.fragmentShader : uranusRingShader.fragmentShader}
              transparent side={THREE.DoubleSide} depthWrite={false} 
            />
          </mesh>
        )}
      </group>
    </group>
  );
};