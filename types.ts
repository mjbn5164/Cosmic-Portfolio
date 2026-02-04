import { Vector3 } from 'three';
import React from 'react';

// Global JSX Intrinsic Elements Augmentation for R3F
// This fixes errors where <mesh>, <group>, etc. are not recognized as valid JSX elements.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      group: any;
      sphereGeometry: any;
      meshPhongMaterial: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      shaderMaterial: any;
      ringGeometry: any;
      planeGeometry: any;
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      primitive: any;
    }
  }
}

// Augment React's JSX namespace for React 18+ strict typing
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      group: any;
      sphereGeometry: any;
      meshPhongMaterial: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      shaderMaterial: any;
      ringGeometry: any;
      planeGeometry: any;
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      primitive: any;
    }
  }
}

export interface PlanetProps {
  position: [number, number, number];
  color?: string; // Optional now, as texture drives the look
  size: number;
  title: string;
  description: string;
  buttonText: string;
  zThreshold: number; // The Z camera position where this planet is "active"
  textureType?: 'sun' | 'earth' | 'mars' | 'jupiter' | 'moon' | 'saturn' | 'uranus';
}