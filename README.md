# Cosmic Portfolio

An immersive 3D space portfolio with Z-axis scroll navigation.

## Technologies
- **React 18**
- **TypeScript**
- **Three.js** (@react-three/fiber, @react-three/drei)
- **Tailwind CSS**
- **Vite**

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

## Structure
- `src/components/Scene.tsx`: Main 3D scene containing the Z-axis scroll logic.
- `src/components/Planet.tsx`: Individual planet meshes and shaders (including procedural Jupiter & Mars).
- `src/components/NavigationOverlay.tsx`: 2D UI overlay for navigation and audio control.