import { Vector3 } from 'three';
import React from 'react';

// Global JSX Intrinsic Elements Augmentation
// This fixes errors where <mesh>, <group>, etc. are not recognized as valid JSX elements.
// Using an index signature allows any element (including standard HTML tags like div, span, etc.),
// preventing conflicts where manual augmentation might shadow standard React types.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Augment React.JSX namespace for newer React type definitions (React 18+)
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
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